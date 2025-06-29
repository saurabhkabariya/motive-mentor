"use client";
import { useTheme } from "@/app/themecontext";

export default function LoadingFallback() {
  const { darkMode } = useTheme();
  
  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Loading page...</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          We're preparing the content for you. This will just take a moment.
        </p>
      </div>
    </div>
  );
}
