from datetime import date, time, datetime

from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    restaurant_id: int
    booking_date: date
    booking_time: time
    guests: int = Field(
        ge=1,
        le=20
    )


class BookingResponse(BaseModel):
    id: int
    user_id: int
    restaurant_id: int
    booking_date: date
    booking_time: time
    guests: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True