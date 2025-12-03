import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { MockAuthProvider } from "@/components/MockAuthProvider";
import CosmicChristmasBackground from "@/components/CosmicChristmasBackground";
import InteractiveSanta from "@/components/InteractiveSanta";
import ChristmasMusic from "@/components/ChristmasMusic";
import LanguageSelector from "@/components/LanguageSelector";
import PetCursorChase from "@/components/PetCursorChase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    <MockAuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <CosmicChristmasBackground />
          <InteractiveSanta />
          <ChristmasMusic />
          <LanguageSelector />
          <PetCursorChase />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </MockAuthProvider>
  );
}
