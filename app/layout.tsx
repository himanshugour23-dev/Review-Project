import "./globals.css";
import AppShell from "./AppShell";
import PWARegister from "./pwa-register";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
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
