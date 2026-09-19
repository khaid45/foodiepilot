"use client";

import { useState } from "react";
import { chatWithAgent } from "@/lib/api";

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
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 1.5 5.1a4 4 0 0 0 2.8 2.8L21 12l-4.7 1.4a4 4 0 0 0-2.8 2.8L12 21l-1.4-4.8a4 4 0 0 0-2.8-2.8L3 12l4.8-1.4a4 4 0 0 0 2.8-2.8L12 3Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
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

export default function DiningCompanion() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("foodiepilot_token");
  });

  const sessionId = "homepage-dining-companion";

  const quickPrompts = [
    "Find a romantic dinner near the beach",
    "Find highly rated Indian restaurants",
    "Help me plan a dinner for two",
  ];

  const sendMessage = async (text?: string) => {
    const userMessage = (text ?? message).trim();

    if (!userMessage || loading) return;

    const currentToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("foodiepilot_token")
        : null);

    if (!currentToken) {
      setMessages((current) => [
        ...current,
        {
          role: "user",
          content: userMessage,
        },
        {
          role: "assistant",
          content:
            "Please sign in first so I can help you search, check availability, and manage bookings.",
        },
      ]);

      setMessage("");
      return;
    }

    setToken(currentToken);
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
        currentToken,
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

  return (
    <section className="border-y border-[#ded5ca] bg-[#f3ece3]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          {/* LEFT — EDITORIAL INTRO */}
          <div className="max-w-[500px]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a74320]">
              Your personal dining companion
            </p>

            <h2 className="editorial-heading mt-4 text-[44px] leading-[0.98] sm:text-[52px]">
              Tell us what
              <br />
              you&apos;re craving.
            </h2>

            <p className="mt-6 max-w-[440px] text-[13px] leading-6 text-[#756e67]">
              FoodiePilot understands what you&apos;re looking for and can
              help you discover restaurants, plan your evening, check
              availability, and make a reservation.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-[#d7ccc0] bg-[#fffdfa] px-3.5 py-2 text-[9px] text-[#756e67] transition hover:border-[#b74720] hover:text-[#b74720]"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-9 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b74720] text-white">
                <SparkleIcon />
              </div>

              <div>
                <p className="text-[10px] font-semibold text-[#29241f]">
                  Powered by FoodiePilot AI
                </p>

                <p className="mt-0.5 text-[8px] text-[#91887f]">
                  RAG + LangGraph agent
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — CHAT */}
          <div className="overflow-hidden rounded-[22px] border border-[#dcd1c5] bg-[#fffdfa] shadow-[0_18px_50px_rgba(66,43,24,0.08)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ebe3d9] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2dfd5] text-[#b74720]">
                  <SparkleIcon />
                </div>

                <div>
                  <p className="font-[var(--font-playfair)] text-[18px] text-[#29241f]">
                    FoodiePilot AI
                  </p>

                  <p className="text-[8px] uppercase tracking-[0.16em] text-[#9a9289]">
                    Dining companion
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-1.5 text-[8px] text-[#8c837a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6d8a5a]" />
                Online
              </span>
            </div>

            {/* Messages */}
            <div className="min-h-[330px] max-h-[470px] space-y-4 overflow-y-auto p-5">
              {messages.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2dfd5] text-[#b74720]">
                    <SparkleIcon />
                  </div>

                  <h3 className="mt-5 font-[var(--font-playfair)] text-[26px] text-[#29241f]">
                    How can I help you dine better?
                  </h3>

                  <p className="mt-2 max-w-[360px] text-[10px] leading-5 text-[#8c837a]">
                    Describe the experience you want, and I&apos;ll help you
                    find the right restaurant or take care of your booking.
                  </p>
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
                    <div className="max-w-[88%]">
                      <div
                        className={`rounded-[14px] px-4 py-3 text-[11px] leading-5 ${
                          item.role === "user"
                            ? "bg-[#b74720] text-white"
                            : "border border-[#e4dad0] bg-[#f7f2ea] text-[#4f4943]"
                        }`}
                      >
                        {item.content}
                      </div>

                      {item.role === "assistant" &&
                        item.restaurants &&
                        item.restaurants.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {item.restaurants.map((restaurant) => (
                              <button
                                key={restaurant.id}
                                onClick={() =>
                                  window.location.assign(
                                    `/restaurants/${restaurant.id}`
                                  )
                                }
                                className="group w-full rounded-[12px] border border-[#ded5ca] bg-white p-3 text-left transition hover:border-[#b74720] hover:shadow-sm"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-[11px] font-semibold text-[#29241f]">
                                      {restaurant.name}
                                    </p>

                                    <p className="mt-1 text-[9px] text-[#91887f]">
                                      {restaurant.location} ·{" "}
                                      {restaurant.cuisine}
                                    </p>
                                  </div>

                                  <span className="text-[10px] font-semibold text-[#b74720]">
                                    ★ {restaurant.rating.toFixed(1)}
                                  </span>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                  <span className="text-[9px] text-[#756e67]">
                                    {restaurant.price_range}
                                  </span>

                                  <span className="flex items-center gap-1 text-[9px] font-semibold text-[#b74720]">
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
                  <div className="rounded-[14px] border border-[#e4dad0] bg-[#f7f2ea] px-4 py-3 text-[10px] text-[#91887f]">
                    FoodiePilot is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-[#ebe3d9] p-4">
              <div className="flex items-center gap-2 rounded-[12px] border border-[#d9cec2] bg-white p-1.5 focus-within:border-[#b74720]">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Tell me what you're looking for..."
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[11px] text-[#29241f] outline-none placeholder:text-[#aaa198]"
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={!message.trim() || loading}
                  className="flex items-center gap-1.5 rounded-[9px] bg-[#b74720] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#913717] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? "..." : "Send"}
                  {!loading && <ArrowIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}