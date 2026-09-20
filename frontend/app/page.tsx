"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AIConcierge from "@/components/AIConcierge";
import AuthModal from "@/components/AuthModal";
import {
  API_BASE_URL,
  getRestaurants,
  type Restaurant,
} from "@/lib/api";

const cuisines = [
  {
    name: "Indian",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Italian",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Chinese",
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Japanese",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Seafood",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Cafe",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Continental",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Desserts",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=85",
  },
];

const restaurantImages: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85",
  2: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85",
  3: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85",
  4: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85",
  5: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  6: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85",
  7: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85",
  8: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85",
  9: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
  10: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85",
  11: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
  12: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85",
  13: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
  14: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
  15: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
  16: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=85",
  17: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=85",
  18: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
  19: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
  20: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85",
  21: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/biryani/biryani1.jpg",
  22: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/biryani/biryani2.jpg",
  23: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/biryani/biryani3.jpg",
  24: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/butter-chicken/butter-chicken1.jpg",
  25: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice1.jpg",
  26: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/pasta/pasta1.jpg",
  27: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/butter-chicken/butter-chicken2.jpg",
  28: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice2.jpg",
  29: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/dessert/dessert1.jpg",
  30: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/pizza/pizza1.jpg",
  31: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/dosa/dosa1.jpg",
  32: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice3.jpg",
  33: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/dessert/dessert2.jpg",
  34: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/burger/burger1.jpg",
  35: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/butter-chicken/butter-chicken3.jpg",
  36: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice4.jpg",
  37: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/pasta/pasta2.jpg",
  38: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/butter-chicken/butter-chicken4.jpg",
  39: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice5.jpg",
  40: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/dosa/dosa2.jpg",
  41: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/dosa/dosa3.jpg",
  42: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice6.jpg",
  43: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice7.jpg",
  44: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/butter-chicken/butter-chicken5.jpg",
  45: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/dessert/dessert3.jpg",
  46: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice8.jpg",
  47: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/pasta/pasta3.jpg",
  48: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice9.jpg",
  49: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice10.jpg",
  50: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/burger/burger2.jpg",
  51: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/butter-chicken/butter-chicken6.jpg",
  52: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/samosa/samosa1.jpg",
  53: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/burger/burger3.jpg",
  54: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice11.jpg",
  55: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/samosa/samosa2.jpg",
  56: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/biryani/biryani4.jpg",
  57: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice12.jpg",
  58: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/pasta/pasta4.jpg",
  59: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice13.jpg",
  60: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/pizza/pizza2.jpg",
  61: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice14.jpg",
  62: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/pasta/pasta5.jpg",
  63: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice15.jpg",
  64: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/butter-chicken/butter-chicken7.jpg",
  65: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/dessert/dessert4.jpg",
  66: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/burger/burger4.jpg",
  67: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/pasta/pasta6.jpg",
  68: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/rice/rice16.jpg",
  69: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/pizza/pizza3.jpg",
  70: "https://raw.githubusercontent.com/surhud004/Foodish/main/public/assets/images/dessert/dessert5.jpg",
};

const cities = [
  {
    name: "Visakhapatnam",
    image: "/cities/visakhapatnam.jpg",
  },
  {
    name: "Hyderabad",
    image: "/cities/hyderabad.jpg",
  },
  {
    name: "Bengaluru",
    image: "/cities/bengaluru.jpg",
  },
  {
    name: "Chennai",
    image: "/cities/chennai.jpg",
  },
  {
    name: "Delhi",
    image: "/cities/delhi.jpg",
  },
  {
    name: "Mumbai",
    image: "/cities/mumbai.jpg",
  },
];

