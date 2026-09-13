from pydantic import BaseModel, Field


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