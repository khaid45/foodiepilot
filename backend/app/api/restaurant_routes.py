from datetime import date, time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.restaurant import Restaurant
from app.schemas.restaurant import RestaurantCreate, RestaurantResponse
from app.schemas.availability import AvailabilityResponse


router = APIRouter(
    prefix="/restaurants",
    tags=["Restaurants"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=RestaurantResponse)
def create_restaurant(
    restaurant_data: RestaurantCreate,
    db: Session = Depends(get_db)
):
    restaurant = Restaurant(
        name=restaurant_data.name,
        location=restaurant_data.location,
        cuisine=restaurant_data.cuisine,
        rating=restaurant_data.rating,
        available_tables=restaurant_data.available_tables,
        price_range=restaurant_data.price_range
    )

    db.add(restaurant)
    db.commit()
    db.refresh(restaurant)

    return restaurant


@router.get("/", response_model=list[RestaurantResponse])
def get_restaurants(
    location: Optional[str] = None,
    cuisine: Optional[str] = None,
    min_rating: Optional[float] = None,
    price_range: Optional[str] = None,
    min_tables: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Restaurant)

    if location:
        query = query.filter(
            Restaurant.location.ilike(f"%{location}%")
        )

    if cuisine:
        query = query.filter(
            Restaurant.cuisine.ilike(f"%{cuisine}%")
        )

    if min_rating is not None:
        query = query.filter(
            Restaurant.rating >= min_rating
        )

    if price_range:
        query = query.filter(
            Restaurant.price_range == price_range
        )

    if min_tables is not None:
        query = query.filter(
            Restaurant.available_tables >= min_tables
        )

    return query.order_by(
        Restaurant.rating.desc()
    ).all()


@router.get(
    "/{restaurant_id}/availability",
    response_model=AvailabilityResponse
)
def check_availability(
    restaurant_id: int,
    booking_date: date,
    booking_time: time,
    guests: int,
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    if guests < 1 or guests > 20:
        raise HTTPException(
            status_code=400,
            detail="Guests must be between 1 and 20"
        )

    available = restaurant.available_tables >= guests

    return {
        "restaurant_id": restaurant.id,
        "booking_date": booking_date,
        "booking_time": booking_time,
        "requested_guests": guests,
        "available_tables": restaurant.available_tables,
        "available": available
    }


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    return restaurant