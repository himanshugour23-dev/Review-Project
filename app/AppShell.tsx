"use client";

import Providers from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";


function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Providers>
     
      <Navbar />

   
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

    
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#0f172a",
            color: "#e5e7eb",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "14px 18px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#e6eb4bff",
              secondary: "#0f172a",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#0f172a",
            },
          },
        }}
      />
    </Providers>
  );
}
