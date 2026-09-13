from datetime import datetime, date, time

from sqlalchemy import String, DateTime, Date, Time, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    restaurant_id: Mapped[int] = mapped_column(
        ForeignKey("restaurants.id"),
        nullable=False
    )

    booking_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    booking_time: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    guests: Mapped[int] = mapped_column(
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="confirmed",
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )