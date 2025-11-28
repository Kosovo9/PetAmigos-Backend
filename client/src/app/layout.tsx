import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CosmicChristmasBackground from "@/components/CosmicChristmasBackground";
import CountdownOverlay from "@/components/CountdownOverlay";
import NanoBananaShield from "@/components/NanoBananaShield";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetMatch AI Studio - Christmas Edition 🎄",
  description: "Create hyper-realistic Christmas photos with AI. Santa, Elves, and Magic for your pets and family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <CosmicChristmasBackground />
        <CountdownOverlay />
        <NanoBananaShield />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
