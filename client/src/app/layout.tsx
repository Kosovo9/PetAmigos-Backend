import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CosmicChristmasBackground from "@/components/CosmicChristmasBackground";
import NanoBananaShield from "@/components/NanoBananaShield";
import metadata from "./metadata";

export { metadata };

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <NanoBananaShield />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
