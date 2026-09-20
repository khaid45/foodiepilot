"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { chatWithAgent } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

type RestaurantResult = {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  rating: number;
  price_range: string;
  score?: number | null;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  restaurants?: RestaurantResult[];
};

function SparkleIcon() {
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
    >
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
      <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function AIConcierge() {
  const router = useRouter();

  const { token, setToken } = useAuth();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const sessionId = "main-concierge";

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return;
    }

    if (!token) {
      setAuthOpen(true);
      return;
    }

    const userMessage = message.trim();

    setMessage("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const data = await chatWithAgent(
        token,
        userMessage,
        sessionId
      );

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.response,
          restaurants: data.restaurants,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openRestaurant = (restaurantId: number) => {
    setOpen(false);
    router.push(`/restaurants/${restaurantId}`);
  };

  const quickPrompts = [
    "Find a romantic dinner",
    "Book a table for 2",
    "Show my bookings",
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* FLOATING AI BUTTON                                           */}
      {/* ============================================================ */}

{!open && (
  <button
    onClick={() => setOpen(true)}
    aria-label="Open FoodiePilot AI Concierge"
    className="fixed top-[84px] right-3 sm:top-auto sm:bottom-6 sm:right-6 z-40 flex items-center gap-3 rounded-full border border-[#d9cec2] bg-[#fffdf9] px-4 py-3 text-[#29241f] shadow-[0_12px_40px_rgba(27,24,21,0.16)] transition duration-300 hover:-translate-y-1 hover:border-[#b74720] hover:shadow-[0_16px_45px_rgba(27,24,21,0.2)]"
  >
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b74720] text-white">
      <SparkleIcon />
    </span>

    <span className="hidden text-left sm:block">
      <span className="block text-[10px] font-semibold">
        Ask FoodiePilot
      </span>

      <span className="mt-0.5 block text-[8px] text-[#8c837a]">
        Your AI dining concierge
      </span>
    </span>
  </button>
)}
      {/* ============================================================ */}
      {/* AI CONCIERGE PANEL                                           */}
      {/* ============================================================ */}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-40px)] max-w-[400px] overflow-hidden rounded-[20px] border border-[#d9cec2] bg-[#fffdf9] shadow-[0_25px_80px_rgba(27,24,21,0.2)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#ebe3d9] bg-[#f1e9df] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#b74720] text-white">
                <SparkleIcon />

                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#f1e9df] ${
                    token ? "bg-[#6d8a5a]" : "bg-[#c9beb1]"
                  }`}
                />
              </div>

              <div>
                <p className="font-[var(--font-playfair)] text-[18px] leading-none text-[#29241f]">
                  FoodiePilot AI
                </p>

                <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#8c837a]">
                  Dining concierge
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close AI Concierge"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#756e67] transition hover:bg-[#fffdf9] hover:text-[#1b1815]"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Conversation */}
          <div className="max-h-[350px] min-h-[280px] space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex min-h-[285px] flex-col justify-center">
                <div className="mx-auto max-w-[300px] text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f2dfd5] text-[#b74720]">
                    <SparkleIcon />
                  </div>

                  <p className="mt-5 font-[var(--font-playfair)] text-[25px] text-[#29241f]">
                    Where would you like to dine?
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-[#8c837a]">
                    I can discover restaurants, check
                    availability, make bookings, and manage
                    your reservations.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setMessage(prompt)}
                        className="rounded-full border border-[#d9cec2] bg-white px-3 py-2 text-[9px] text-[#5e5750] transition hover:border-[#b74720] hover:text-[#b74720]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className={`flex ${
                    item.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="max-w-[90%]">
                    <div
                      className={`rounded-[14px] px-4 py-3 text-[11px] leading-5 ${
                        item.role === "user"
                          ? "bg-[#b74720] text-white"
                          : "border border-[#e5dbd0] bg-[#f7f2ea] text-[#4f4943]"
                      }`}
                    >
                      {item.content}
                    </div>

                    {/* Structured restaurant results */}
                    {item.role === "assistant" &&
                      item.restaurants &&
                      item.restaurants.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {item.restaurants.map((restaurant) => (
                            <button
                              key={restaurant.id}
                              onClick={() =>
                                openRestaurant(restaurant.id)
                              }
                              className="group w-full rounded-[12px] border border-[#ded5ca] bg-[#fffdf9] p-3 text-left transition hover:-translate-y-0.5 hover:border-[#b74720] hover:shadow-[0_8px_25px_rgba(66,43,24,0.08)]"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-[11px] font-semibold text-[#29241f]">
                                    {restaurant.name}
                                  </p>

                                  <p className="mt-1 text-[9px] text-[#9a9289]">
                                    {restaurant.location} ·{" "}
                                    {restaurant.cuisine}
                                  </p>
                                </div>

                                <span className="shrink-0 text-[10px] font-semibold text-[#b74720]">
                                  ★{" "}
                                  {restaurant.rating.toFixed(1)}
                                </span>
                              </div>

                              <div className="mt-3 flex items-center justify-between">
                                <span className="text-[9px] text-[#756e67]">
                                  {restaurant.price_range}
                                </span>

                                <span className="flex items-center gap-1 text-[9px] font-semibold text-[#b74720] transition group-hover:translate-x-0.5">
                                  View restaurant
                                  <ArrowIcon />
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-[14px] border border-[#e5dbd0] bg-[#f7f2ea] px-4 py-3 text-[10px] text-[#9a9289]">
                  FoodiePilot is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#ebe3d9] bg-[#fffdf9] p-4">
            <div className="flex gap-2 rounded-[12px] border border-[#d9cec2] bg-white p-1.5 focus-within:border-[#b74720]">
              <input
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Ask FoodiePilot anything..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[11px] text-[#29241f] outline-none placeholder:text-[#aaa198]"
              />

              <button
                onClick={sendMessage}
                disabled={!message.trim() || loading}
                className="rounded-[9px] bg-[#b74720] px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-[#913717] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SHARED AUTH MODAL                                            */}
      {/* ============================================================ */}

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onAuthenticated={(newToken) => {
            setToken(newToken);
          }}
        />
      )}
    </>
  );
}