"use client";

import { useEffect, useState } from "react";

export default function NetworkWarningPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("network-warning-seen");
    if (!seen) {
      setShow(true);
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("network-warning-seen", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-[90%] max-w-md rounded-lg bg-gray-200 p-6 shadow-lg">
        <button
          onClick={closePopup}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Network Notice
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          Please use your <b>own internet connection</b>.
          <br />
          Many institute networks block game-related pages, so some routes may not
          load properly.
        </p>

        <p className="mt-4 text-right text-sm text-gray-500">
          Thank you 
        </p>
      </div>
    </div>
  );
}
