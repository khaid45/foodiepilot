"use client";

import { useState } from "react";
import { login, register } from "@/lib/api";

type AuthModalProps = {
  onClose: () => void;
  onAuthenticated: (token: string) => void;
};

export default function AuthModal({
  onClose,
  onAuthenticated,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "register" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        await register(
          name.trim(),
          email.trim(),
          password
        );
      }

      const data = await login(
        email.trim(),
        password
      );

      onAuthenticated(data.access_token);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to authenticate."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1815]/45 px-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-[20px] border border-[#ded5ca] bg-[#fffdf9] p-7 shadow-[0_25px_80px_rgba(27,24,21,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b74720]">
              {mode === "login"
                ? "Welcome back"
                : "Join FoodiePilot"}
            </p>

            <h2 className="font-[var(--font-playfair)] mt-2 text-[34px] leading-tight text-[#29241f]">
              {mode === "login"
                ? "Sign in to continue."
                : "Start discovering."}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[20px] text-[#756e67] transition hover:bg-[#f1e9df] hover:text-[#1b1815]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="mt-4 text-[11px] leading-5 text-[#756e67]">
          {mode === "login"
            ? "Sign in to manage reservations and book your next table."
            : "Create your FoodiePilot account and start exploring great restaurants."}
        </p>

        <div className="mt-6 space-y-3">
          {mode === "register" && (
            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Your name"
              className="w-full rounded-[10px] border border-[#d9cec2] bg-white px-4 py-3 text-[11px] text-[#29241f] outline-none transition focus:border-[#b74720]"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Email address"
            className="w-full rounded-[10px] border border-[#d9cec2] bg-white px-4 py-3 text-[11px] text-[#29241f] outline-none transition focus:border-[#b74720]"
          />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Password"
            className="w-full rounded-[10px] border border-[#d9cec2] bg-white px-4 py-3 text-[11px] text-[#29241f] outline-none transition focus:border-[#b74720]"
          />

          {error && (
            <div className="rounded-[10px] border border-[#e2c7bd] bg-[#f8ebe6] p-3">
              <p className="text-[10px] leading-5 text-[#913717]">
                {error}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              !email.trim() ||
              !password.trim() ||
              (mode === "register" && !name.trim())
            }
            className="w-full rounded-[10px] bg-[#b74720] px-4 py-3.5 text-[10px] font-semibold text-white transition hover:bg-[#913717] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </div>

        <div className="mt-6 border-t border-[#ebe3d9] pt-5 text-center">
          <p className="text-[10px] text-[#8c837a]">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setMode((current) =>
                current === "login"
                  ? "register"
                  : "login"
              );
              setError("");
            }}
            className="mt-1 text-[10px] font-semibold text-[#b74720] transition hover:text-[#913717]"
          >
            {mode === "login"
              ? "Create an account"
              : "Sign in instead"}
          </button>
        </div>
      </div>
    </div>
  );
}