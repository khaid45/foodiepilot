from sqlalchemy import String, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base
from pydantic import BaseModel, Field

class Restaurant(Base):
    __tablename__ = "restaurants"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False)

    location: Mapped[str] = mapped_column(String(100), nullable=False)

    cuisine: Mapped[str] = mapped_column(String(50), nullable=False)

    rating: Mapped[float] = mapped_column(Float, default=0.0)

    available_tables: Mapped[int] = mapped_column(default=0)

    price_range: Mapped[str] = mapped_column(String(10), default="$$")

class RestaurantBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    location: str = Field(min_length=2, max_length=100)
    cuisine: str = Field(min_length=2, max_length=50)
    rating: float = Field(default=0.0, ge=0.0, le=5.0)
    available_tables: int = Field(default=0, ge=0)
    price_range: str = Field(default="$$", max_length=10)


class RestaurantCreate(RestaurantBase):
    pass


class RestaurantResponse(RestaurantBase):
    id: int

    class Config:
        from_attributes = True    