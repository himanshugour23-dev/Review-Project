import "./globals.css";
import AppShell from "./AppShell";
import PWARegister from "./pwa-register";
import { SpeedInsights } from "@vercel/speed-insights/next"
export const metadata = {
  title: "Game Review Hub",
  description: "Game reviews platform",
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
        {/* Client-only PWA registration */}
        <PWARegister />

        {/* Client UI shell */}
        <AppShell>
          {children}
          <SpeedInsights />
        </AppShell>
      </body>
    </html>
  );
}
