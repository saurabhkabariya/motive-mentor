"use client"; // ✅ Make this a client component

import { useTheme } from "@/app/themecontext";
import NotificationInitializer from "./NotificationInitializer";

export default function ThemeWrapper({ children }) {
  const { darkMode } = useTheme(); // ✅ Now works because it's inside a client component
  return (
    <div className={`min-h-[100vh] ${darkMode ? "dark bg-background dark:text-foreground" : "bg-background text-foreground"}`}>
      <NotificationInitializer />
      {children}
    </div>
  );
}
