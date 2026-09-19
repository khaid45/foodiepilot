from datetime import date, time

from pydantic import BaseModel, Field


class AvailabilityResponse(BaseModel):
    restaurant_id: int
    booking_date: date
    booking_time: time
    requested_guests: int = Field(ge=1, le=20)
    available_tables: int
    available: bool