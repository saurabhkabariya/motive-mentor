"use client";

import { useTheme } from "@/app/themecontext";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  const { darkMode } = useTheme(); 
  return (
    <div className={`flex items-center justify-center p-10 rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-blue-100 text-white"}`}>
      <motion.div
        className="w-12 h-12 bg-blue-500 rounded-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="w-12 h-12 bg-red-500 rounded-md ml-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
      />
      <motion.div
        className="w-12 h-12 bg-green-500 rounded-md ml-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
      />
    </div>
  );
};

export default LoadingScreen;
