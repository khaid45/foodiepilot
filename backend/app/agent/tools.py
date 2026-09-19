from datetime import date, time, timedelta
import json

from app.core.time_utils import get_current_date
from langchain_core.tools import tool
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.restaurant import Restaurant
from app.models.booking import Booking
from app.models.user import User
from app.rag.retriever import search_restaurants


def resolve_booking_date(value: str) -> date:
    """
    Resolve explicit and common relative booking dates
    using the application's current date.
    """

    normalized = value.strip().lower()
    today = get_current_date()

    relative_dates = {
        "today": today,
        "tomorrow": today + timedelta(days=1),
        "day after tomorrow": today + timedelta(days=2),
    }

    if normalized in relative_dates:
        return relative_dates[normalized]

    weekdays = {
        "monday": 0,
        "tuesday": 1,
        "wednesday": 2,
        "thursday": 3,
        "friday": 4,
        "saturday": 5,
        "sunday": 6,
    }

    if normalized.startswith("next "):
        weekday_name = normalized[5:].strip()

        if weekday_name in weekdays:
            target_weekday = weekdays[weekday_name]
            days_ahead = (target_weekday - today.weekday()) % 7

            if days_ahead == 0:
                days_ahead = 7

            return today + timedelta(days=days_ahead)

    try:
        return date.fromisoformat(normalized)
    except ValueError:
        raise ValueError(
            "Invalid booking date. Use YYYY-MM-DD, today, "
            "tomorrow, day after tomorrow, or next <weekday>."
        )


@tool
def restaurant_search(
    query: str,
    location: str | None = None,
    cuisine: str | None = None,
    min_rating: float | None = None,
    price_range: str | None = None,
) -> str:
    """
    Search FoodiePilot's restaurant knowledge base.

    Use this tool when the user wants to find, discover,
    compare, or get recommendations for restaurants.

    Optional filters:
    - location
    - cuisine
    - min_rating
    - price_range
    """

    results = search_restaurants(
        query=query,
        k=5,
        location=location,
        cuisine=cuisine,
        min_rating=min_rating,
        price_range=price_range,
    )

    if not results:
        return json.dumps({
            "restaurants": []
        })

    restaurants = []

    for result in results:
        metadata = result["metadata"]

        restaurants.append({
            "id": metadata["restaurant_id"],
            "name": metadata["name"],
            "location": metadata["location"],
            "cuisine": metadata["cuisine"],
            "rating": metadata["rating"],
            "price_range": metadata["price_range"],
            "score": result["score"],
        })

    return json.dumps({
        "restaurants": restaurants
    })


@tool
def check_availability(
    restaurant_id: int,
    booking_date: str,
    booking_time: str,
    guests: int
) -> str:
    """
    Check whether a restaurant has enough capacity for a requested
    date, time, and number of guests.

    booking_date must use YYYY-MM-DD format.
    booking_time must use HH:MM format.
    """

    db: Session = SessionLocal()

    try:
        restaurant = (
            db.query(Restaurant)
            .filter(Restaurant.id == restaurant_id)
            .first()
        )

        if not restaurant:
            return f"Restaurant with ID {restaurant_id} was not found."

        try:
            requested_date = date.fromisoformat(booking_date)
            requested_time = time.fromisoformat(booking_time)
        except ValueError:
            return (
                "Invalid date or time format. "
                "Use YYYY-MM-DD for date and HH:MM for time."
            )

        if guests < 1 or guests > 20:
            return "Guests must be between 1 and 20."

        if requested_date < get_current_date():
            return "Booking date cannot be in the past."

        available = restaurant.available_tables >= guests

        return (
            f"Restaurant: {restaurant.name}\n"
            f"Restaurant ID: {restaurant.id}\n"
            f"Date: {requested_date}\n"
            f"Time: {requested_time}\n"
            f"Requested Guests: {guests}\n"
            f"Available Capacity: {restaurant.available_tables}\n"
            f"Available: {'Yes' if available else 'No'}"
        )

    finally:
        db.close()


