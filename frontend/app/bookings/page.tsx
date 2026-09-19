"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  cancelBooking,
  getMyBookings,
  getRestaurant,
  type Booking,
  type Restaurant,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type BookingWithRestaurant = Booking & {
  restaurant?: Restaurant;
};

export default function BookingsPage() {
  const { token } = useAuth();

  const [bookings, setBookings] = useState<
    BookingWithRestaurant[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancellingId, setCancellingId] = useState<number | null>(
    null
  );

  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      if (!token) {
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getMyBookings(token);

        const enrichedBookings = await Promise.all(
          data.map(async (booking) => {
            try {
              const restaurant = await getRestaurant(
                booking.restaurant_id
              );

              return {
                ...booking,
                restaurant,
              };
            } catch {
              return booking;
            }
          })
        );

        setBookings(enrichedBookings);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [token]);

  const handleCancel = async (bookingId: number) => {
    if (!token || cancellingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) {
      return;
    }

    setCancellingId(bookingId);
    setCancelError("");

    try {
      await cancelBooking(token, bookingId);

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: "cancelled",
              }
            : booking
        )
      );
    } catch (err) {
      setCancelError(
        err instanceof Error
          ? err.message
          : "Unable to cancel this reservation."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const activeBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );

  const pastBookings = bookings.filter(
    (booking) => booking.status !== "confirmed"
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f2ea]">
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
              className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756e67] hover:text-[#b74720]"
            >
              ← Discover
            </Link>
          </div>
        </header>

        <section className="container-foodie py-16">
          <p className="section-label">
            Your reservations
          </p>

          <h1 className="editorial-heading mt-4 text-[48px] sm:text-[62px]">
            Your table awaits.
          </h1>

          <div className="mt-10 space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-[150px] animate-pulse rounded-[18px] border border-[#ded5ca] bg-[#fffdf9]"
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#f7f2ea]">
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
              className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756e67] hover:text-[#b74720]"
            >
              ← Discover
            </Link>
          </div>
        </header>

        <section className="container-foodie flex min-h-[calc(100vh-76px)] items-center justify-center py-16">
          <div className="w-full max-w-[500px] rounded-[20px] border border-[#ded5ca] bg-[#fffdf9] p-8 text-center shadow-[0_20px_60px_rgba(66,43,24,0.07)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f2dfd5] text-[#b74720]">
              ✦
            </div>

            <p className="section-label mt-6">
              Your reservations
            </p>

            <h1 className="editorial-heading mt-3 text-[38px]">
              Sign in to see your bookings.
            </h1>

            <p className="mt-4 text-[12px] leading-6 text-[#756e67]">
              Your reservations are securely linked to your
              FoodiePilot account.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-full bg-[#b74720] px-6 py-3 text-[10px] font-semibold text-white transition hover:bg-[#913717]"
            >
              Back to FoodiePilot
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea]">
      {/* HEADER */}
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

      {/* HERO */}
      <section className="container-foodie py-14 sm:py-16">
        <p className="section-label">
          Your reservations
        </p>

        <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="editorial-heading text-[48px] leading-[0.95] sm:text-[65px]">
              Your table awaits.
            </h1>

            <p className="mt-5 max-w-[520px] text-[13px] leading-6 text-[#756e67]">
              Keep track of your upcoming dining plans and
              revisit your past reservations.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center rounded-full border border-[#d9cec2] bg-[#fffdf9] px-5 py-3 text-[10px] font-semibold text-[#4f4943] transition hover:border-[#b74720] hover:text-[#b74720]"
          >
            Find another table →
          </Link>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <section className="container-foodie pb-6">
          <div className="rounded-[14px] border border-[#e2c7bd] bg-[#f8ebe6] p-5">
            <p className="text-[11px] leading-5 text-[#913717]">
              {error}
            </p>
          </div>
        </section>
      )}

      {/* CANCEL ERROR */}
      {cancelError && (
        <section className="container-foodie pb-6">
          <div className="rounded-[14px] border border-[#e2c7bd] bg-[#f8ebe6] p-5">
            <p className="text-[11px] leading-5 text-[#913717]">
              {cancelError}
            </p>
          </div>
        </section>
      )}

      {/* UPCOMING */}
      <section className="container-foodie pb-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-label">
              Upcoming
            </p>

            <h2 className="editorial-heading mt-2 text-[32px] sm:text-[38px]">
              Confirmed reservations
            </h2>
          </div>

          <span className="hidden rounded-full bg-[#eef4e9] px-3 py-1.5 text-[9px] font-semibold text-[#526b45] sm:block">
            {activeBookings.length} active
          </span>
        </div>

        {activeBookings.length === 0 ? (
          <div className="mt-8 rounded-[18px] border border-[#ded5ca] bg-[#fffdf9] p-8">
            <p className="font-[var(--font-playfair)] text-[25px] text-[#29241f]">
              No upcoming reservations.
            </p>

            <p className="mt-2 text-[11px] leading-5 text-[#756e67]">
              Ready for your next great meal?
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex rounded-full bg-[#b74720] px-5 py-3 text-[10px] font-semibold text-white hover:bg-[#913717]"
            >
              Explore restaurants
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {activeBookings.map((booking) => (
              <article
                key={booking.id}
                className="overflow-hidden rounded-[18px] border border-[#ded5ca] bg-[#fffdf9]"
              >
                <div className="grid lg:grid-cols-[1fr_auto]">
                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b74720]">
                          Reservation #{booking.id}
                        </span>

                        <h3 className="font-[var(--font-playfair)] mt-2 text-[27px] text-[#29241f]">
                          {booking.restaurant?.name ||
                            `Restaurant #${booking.restaurant_id}`}
                        </h3>

                        {booking.restaurant && (
                          <p className="mt-1 text-[10px] text-[#8c837a]">
                            {booking.restaurant.location} ·{" "}
                            {booking.restaurant.cuisine}
                          </p>
                        )}
                      </div>

                      <span className="rounded-full bg-[#eef4e9] px-3 py-1.5 text-[9px] font-semibold capitalize text-[#526b45]">
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-7 grid gap-5 sm:grid-cols-3">
                      <div>
                        <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#9a9289]">
                          Date
                        </p>

                        <p className="mt-1.5 text-[12px] font-medium text-[#4f4943]">
                          {formatDate(booking.booking_date)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#9a9289]">
                          Time
                        </p>

                        <p className="mt-1.5 text-[12px] font-medium text-[#4f4943]">
                          {formatTime(booking.booking_time)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#9a9289]">
                          Guests
                        </p>

                        <p className="mt-1.5 text-[12px] font-medium text-[#4f4943]">
                          {booking.guests}{" "}
                          {booking.guests === 1
                            ? "guest"
                            : "guests"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end border-t border-[#ebe3d9] bg-[#f7f0e8] p-6 lg:w-[190px] lg:border-l lg:border-t-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleCancel(booking.id)
                      }
                      disabled={cancellingId === booking.id}
                      className="w-full rounded-[10px] border border-[#d7c8bc] bg-[#fffdf9] px-4 py-3 text-[10px] font-semibold text-[#913717] transition hover:border-[#b74720] hover:bg-[#f8ebe6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {cancellingId === booking.id
                        ? "Cancelling..."
                        : "Cancel reservation"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* PAST */}
      {pastBookings.length > 0 && (
        <section className="border-t border-[#ded5ca] bg-[#f3ece3]">
          <div className="container-foodie py-14">
            <p className="section-label">
              History
            </p>

            <h2 className="editorial-heading mt-2 text-[32px] sm:text-[38px]">
              Past reservations
            </h2>

            <div className="mt-7 space-y-3">
              {pastBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[15px] border border-[#ded5ca] bg-[#fffdf9] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-[var(--font-playfair)] text-[21px] text-[#29241f]">
                          {booking.restaurant?.name ||
                            `Restaurant #${booking.restaurant_id}`}
                        </h3>

                        <span className="rounded-full bg-[#f3e9e2] px-2.5 py-1 text-[8px] font-semibold capitalize text-[#8c837a]">
                          {booking.status}
                        </span>
                      </div>

                      <p className="mt-1.5 text-[9px] text-[#8c837a]">
                        {formatDate(booking.booking_date)} ·{" "}
                        {formatTime(booking.booking_time)} ·{" "}
                        {booking.guests}{" "}
                        {booking.guests === 1
                          ? "guest"
                          : "guests"}
                      </p>
                    </div>

                    <p className="text-[9px] font-medium text-[#9a9289]">
                      Booking #{booking.id}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-[#211b17] text-white">
        <div className="container-foodie flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-semibold">
            FoodiePilot
          </p>

          <p className="text-[8px] text-white/35">
            Eat well. Discover more.
          </p>

          <Link
            href="/"
            className="text-[9px] text-white/45 transition hover:text-white"
          >
            Back to Discover →
          </Link>
        </div>
      </footer>
    </main>
  );
}