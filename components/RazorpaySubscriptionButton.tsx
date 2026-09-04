"use client";

import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

export default function RazorpaySubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Razorpay Checkout could not load.");
      }

      const response = await fetch("/api/subscription/create", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create subscription.");
      }

      const razorpay = new window.Razorpay({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Backlogged",
        description: "Premium monthly subscription — ₹99/month",

        callback_url: `${window.location.origin}/api/subscription/callback`,
        redirect: true,

        theme: {
          color: "#00e054",
        },
      });

      razorpay.open();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Could not start subscription."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="rounded-md bg-[#00e054] px-4 py-2 text-sm font-semibold text-[#0a0f0c] disabled:opacity-60"
    >
      {loading ? "Opening Checkout..." : "Subscribe ₹99/month (Test)"}
    </button>
  );
}