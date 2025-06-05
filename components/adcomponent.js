"use client"; // Ensures it runs only on the client side

import { useEffect } from "react";

export default function AdComponent() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://groleegni.net/401/9084854";
    script.async = true;

    try {
      document.body.appendChild(script);
    } catch (error) {
      console.error("Ad script failed to load:", error);
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="text-center">
      {/* <p className="text-gray-500 text-sm">Advertisement</p> */}
    </div>
  );
}
