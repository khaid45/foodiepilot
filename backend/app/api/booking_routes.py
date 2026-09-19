from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.booking import Booking
from app.models.restaurant import Restaurant
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse
from app.core.dependencies import get_current_user
from app.core.time_utils import get_current_date


router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=BookingResponse)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == booking_data.restaurant_id
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    if booking_data.booking_date < get_current_date():
        raise HTTPException(
            status_code=400,
            detail="Booking date cannot be in the past"
        )

    if restaurant.available_tables <= 0:
        raise HTTPException(
            status_code=400,
            detail="No tables currently available"
        )

    existing_booking = db.query(Booking).filter(
        Booking.user_id == current_user.id,
        Booking.restaurant_id == booking_data.restaurant_id,
        Booking.booking_date == booking_data.booking_date,
        Booking.booking_time == booking_data.booking_time,
        Booking.status == "confirmed"
    ).first()

    if existing_booking:
        raise HTTPException(
            status_code=400,
            detail="You already have a booking at this time"
        )

    if booking_data.guests > restaurant.available_tables:
        raise HTTPException(
            status_code=400,
            detail="Not enough tables available"
        )

    booking = Booking(
        user_id=current_user.id,
        restaurant_id=booking_data.restaurant_id,
        booking_date=booking_data.booking_date,
        booking_time=booking_data.booking_time,
        guests=booking_data.guests,
        status="confirmed"
    )

    db.add(booking)

    restaurant.available_tables -= booking_data.guests

    db.commit()
    db.refresh(booking)

    return booking


@router.get("/my", response_model=list[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Booking).filter(
        Booking.user_id == current_user.id
    ).order_by(
        Booking.booking_date,
        Booking.booking_time
    ).all()


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == current_user.id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return booking


@router.delete("/{booking_id}")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == current_user.id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if booking.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Booking is already cancelled"
        )

    restaurant = db.query(Restaurant).filter(
        Restaurant.id == booking.restaurant_id
    ).first()

    if restaurant:
        restaurant.available_tables += booking.guests

    booking.status = "cancelled"

    db.commit()

    return {
        "message": "Booking cancelled successfully"
    }