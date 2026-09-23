import json

from sqlalchemy import text

from app.database.database import engine
from app.rag.embeddings import embeddings


def add_restaurant_embeddings(
    ids: list[str],
    restaurant_ids: list[int],
    texts: list[str],
    metadatas: list[dict],
):
    if not texts:
        return

    vectors = embeddings.embed_documents(texts)

    with engine.begin() as connection:
        for item_id, restaurant_id, content, vector, metadata in zip(
            ids,
            restaurant_ids,
            texts,
            vectors,
            metadatas,
        ):
            connection.execute(
                text(
                    """
                    INSERT INTO restaurant_embeddings
                    (id, restaurant_id, content, embedding, metadata)
                    VALUES (
                        :id,
                        :restaurant_id,
                        :content,
                        CAST(:embedding AS vector),
                        CAST(:metadata AS jsonb)
                    )
                    ON CONFLICT (id)
                    DO UPDATE SET
                        restaurant_id = EXCLUDED.restaurant_id,
                        content = EXCLUDED.content,
                        embedding = EXCLUDED.embedding,
                        metadata = EXCLUDED.metadata
                    """
                ),
                {
                    "id": item_id,
                    "restaurant_id": restaurant_id,
                    "content": content,
                    "embedding": str(vector),
                    "metadata": json.dumps(metadata),
                },
            )


def similarity_search(
    query: str,
    k: int = 5,
):
    query_vector = embeddings.embed_query(query)

    with engine.connect() as connection:
        result = connection.execute(
            text(
                """
                SELECT
                    content,
                    metadata,
                    embedding <=> CAST(:query_embedding AS vector) AS distance
                FROM restaurant_embeddings
                ORDER BY embedding <=> CAST(:query_embedding AS vector)
                LIMIT :limit
                """
            ),
            {
                "query_embedding": str(query_vector),
                "limit": k,
            },
        )

        return [
            {
                "content": row.content,
                "metadata": row.metadata,
                "score": float(row.distance),
            }
            for row in result
        ]