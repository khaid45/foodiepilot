from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.rag.retriever import generate_restaurant_answer


router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)


class RestaurantSearchRequest(BaseModel):
    query: str = Field(min_length=2)
    top_k: int = Field(default=5, ge=1, le=10)

    location: Optional[str] = None
    cuisine: Optional[str] = None
    min_rating: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=5.0
    )
    price_range: Optional[str] = None


@router.post("/search")
def rag_search(request: RestaurantSearchRequest):
    try:
        return generate_restaurant_answer(
            query=request.query,
            k=request.top_k,
            location=request.location,
            cuisine=request.cuisine,
            min_rating=request.min_rating,
            price_range=request.price_range,
        )

    except Exception as e:
        error_message = str(e)

        if "RESOURCE_EXHAUSTED" in error_message or "429" in error_message:
            raise HTTPException(
                status_code=429,
                detail="AI service quota exceeded. Please try again later."
            )

        raise HTTPException(
            status_code=500,
            detail=f"RAG search failed: {error_message}"
        )