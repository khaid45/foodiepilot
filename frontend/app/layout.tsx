import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FoodiePilot — AI-Powered Restaurant Discovery",
    template: "%s | FoodiePilot",
  },
  description:
    "Discover restaurants, check availability, and book effortlessly with FoodiePilot's AI-powered dining companion.",
  applicationName: "FoodiePilot",
  keywords: [
    "FoodiePilot",
    "restaurant discovery",
    "AI restaurant booking",
    "restaurant reservations",
    "AI dining assistant",
  ],
  authors: [{ name: "FoodiePilot" }],
  creator: "FoodiePilot",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body className={`${dmSans.variable} ${playfairDisplay.variable}`}>
       <AuthProvider>
        {children}
       </AuthProvider>
    </body>
  </html> 
  );
}