const diningOccasions = [
  "Date night",
  "Family dinner",
  "Business meal",
  "Weekend brunch",
];

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 1.5 5.1a4 4 0 0 0 2.8 2.8L21 12l-4.7 1.4a4 4 0 0 0-2.8 2.8L12 21l-1.4-4.8a4 4 0 0 0-2.8-2.8L3 12l4.8-1.4a4 4 0 0 0-2.8-2.8L12 3Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
      <path d="M16 2.5v4M8 2.5v4M3 9h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 8.8c0 5.5-8.8 10.4-8.8 10.4S3.2 14.3 3.2 8.8a4.7 4.7 0 0 1 8.8-2.3 4.7 4.7 0 0 1 8.8 2.3Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m12 2.7 2.9 5.8 6.4.9-4.6 4.5 1.1 6.4-5.8-3-5.8 3 1.1-6.4-4.6-4.5 6.4-.9L12 2.7Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const { isAuthenticated, setToken, logout } = useAuth();

  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<
    {
      restaurant_id: number;
      name: string;
      score: number;
    }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [restaurantsError, setRestaurantsError] = useState("");
  const [selectedCity, setSelectedCity] = useState("Visakhapatnam");

  const suggestions = [
    "A romantic dinner near the beach",
    "Best Italian in Vizag",
    "A cafe for working",
  ];

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setRestaurantsLoading(true);
        setRestaurantsError("");
        setShowAllRestaurants(false);

        const data = await getRestaurants({
          location: selectedCity,
        });

        setRestaurants(data);
      } catch (err) {
        setRestaurantsError(
          err instanceof Error
            ? err.message
            : "Unable to load restaurants."
        );
        setRestaurants([]);
      } finally {
        setRestaurantsLoading(false);
      }
    };

    loadRestaurants();
  }, [selectedCity]);

  const handleSearch = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    setAnswer("");
    setSources([]);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/rag/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          top_k: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setAnswer(data.answer || "");
      setSources(data.sources || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to FoodiePilot."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const openConcierge = () => {
    const conciergeButton = document.querySelector(
      '[aria-label="Open FoodiePilot AI Concierge"]'
    ) as HTMLButtonElement | null;

    if (conciergeButton) {
      conciergeButton.click();
      return;
    }

    document
      .getElementById("concierge")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDiningPrompt = (occasion: string) => {
    openConcierge();

    window.setTimeout(() => {
      const conciergeInput = document.querySelector(
        'input[placeholder="Ask FoodiePilot anything..."]'
      ) as HTMLInputElement | null;

      if (conciergeInput) {
        conciergeInput.focus();
      }
    }, 100);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f3eb] text-[#171513]">
      {/* ================================================================ */}
      {/* NAVBAR                                                           */}
      {/* ================================================================ */}

      <header className="border-b border-[#dfd6cc] bg-[#f8f3eb]">
        <nav className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b74720] text-white">
              <span className="text-base font-bold">F</span>
            </div>

            <span className="font-[var(--font-dm-sans)] text-[17px] font-semibold tracking-[-0.04em]">
              Foodie<span className="text-[#b74720]">Pilot</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-[12px] text-[#5e5852] lg:flex">
            <a
              href="#discover"
              className="font-medium text-[#171513] transition hover:text-[#b74720]"
            >
              Discover
            </a>

            <a
              href="#collections"
              className="transition hover:text-[#b74720]"
            >
              Collections
            </a>

            <Link
              href="/bookings"
              className="transition hover:text-[#b74720]"
            >
              Bookings
            </Link>

            <button
              type="button"
              onClick={openConcierge}
              className="transition hover:text-[#b74720]"
            >
              AI Concierge
            </button>

            <a
              href="#about"
              className="transition hover:text-[#b74720]"
            >
              About
            </a>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#38332e] transition hover:bg-[#eee5da]"
            >
              <SearchIcon />
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  href="/bookings"
                  className="rounded-full border border-[#d9cfc4] px-5 py-2.5 text-[11px] font-medium text-[#312c28] transition hover:border-[#b74720] hover:text-[#b74720]"
                >
                  My Bookings
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-full bg-[#211b17] px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#3a2e27]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="rounded-full border border-[#d9cfc4] px-5 py-2.5 text-[11px] font-medium text-[#312c28] transition hover:border-[#b74720] hover:text-[#b74720]"
                >
                  Sign in
                </button>

                <button
                  onClick={() => setAuthOpen(true)}
                  className="rounded-full bg-[#b74720] px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#943817]"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9cfc4] sm:hidden"
            aria-label="Open navigation"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-[#dfd6cc] px-6 py-5 sm:hidden">
            <div className="flex flex-col gap-4 text-[12px] text-[#5e5852]">
              <a
                href="#discover"
                onClick={() => setMenuOpen(false)}
              >
                Discover
              </a>

              <a
                href="#collections"
                onClick={() => setMenuOpen(false)}
              >
                Collections
              </a>

              <Link
                href="/bookings"
                onClick={() => setMenuOpen(false)}
              >
                Bookings
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openConcierge();
                }}
              >
                AI Concierge
              </button>

              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
              >
                About
              </a>

              <div className="flex gap-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/bookings"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-full border border-[#d9cfc4] px-4 py-2 text-[10px] font-medium"
                    >
                      My Bookings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="rounded-full bg-[#211b17] px-4 py-2 text-[10px] font-semibold text-white"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setAuthOpen(true);
                        setMenuOpen(false);
                      }}
                      className="rounded-full border border-[#d9cfc4] px-4 py-2 text-[10px] font-medium"
                    >
                      Sign in
                    </button>

                    <button
                      onClick={() => {
                        setAuthOpen(true);
                        setMenuOpen(false);
                      }}
                      className="rounded-full bg-[#b74720] px-4 py-2 text-[10px] font-semibold text-white"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}

      <section
        id="discover"
        className="mx-auto max-w-[1440px] px-6 pb-14 pt-12 lg:px-12 lg:pb-16 lg:pt-14"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="max-w-[610px]">
            <p className="font-[var(--font-dm-sans)] text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a74320]">
              Good food brings people together
            </p>

            <h1 className="editorial-heading mt-5 text-[56px] leading-[0.93] sm:text-[70px] lg:text-[78px]">
              Find Your
              <br />
              Next Favorite{" "}
              <span className="text-[#b74720]">Table.</span>
            </h1>

            <p className="mt-7 max-w-[530px] font-[var(--font-dm-sans)] text-[14px] leading-6 text-[#746d66] sm:text-[15px]">
              Discover restaurants, check real-time availability, and book
              effortlessly with your AI-powered dining companion.
            </p>

            <div className="mt-8 max-w-[570px]">
              <div className="flex items-center gap-3 rounded-[13px] border border-[#d7cec3] bg-[#fffdfa] p-2 shadow-[0_8px_30px_rgba(66,43,24,0.07)]">
                <div className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2dfd5] text-[#b74720]">
                  <SparkleIcon />
                </div>

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="What are you in the mood for?"
                  className="min-w-0 flex-1 bg-transparent px-1 text-[12px] text-[#29241f] outline-none placeholder:text-[#9c938b]"
                />

                <button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#b74720] px-4 text-[11px] font-semibold text-white transition hover:bg-[#943817] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="hidden sm:block">
                    {loading ? "Thinking..." : "Ask FoodiePilot"}
                  </span>

                  <ArrowRight />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="rounded-full border border-[#ddd3c8] px-3.5 py-1.5 text-[9px] text-[#756d65] transition hover:border-[#b74720]/40 hover:bg-[#fffdfa] hover:text-[#b74720]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {(answer || error) && (
                <div className="mt-4 overflow-hidden rounded-[16px] border border-[#ded5ca] bg-[#fffdfa] shadow-[0_8px_25px_rgba(66,43,24,0.05)]">
                  {error ? (
                    <div className="p-5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b74720]">
                        FoodiePilot
                      </p>

                      <p className="mt-2 text-[12px] leading-6 text-[#a74320]">
                        {error}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="border-b border-[#ebe3d9] p-5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f2dfd5] text-[#b74720]">
                            <SparkleIcon />
                          </div>

                          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b74720]">
                            FoodiePilot recommends
                          </p>
                        </div>

                        <p className="mt-4 whitespace-pre-line text-[12px] leading-6 text-[#4f4943]">
                          {answer
                            .replace(/\*\*/g, "")
                            .replace(/\\n/g, "\n")}
                        </p>
                      </div>

                      {sources.length > 0 && (
                        <div className="bg-[#f7f0e8] p-4">
                          <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#756d65]">
                            Restaurants found
                          </p>

                          <div className="grid gap-2">
                            {sources.map((source) => (
                              <Link
                                key={source.restaurant_id}
                                href={`/restaurants/${source.restaurant_id}`}
                                className="flex items-center justify-between rounded-[10px] border border-[#e2d8cd] bg-[#fffdfa] px-3 py-2.5 transition hover:border-[#cdbdaf] hover:bg-[#fffaf5]"
                              >
                                <div>
                                  <p className="text-[11px] font-semibold text-[#29241f]">
                                    {source.name}
                                  </p>

                                  <p className="mt-0.5 text-[8px] text-[#8c837a]">
                                    Restaurant #{source.restaurant_id}
                                  </p>
                                </div>

                                <span className="rounded-full bg-[#f2dfd5] px-2 py-1 text-[8px] font-semibold text-[#b74720]">
                                  AI Match
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="mt-9 flex flex-wrap gap-5 border-t border-[#e1d8ce] pt-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d7cb] bg-[#fffaf5] text-[#b74720]">
                  <SparkleIcon />
                </div>

                <div>
                  <p className="text-[10px] font-semibold">
                    AI-Powered
                  </p>

                  <p className="mt-0.5 text-[8px] text-[#8c847b]">
                    Recommendations
                  </p>
                </div>
              </div>

              <div className="h-9 w-px bg-[#ded4c9]" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d7cb] bg-[#fffaf5] text-[#b74720]">
                  <CalendarIcon />
                </div>

                <div>
                  <p className="text-[10px] font-semibold">
                    Real-Time
                  </p>

                  <p className="mt-0.5 text-[8px] text-[#8c847b]">
                    Table Availability
                  </p>
                </div>
              </div>

              <div className="h-9 w-px bg-[#ded4c9]" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d7cb] bg-[#fffaf5] text-[#b74720]">
                  <ClockIcon />
                </div>

                <div>
                  <p className="text-[10px] font-semibold">
                    Instant & Easy
                  </p>

                  <p className="mt-0.5 text-[8px] text-[#8c847b]">
                    Bookings
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[28px]">
              <img
                src="/images/hero-dining-quote.png"
                alt="Warm restaurant dining scene with a handwritten dining quote"
                className="h-[500px] w-full object-cover lg:h-[560px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CUISINES                                                         */}
      {/* ================================================================ */}

      <section
        id="collections"
        className="border-t border-[#ded5ca] bg-[#f3ece3]"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a74320]">
                Explore by cuisine
              </p>

              <h2 className="editorial-heading mt-3 text-[38px] sm:text-[45px]">
                What&apos;s Your Craving?
              </h2>
            </div>

            <div className="hidden gap-2 sm:flex">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9cec2] text-[#766d64] transition hover:bg-[#fffdfa]">
                ←
              </button>

              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fffdfa] text-[#b74720] shadow-sm">
                →
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine.name}
                onClick={() => {
                  setQuery(`Find the best ${cuisine.name} restaurants`);
                  setAnswer("");
                  setSources([]);
                  setError("");
                }}
                className="group overflow-hidden rounded-[14px] border border-[#ded5ca] bg-[#fffdfa] text-left shadow-[0_4px_15px_rgba(60,40,20,0.03)] transition hover:-translate-y-1 hover:border-[#cdbdaf]"
              >
                <div className="h-[90px] overflow-hidden">
                  <img
                    src={cuisine.image}
                    alt={cuisine.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="px-3 py-3">
                  <p className="text-[11px] font-medium">
                    {cuisine.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* POPULAR RESTAURANTS                                              */}
      {/* ================================================================ */}

      <section
        id="popular"
        className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a74320]">
              Handpicked for you
            </p>

            <h2 className="editorial-heading mt-3 text-[38px] sm:text-[46px]">
              Popular Restaurants
              <span className="ml-2 font-[var(--font-dm-sans)] text-[11px] font-medium tracking-normal text-[#8c837a]">
                · {selectedCity}
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowAllRestaurants((current) => !current)
            }
            className="hidden items-center gap-2 text-[11px] font-semibold text-[#b74720] sm:flex"
          >
            {showAllRestaurants ? "Show Less" : "View All"}
            <ArrowRight />
          </button>
        </div>

        {restaurantsLoading ? (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[17px] border border-[#ded5ca] bg-[#fffdfa]"
              >
                <div className="h-[215px] animate-pulse bg-[#e9e0d6]" />

                <div className="p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#e9e0d6]" />

                  <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-[#eee6dd]" />

                  <div className="mt-5 h-6 w-1/2 animate-pulse rounded-full bg-[#eee6dd]" />
                </div>
              </div>
            ))}
          </div>
        ) : restaurantsError ? (
          <div className="mt-9 rounded-[14px] border border-[#e2c7bd] bg-[#f8ebe6] p-5">
            <p className="text-[11px] text-[#913717]">
              {restaurantsError}
            </p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="mt-9 rounded-[14px] border border-[#ded5ca] bg-[#fffdfa] p-6">
            <p className="text-[12px] text-[#756d65]">
              No restaurants are available right now.
            </p>
          </div>
        ) : (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {restaurants
              .slice(
                0,
                showAllRestaurants ? restaurants.length : 4
              )
              .map((restaurant, index) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="group block overflow-hidden rounded-[17px] border border-[#ded5ca] bg-[#fffdfa] transition hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(60,40,20,0.07)]"
              >
                <div className="relative h-[215px] overflow-hidden">
                  <img
                    src={
                      restaurantImages[restaurant.id] ??
                      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85"
                    }
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#fffdfa]/95 px-2.5 py-1.5 text-[9px] font-semibold shadow-sm">
                    <span className="text-[#b74720]">
                      <StarIcon />
                    </span>

                    {restaurant.rating.toFixed(1)}
                  </div>

                  <button
                    type="button"
                    aria-label={`Favorite ${restaurant.name}`}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#fffdfa]/95 text-[#625a53] transition hover:text-[#b74720]"
                  >
                    <HeartIcon />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-serif text-[20px] leading-none">
                    {restaurant.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-1 text-[9px] text-[#8c837a]">
                    <MapPinIcon />
                    {restaurant.location}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#f2ebe3] px-2.5 py-1 text-[8px] text-[#71685f]">
                      {restaurant.cuisine}
                    </span>

                    <span className="rounded-full bg-[#f2ebe3] px-2.5 py-1 text-[8px] text-[#71685f]">
                      {restaurant.price_range}
                    </span>

                    <span className="rounded-full bg-[#f2ebe3] px-2.5 py-1 text-[8px] text-[#71685f]">
                      {restaurant.available_tables} available
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ================================================================ */}
      {/* AI DINING COMPANION                                              */}
      {/* ================================================================ */}

      <section
        id="about"
        className="border-y border-[#ded5ca] bg-[#f3ece3]"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20">
          <div className="grid items-stretch gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            {/* Image */}
            <div className="relative min-h-[440px] overflow-hidden rounded-[24px] lg:min-h-[560px]">
              <img
                src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=90"
                alt="Friends enjoying dinner together at a restaurant"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#211b17]/35 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/75">
                    Your dining companion
                  </p>

                  <p className="mt-2 max-w-[260px] font-serif text-[25px] leading-[1.05] text-white">
                    Less searching.
                    <br />
                    More savoring.
                  </p>
                </div>

                <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#b74720] sm:flex">
                  <SparkleIcon />
                </div>
              </div>
            </div>

            {/* Editorial content */}
            <div className="flex flex-col justify-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#a74320]">
                Meet your AI dining companion
              </p>

              <h2 className="editorial-heading mt-5 max-w-[650px] text-[46px] leading-[0.96] sm:text-[58px]">
                Tell us what
                <br />
                you&apos;re craving.
              </h2>

              <p className="mt-6 max-w-[560px] text-[14px] leading-7 text-[#746d66] sm:text-[15px]">
                From a quiet table for two to a lively dinner with friends,
                FoodiePilot understands what you&apos;re looking for and helps
                you find the right place without endless searching.
              </p>

              <div className="mt-8">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#756d65]">
                  Start with an occasion
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {diningOccasions.map((occasion) => (
                    <button
                      key={occasion}
                      type="button"
                      onClick={() => handleDiningPrompt(occasion)}
                      className="rounded-full border border-[#d6cbc0] bg-[#fffdfa] px-4 py-2.5 text-[10px] font-medium text-[#5e5750] transition hover:border-[#b74720] hover:bg-[#fffaf5] hover:text-[#b74720]"
                    >
                      {occasion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={openConcierge}
                  className="inline-flex w-fit items-center gap-3 rounded-full bg-[#b74720] px-6 py-3.5 text-[10px] font-semibold text-white transition hover:bg-[#943817]"
                >
                  <SparkleIcon />
                  Try AI Concierge
                  <ArrowRight />
                </button>

                <p className="max-w-[220px] text-[9px] leading-4 text-[#938980]">
                  Ask naturally. FoodiePilot handles the search, availability,
                  and booking flow.
                </p>
              </div>

              <div className="mt-10 grid max-w-[560px] grid-cols-3 border-t border-[#ddd3c8] pt-6">
                <div>
                  <p className="font-serif text-[24px] text-[#29241f]">
                    01
                  </p>

                  <p className="mt-1 text-[9px] text-[#8c837a]">
                    Tell us your mood
                  </p>
                </div>

                <div className="border-l border-[#ddd3c8] pl-5">
                  <p className="font-serif text-[24px] text-[#29241f]">
                    02
                  </p>

                  <p className="mt-1 text-[9px] text-[#8c837a]">
                    Discover your match
                  </p>
                </div>

                <div className="border-l border-[#ddd3c8] pl-5">
                  <p className="font-serif text-[24px] text-[#29241f]">
                    03
                  </p>

                  <p className="mt-1 text-[9px] text-[#8c837a]">
                    Book your table
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CITIES                                                           */}
      {/* ================================================================ */}

      <section
        id="cities"
        className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a74320]">
              Explore cities
            </p>

            <h2 className="editorial-heading mt-3 text-[38px] sm:text-[45px]">
              Dine in Your Favorite City
            </h2>
          </div>

          <button className="hidden items-center gap-2 text-[11px] font-semibold text-[#b74720] sm:flex">
            View All Cities
            <ArrowRight />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cities.map((city) => {
            const isSelected = selectedCity === city.name;

            return (
              <button
                key={city.name}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedCity(city.name);
                  document
                    .getElementById("popular")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`group text-left transition ${
                  isSelected ? "text-[#b74720]" : "text-[#171513]"
                }`}
              >
                <div
                  className={`h-[125px] overflow-hidden rounded-[12px] border-2 transition ${
                    isSelected
                      ? "border-[#b74720] shadow-[0_10px_30px_rgba(183,71,32,0.14)]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                      isSelected ? "scale-105" : ""
                    }`}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="font-serif text-[17px]">
                    {city.name}
                  </p>

                  {isSelected && (
                    <span className="rounded-full bg-[#f2dfd5] px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#b74720]">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA                                                        */}
      {/* ================================================================ */}

      <section className="relative overflow-hidden bg-[#211b17]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1800&q=85"
            alt=""
            className="h-full w-full object-cover opacity-35"
          />

          <div className="absolute inset-0 bg-[#211b17]/60" />
        </div>

        <div className="relative mx-auto flex min-h-[300px] max-w-[1440px] flex-col items-center justify-center gap-8 px-6 py-16 text-center sm:flex-row sm:text-left lg:px-12">
          <div className="flex-1 sm:text-center">
            <h2 className="font-serif text-[38px] leading-none text-white sm:text-[48px]">
              Great Meals Create
              <br />
              Greater Memories.
            </h2>

            <div className="mx-auto mt-5 h-px w-12 bg-[#b74720]" />
          </div>

          <button
            type="button"
            onClick={openConcierge}
            className="flex shrink-0 items-center gap-3 rounded-full bg-[#fffdfa] px-6 py-3.5 text-[10px] font-semibold text-[#211b17] transition hover:bg-[#b74720] hover:text-white"
          >
            Start Exploring
            <ArrowRight />
          </button>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FOOTER                                                           */}
      {/* ================================================================ */}

      <footer className="bg-[#211b17] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-7 border-t border-white/10 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b74720] text-xs font-bold">
              F
            </div>

            <div>
              <p className="text-[12px] font-semibold">
                FoodiePilot
              </p>

              <p className="mt-0.5 text-[8px] text-white/35">
                Eat well. Discover more.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-[9px] text-white/40">
            <a href="#discover" className="hover:text-white">
              Discover
            </a>

            <a href="#collections" className="hover:text-white">
              Collections
            </a>

            <Link href="/bookings" className="hover:text-white">
              Bookings
            </Link>

            <a href="#concierge" className="hover:text-white">
              AI Concierge
            </a>

            <a href="#about" className="hover:text-white">
              About
            </a>
          </div>

          <p className="text-[8px] text-white/25">
            © 2026 FoodiePilot
          </p>
        </div>
      </footer>

      {/* ================================================================ */}
      {/* FLOATING AI CONCIERGE                                            */}
      {/* ================================================================ */}

      <div id="concierge">
        <AIConcierge />

        {authOpen && (
          <AuthModal
            onClose={() => setAuthOpen(false)}
            onAuthenticated={(token) => {
              setToken(token);
            }}
          />
        )}
      </div>
    </main>
  );
}