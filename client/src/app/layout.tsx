import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import CosmicChristmasBackground from "@/components/CosmicChristmasBackground";
import InteractiveSanta from "@/components/InteractiveSanta";
import LanguageSelector from "@/components/LanguageSelector";
import metadata from "./metadata";
import Script from "next/script";

export { metadata };

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.petmatch.fun/#organization",
      name: "PetMatch AI",
      url: "https://www.petmatch.fun",
      logo: {
        "@type": "ImageObject",
        url: "https://www.petmatch.fun/logo.png",
        width: 512,
        height: 512
      },
      sameAs: [
        "https://twitter.com/petmatchai",
        "https://facebook.com/petmatchai",
        "https://instagram.com/petmatchai",
        "https://linkedin.com/company/petmatchai"
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        availableLanguage: ["English", "Spanish", "Portuguese", "German", "Italian", "Chinese", "Japanese", "French", "Russian", "Korean"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.petmatch.fun/#website",
      url: "https://www.petmatch.fun",
      name: "PetMatch AI",
      description: "The ultimate pet super app with AI photo generation, chat, lost pet alerts, dog walking, and more",
      publisher: {
        "@id": "https://www.petmatch.fun/#organization"
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.petmatch.fun/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebApplication",
      name: "PetMatch AI",
      url: "https://www.petmatch.fun",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "Offer",
        price: "2.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1247",
        bestRating: "5",
        worstRating: "1"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.petmatch.fun/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.petmatch.fun"
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Structured Data */}
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            strategy="beforeInteractive"
          />

          {/* PWA Meta Tags */}
          <meta name="theme-color" content="#000000" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="PetMatch AI" />

          {/* Preconnect to important domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <CosmicChristmasBackground />
          <InteractiveSanta />
          <LanguageSelector />
          <div className="relative z-10 flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
