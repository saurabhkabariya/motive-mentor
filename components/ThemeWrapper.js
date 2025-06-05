"use client"; // ✅ Make this a client component

import { useTheme } from "@/app/themecontext";

export default function ThemeWrapper({ children }) {
  const { darkMode } = useTheme(); // ✅ Now works because it's inside a client component

  return (
    <div className={`min-h-[100vh] ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {children}
    </div>
  );
}
