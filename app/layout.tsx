import "./globals.css";
import type { Metadata } from "next";
import AppShell from "./AppShell";
import PWARegister from "./pwa-register";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  metadataBase: new URL("https://baclogged.in"),

  title: {
    default: "Baclogged:Game Reviews & Ratings ",
    template: "%s | Baclogged",
  },

  description:
    "Baclogged is a game review platform where you can discover games, read reviews, rate games, and share your gaming opinions.",

  keywords: [
    "Baclogged",
    "Backlogged",

    "game reviews",
    "game ratings",
    "video game reviews",
    "gaming reviews",
  ],

  alternates: {
    canonical: "https://baclogged.in",
  },

  openGraph: {
    title: "Baclogged — Game Reviews & Ratings",
    description:
      "Discover games, read reviews, rate games, and share your gaming opinions.",
    url: "https://baclogged.in",
    siteName: "Baclogged",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
  
        <PWARegister />


        <AppShell>
          {children}
          <Analytics />
          <SpeedInsights />
        </AppShell>
      </body>
    </html>
  );
}
