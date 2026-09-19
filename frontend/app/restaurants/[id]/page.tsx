"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  checkAvailability,
  createBooking,
  getRestaurant,
  type Availability,
  type Restaurant,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RestaurantPage() {
  const params = useParams();
  const { token } = useAuth();

  const restaurantId = Number(params.id);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("19:00");
  const [guests, setGuests] = useState(2);

  const [availability, setAvailability] =
    useState<Availability | null>(null);

  const [checking, setChecking] = useState(false);

  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);

  useEffect(() => {
    if (!restaurantId || Number.isNaN(restaurantId)) {
      setError("Invalid restaurant.");
      setLoading(false);
      return;
    }

    const loadRestaurant = async () => {
      try {
        const data = await getRestaurant(restaurantId);
        setRestaurant(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load restaurant."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [restaurantId]);

  const handleCheckAvailability = async () => {
    if (!bookingDate || !restaurant) {
      return;
    }

    setChecking(true);
    setAvailability(null);
    setError("");
    setBookingError("");
    setBookingSuccess(false);
    setBookingId(null);

    try {
      const data = await checkAvailability(
        restaurant.id,
        bookingDate,
        bookingTime,
        guests
      );

      setAvailability(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to check availability."
      );
    } finally {
      setChecking(false);
    }
  };

  const handleBooking = async () => {
    if (!restaurant || !availability?.available || !bookingDate) {
      return;
    }

    if (!token) {
      setBookingError(
        "Please sign in before making a reservation."
      );
      return;
    }

    setBooking(true);
    setBookingError("");
    setBookingSuccess(false);
    setBookingId(null);

    try {
      const createdBooking = await createBooking(token, {
        restaurant_id: restaurant.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        guests,
      });

      setBookingSuccess(true);
      setBookingId(createdBooking.id);
      setAvailability(null);

      setRestaurant((current) =>
        current
          ? {
              ...current,
              available_tables: Math.max(
                0,
                current.available_tables - guests
              ),
            }
          : current
      );
    } catch (err) {
      setBookingError(
        err instanceof Error
          ? err.message
          : "Unable to complete your booking."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f2ea]">
        <div className="container-foodie py-20">
          <p className="text-[12px] text-[#756e67]">
            Loading restaurant...
          </p>
        </div>
      </main>
    );
  }

  if (error && !restaurant) {
    return (
      <main className="min-h-screen bg-[#f7f2ea]">
        <div className="container-foodie py-20">
          <p className="section-label">Restaurant</p>

          <h1 className="editorial-heading mt-4 text-[42px]">
            Restaurant not found.
          </h1>

          <p className="mt-4 text-[13px] text-[#756e67]">
            {error || "We couldn't find this restaurant."}
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-[10px] bg-[#b74720] px-5 py-3 text-[10px] font-semibold text-white transition hover:bg-[#913717]"
          >
            Back to FoodiePilot
          </Link>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea]">
      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}

      <header className="border-b border-[#ded5ca] bg-[#fffdf9]">
        <div className="container-foodie flex h-[76px] items-center justify-between">
          <Link
            href="/"
            className="font-[var(--font-playfair)] text-[25px] tracking-[-0.04em] text-[#1b1815]"
          >
            FoodiePilot
          </Link>

          <Link
            href="/"
            className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756e67] transition hover:text-[#b74720]"
          >
            ← Back to Discover
          </Link>
        </div>
      </header>

      {/* ================================================================ */}
      {/* RESTAURANT                                                       */}
      {/* ================================================================ */}

      <section className="container-foodie py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ============================================================ */}
          {/* RESTAURANT INFORMATION                                       */}
          {/* ============================================================ */}

          <div>
            <p className="section-label">
              {restaurant.cuisine}
            </p>

            <h1 className="editorial-heading mt-4 max-w-[700px] text-balance text-[48px] leading-[0.98] sm:text-[68px]">
              {restaurant.name}
            </h1>

            <p className="mt-5 text-[14px] text-[#756e67]">
              {restaurant.location}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-[#d9cec2] bg-[#fffdf9] px-4 py-2 text-[11px] font-medium text-[#4f4943]">
                ★ {restaurant.rating.toFixed(1)}
              </span>

              <span className="rounded-full border border-[#d9cec2] bg-[#fffdf9] px-4 py-2 text-[11px] font-medium text-[#4f4943]">
                {restaurant.cuisine}
              </span>

              <span className="rounded-full border border-[#d9cec2] bg-[#fffdf9] px-4 py-2 text-[11px] font-medium text-[#4f4943]">
                {restaurant.price_range}
              </span>

              <span className="rounded-full border border-[#d9cec2] bg-[#fffdf9] px-4 py-2 text-[11px] font-medium text-[#4f4943]">
                {restaurant.available_tables} available
              </span>
            </div>

            <div className="mt-14 border-t border-[#ded5ca] pt-8">
              <p className="section-label">
                About this restaurant
              </p>

              <p className="mt-4 max-w-[620px] text-[14px] leading-7 text-[#756e67]">
                Discover {restaurant.name}, a{" "}
                {restaurant.cuisine.toLowerCase()} restaurant
                in {restaurant.location}. FoodiePilot can help
                you check table availability and make your
                reservation.
              </p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* BOOKING PANEL                                                */}
          {/* ============================================================ */}

          <div className="h-fit rounded-[18px] border border-[#d9cec2] bg-[#fffdf9] p-6 shadow-[0_20px_60px_rgba(66,43,24,0.07)] sm:p-8">
            <p className="section-label">
              Reserve a table
            </p>

            <h2 className="editorial-heading mt-3 text-[34px] leading-tight">
              Find your perfect time.
            </h2>

            <div className="mt-7 space-y-4">
              {/* DATE */}
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#756e67]">
                  Date
                </label>

                <input
                  type="date"
                  value={bookingDate}
                  onChange={(event) => {
                    setBookingDate(event.target.value);
                    setAvailability(null);
                    setBookingSuccess(false);
                    setBookingError("");
                    setBookingId(null);
                    setError("");
                  }}
                  className="w-full rounded-[10px] border border-[#d9cec2] bg-white px-4 py-3 text-[12px] text-[#29241f] outline-none focus:border-[#b74720]"
                />
              </div>

              {/* TIME */}
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#756e67]">
                  Time
                </label>

                <input
                  type="time"
                  value={bookingTime}
                  onChange={(event) => {
                    setBookingTime(event.target.value);
                    setAvailability(null);
                    setBookingSuccess(false);
                    setBookingError("");
                    setBookingId(null);
                    setError("");
                  }}
                  className="w-full rounded-[10px] border border-[#d9cec2] bg-white px-4 py-3 text-[12px] text-[#29241f] outline-none focus:border-[#b74720]"
                />
              </div>

              {/* GUESTS */}
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#756e67]">
                  Guests
                </label>

                <select
                  value={guests}
                  onChange={(event) => {
                    setGuests(Number(event.target.value));
                    setAvailability(null);
                    setBookingSuccess(false);
                    setBookingError("");
                    setBookingId(null);
                    setError("");
                  }}
                  className="w-full rounded-[10px] border border-[#d9cec2] bg-white px-4 py-3 text-[12px] text-[#29241f] outline-none focus:border-[#b74720]"
                >
                  {Array.from({ length: 10 }, (_, index) => {
                    const count = index + 1;

                    return (
                      <option key={count} value={count}>
                        {count}{" "}
                        {count === 1 ? "guest" : "guests"}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* CHECK AVAILABILITY */}
              <button
                onClick={handleCheckAvailability}
                disabled={!bookingDate || checking || booking}
                className="w-full rounded-[10px] bg-[#b74720] px-5 py-3.5 text-[10px] font-semibold text-white transition hover:bg-[#913717] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {checking
                  ? "Checking..."
                  : "Check Availability"}
              </button>
            </div>

            {/* ERROR */}
            {error && restaurant && (
              <div className="mt-5 rounded-[12px] border border-[#e2c7bd] bg-[#f8ebe6] p-4">
                <p className="text-[10px] leading-5 text-[#913717]">
                  {error}
                </p>
              </div>
            )}

            {/* AVAILABILITY RESULT */}
            {availability && (
              <div
                className={`mt-5 rounded-[12px] border p-4 ${
                  availability.available
                    ? "border-[#cbd8c2] bg-[#eef4e9]"
                    : "border-[#e2c7bd] bg-[#f8ebe6]"
                }`}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    availability.available
                      ? "text-[#526b45]"
                      : "text-[#913717]"
                  }`}
                >
                  {availability.available
                    ? "Table available"
                    : "No availability"}
                </p>

                <p className="mt-2 text-[10px] leading-5 text-[#756e67]">
                  {availability.available
                    ? `${restaurant.name} has enough capacity for ${guests} ${
                        guests === 1 ? "guest" : "guests"
                      } at ${bookingTime}.`
                    : `There is not enough capacity for ${guests} ${
                        guests === 1 ? "guest" : "guests"
                      } at this time.`}
                </p>

                {availability.available && (
                  <p className="mt-2 text-[10px] text-[#756e67]">
                    Available capacity:{" "}
                    {availability.available_tables}
                  </p>
                )}

                {/* BOOK TABLE */}
                {availability.available && (
                  <button
                    type="button"
                    onClick={handleBooking}
                    disabled={booking}
                    className="mt-4 w-full rounded-[10px] bg-[#b74720] px-5 py-3 text-[10px] font-semibold text-white transition hover:bg-[#913717] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {booking
                      ? "Confirming Reservation..."
                      : "Book This Table"}
                  </button>
                )}
              </div>
            )}

            {/* BOOKING ERROR */}
            {bookingError && (
              <div className="mt-5 rounded-[12px] border border-[#e2c7bd] bg-[#f8ebe6] p-4">
                <p className="text-[10px] leading-5 text-[#913717]">
                  {bookingError}
                </p>
              </div>
            )}

            {/* BOOKING SUCCESS */}
            {bookingSuccess && (
              <div className="mt-5 rounded-[12px] border border-[#cbd8c2] bg-[#eef4e9] p-4">
                <p className="text-[11px] font-semibold text-[#526b45]">
                  Reservation confirmed
                </p>

                <p className="mt-2 text-[10px] leading-5 text-[#756e67]">
                  Your table at {restaurant.name} is booked
                  for {bookingDate} at {bookingTime} for{" "}
                  {guests}{" "}
                  {guests === 1 ? "guest" : "guests"}.
                </p>

                {bookingId !== null && (
                  <p className="mt-2 text-[10px] font-medium text-[#756e67]">
                    Booking ID: #{bookingId}
                  </p>
                )}

                <Link
                  href="/bookings"
                  className="mt-3 inline-flex text-[10px] font-semibold text-[#b74720] transition hover:text-[#913717]"
                >
                  View my bookings →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}