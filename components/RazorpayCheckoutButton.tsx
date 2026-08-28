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

export default function RazorpayCheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Razorpay Checkout could not load.");
      }

      const response = await fetch("/api/payment/create-order", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create payment order.");
      }

      const options = {
  key: data.keyId,
  amount: data.order.amount,
  currency: data.order.currency,
  name: "Backlogged",
  description: "Premium test payment",
  order_id: data.order.id,

  callback_url: `${window.location.origin}/api/payment/callback`,
  redirect: true,

  theme: {
    color: "#00e054",
  },
};

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="rounded-md bg-[#00e054] px-4 py-2 text-sm font-semibold text-[#0a0f0c] disabled:opacity-60"
    >
      {loading ? "Loading payment..." : "Pay ₹99 (Test)"}
    </button>
  );
}