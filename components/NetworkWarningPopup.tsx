"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wifi, ArrowUpRight, X } from "lucide-react";

export default function NetworkWarningPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("network-warning-seen");

    if (!seen) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!show) return;

    const timeout = window.setTimeout(() => {
      closePopup();
    }, 10_000);

    return () => window.clearTimeout(timeout);
  }, [show]);

  const closePopup = () => {
    sessionStorage.setItem("network-warning-seen", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closePopup}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="network-warning-title"
            className="relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/10 bg-[#101116] shadow-[0_25px_100px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >

            <div className="h-px bg-gradient-to-r from-transparent via-[#d9ff70] to-transparent" />

            <div className="p-6 sm:p-7">
  
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d9ff70]/20 bg-[#d9ff70]/[0.08] text-[#d9ff70]">
                    <Wifi size={21} strokeWidth={1.7} />
                  </div>

                  <div>
                    <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#d9ff70]/70">
                      System notice / 001
                    </p>
                    <h2
                      id="network-warning-title"
                      className="text-lg font-bold tracking-tight text-white"
                    >
                      Connection advisory
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closePopup}
                  aria-label="Dismiss network notice"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] text-white/40 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-sm leading-6 text-white/65">
                  Some networks may restrict access to game-related services.
                  If a page or feature doesn't load, try switching to another
                  network and give it another shot.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d9ff70]" />
                  You're all set
                </span>

                <span className="flex items-center gap-1.5 text-xs font-medium text-[#d9ff70]/80">
                  Thanks for your patience
                  <ArrowUpRight size={13} />
                </span>
              </div>

              {/* 10-second countdown bar */}
              <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/[0.05]">
                <motion.div
                  className="h-full origin-left bg-[#d9ff70]"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 10, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}