from typing import Optional

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.restaurant import Restaurant
from app.rag.vector_store import similarity_search
from app.rag.generator import llm


# pgvector returns cosine distance where lower values indicate
# stronger semantic similarity.
RAG_DISTANCE_THRESHOLD = 0.75

# Prevent unnecessarily large vector searches.
MAX_RESULTS = 10


def search_restaurants(
    query: str,
    k: int = 5,
    location: Optional[str] = None,
    cuisine: Optional[str] = None,
    min_rating: Optional[float] = None,
    price_range: Optional[str] = None,
):
    """
    Hybrid restaurant retrieval.

    PostgreSQL applies structured filters first.
    PostgreSQL + pgvector provides semantic ranking over
    a larger candidate set.

    Only restaurants approved by PostgreSQL are returned.

    pgvector cosine distance scores above the configured
    relevance threshold are discarded.
    """

    query = query.strip()

    if not query:
        return []

    k = max(1, min(k, MAX_RESULTS))

    db: Session = SessionLocal()

    try:
        # ---------------------------------------------------------
        # 1. Apply structured filters in PostgreSQL
        # ---------------------------------------------------------

        db_query = db.query(Restaurant)

        if location:
            db_query = db_query.filter(
                Restaurant.location.ilike(
                    f"%{location.strip()}%"
                )
            )

        if cuisine:
            db_query = db_query.filter(
                Restaurant.cuisine.ilike(
                    f"%{cuisine.strip()}%"
                )
            )

        if min_rating is not None:
            db_query = db_query.filter(
                Restaurant.rating >= min_rating
            )

        if price_range:
            db_query = db_query.filter(
                Restaurant.price_range == price_range.strip()
            )

        restaurants = db_query.all()

        if not restaurants:
            return []

        # PostgreSQL-approved restaurant IDs.
        allowed_ids = {
            restaurant.id
            for restaurant in restaurants
        }

        # ---------------------------------------------------------
        # 2. Broad semantic search using pgvector
        # ---------------------------------------------------------

        semantic_results = similarity_search(
            query=query,
            k=min(max(k * 5, 20), 100),
        )

        # ---------------------------------------------------------
        # 3. Apply semantic relevance + PostgreSQL filtering
        # ---------------------------------------------------------

        results = []

        for result in semantic_results:
            metadata = result.get("metadata") or {}

            restaurant_id = metadata.get("restaurant_id")
            score = result.get("score")

            if restaurant_id is None:
                continue

            try:
                restaurant_id = int(restaurant_id)
                score = float(score)
            except (TypeError, ValueError):
                continue

            # Lower pgvector cosine distance = stronger similarity.
            if score > RAG_DISTANCE_THRESHOLD:
                continue

            if restaurant_id not in allowed_ids:
                continue

            results.append(
                {
                    "content": result["content"],
                    "metadata": metadata,
                    "score": score,
                }
            )

        # ---------------------------------------------------------
        # 4. Return top-k relevant results
        # ---------------------------------------------------------

        return results[:k]

    finally:
        db.close()


def _extract_response_text(content) -> str:
    """
    Normalize Gemini/LangChain response content into plain text.
    """

    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        text_parts = []

        for block in content:
            if isinstance(block, dict):
                text = block.get("text")

                if isinstance(text, str):
                    text_parts.append(text)

        return "".join(text_parts).strip()

    return str(content).strip()


def generate_restaurant_answer(
    query: str,
    k: int = 5,
    location: Optional[str] = None,
    cuisine: Optional[str] = None,
    min_rating: Optional[float] = None,
    price_range: Optional[str] = None,
):
    """
    Retrieve restaurants using hybrid search and generate a
    grounded natural-language response.
    """

    results = search_restaurants(
        query=query,
        k=k,
        location=location,
        cuisine=cuisine,
        min_rating=min_rating,
        price_range=price_range,
    )

    if not results:
        return {
            "answer": "I couldn't find any restaurants matching your request.",
            "sources": [],
        }

    context = "\n\n".join(
        result["content"]
        for result in results
    )

    prompt = f"""
You are FoodiePilot, an AI restaurant discovery assistant.

Answer the user's request using ONLY the restaurant information
provided in the context below.

Strict grounding rules:
- Do not invent restaurants.
- Do not invent ratings.
- Do not invent cuisines.
- Do not invent prices.
- Do not invent locations.
- Do not invent availability.
- Do not claim information that is not present in the context.
- If the context is insufficient, clearly say so.
- Do not mention "ambiance", "atmosphere", "romantic", "family-friendly",
  or other subjective characteristics unless they are explicitly present
  in the provided context.
- Keep the response concise and useful.

Restaurant Context:
{context}

User Request:
{query}
"""

    response = llm.invoke(prompt)

    answer = _extract_response_text(response.content)

    if not answer:
        answer = (
            "I found matching restaurants, "
            "but I couldn't generate a response."
        )

    return {
        "answer": answer,
        "sources": [
            {
                "restaurant_id": result["metadata"]["restaurant_id"],
                "name": result["metadata"]["name"],
                "score": result["score"],
            }
            for result in results
        ],
    }