@tool
def create_booking(
    user_id: int,
    restaurant_id: int,
    booking_date: str,
    booking_time: str,
    guests: int
) -> str:
    """
    Create a restaurant booking for a user.

    booking_date may use YYYY-MM-DD, today, tomorrow,
    day after tomorrow, or next <weekday>.
    booking_time must use HH:MM format.
    guests must be between 1 and 20.
    """

    db: Session = SessionLocal()

    try:
        user = (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if not user:
            return f"User with ID {user_id} was not found."

        # Lock the restaurant row for the duration of this transaction.
        # This prevents concurrent bookings from consuming the same
        # available capacity.
        restaurant = (
            db.query(Restaurant)
            .filter(Restaurant.id == restaurant_id)
            .with_for_update()
            .first()
        )

        if not restaurant:
            return f"Restaurant with ID {restaurant_id} was not found."

        try:
            requested_date = resolve_booking_date(booking_date)
            requested_time = time.fromisoformat(booking_time)
        except ValueError as e:
            return str(e)

        if guests < 1 or guests > 20:
            return "Guests must be between 1 and 20."

        if requested_date < get_current_date():
            return "Booking date cannot be in the past."

        if restaurant.available_tables < guests:
            return (
                f"Not enough capacity available. "
                f"Currently available: {restaurant.available_tables}."
            )

        existing_booking = (
            db.query(Booking)
            .filter(
                Booking.user_id == user_id,
                Booking.restaurant_id == restaurant_id,
                Booking.booking_date == requested_date,
                Booking.booking_time == requested_time,
                Booking.status == "confirmed"
            )
            .first()
        )

        if existing_booking:
            return "You already have a confirmed booking at this time."

        booking = Booking(
            user_id=user_id,
            restaurant_id=restaurant_id,
            booking_date=requested_date,
            booking_time=requested_time,
            guests=guests,
            status="confirmed"
        )

        db.add(booking)

        restaurant.available_tables -= guests

        db.commit()
        db.refresh(booking)

        return (
            f"Booking confirmed successfully.\n"
            f"Booking ID: {booking.id}\n"
            f"Restaurant: {restaurant.name}\n"
            f"Date: {booking.booking_date}\n"
            f"Time: {booking.booking_time}\n"
            f"Guests: {booking.guests}\n"
            f"Status: {booking.status}"
        )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


@tool
def get_my_bookings(user_id: int) -> str:
    """
    Retrieve all bookings belonging to the specified user.
    """

    db: Session = SessionLocal()

    try:
        user = (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if not user:
            return f"User with ID {user_id} was not found."

        bookings = (
            db.query(Booking)
            .filter(Booking.user_id == user_id)
            .order_by(
                Booking.booking_date,
                Booking.booking_time
            )
            .all()
        )

        if not bookings:
            return "You currently have no bookings."

        results = []

        for booking in bookings:
            restaurant = (
                db.query(Restaurant)
                .filter(Restaurant.id == booking.restaurant_id)
                .first()
            )

            restaurant_name = (
                restaurant.name
                if restaurant
                else f"Restaurant ID {booking.restaurant_id}"
            )

            results.append(
                f"""
Booking ID: {booking.id}
Restaurant: {restaurant_name}
Date: {booking.booking_date}
Time: {booking.booking_time}
Guests: {booking.guests}
Status: {booking.status}
""".strip()
            )

        return "\n\n".join(results)

    finally:
        db.close()


@tool
def cancel_booking(user_id: int, booking_id: int) -> str:
    """
    Cancel a booking belonging to the specified user.

    A confirmed booking releases its guest capacity exactly once.
    """

    db: Session = SessionLocal()

    try:
        booking = (
            db.query(Booking)
            .filter(
                Booking.id == booking_id,
                Booking.user_id == user_id
            )
            .first()
        )

        if not booking:
            return f"Booking with ID {booking_id} was not found."

        # Prevent cancelling an already-cancelled booking
        # from restoring capacity a second time.
        if booking.status == "cancelled":
            return "This booking is already cancelled."

        restaurant = (
            db.query(Restaurant)
            .filter(Restaurant.id == booking.restaurant_id)
            .first()
        )

        if restaurant:
            restaurant.available_tables += booking.guests

        booking.status = "cancelled"

        db.commit()

        return (
            f"Booking cancelled successfully.\n"
            f"Booking ID: {booking.id}\n"
            f"Restaurant: {restaurant.name if restaurant else 'Unknown'}\n"
            f"Date: {booking.booking_date}\n"
            f"Time: {booking.booking_time}\n"
            f"Guests: {booking.guests}\n"
            f"Status: {booking.status}"
        )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()