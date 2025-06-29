"use client";
import { useState, useEffect } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const motivationalQuotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis"
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    quote: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs"
  },
  {
    quote: "Setting goals is the first step in turning the invisible into the visible.",
    author: "Tony Robbins"
  }
];

export default function MotivationalQuote({ darkMode }) {
  const [quote, setQuote] = useState(null);
  
  useEffect(() => {
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);
  
  if (!quote) return null;
  
  return (
    <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md text-center`}>
      <div className="relative max-w-lg mx-auto py-4 px-2">
        <FaQuoteLeft className="absolute top-0 left-0 text-blue-400 opacity-30 text-xl" />
        <p className="text-lg italic font-medium mb-2">
          {quote.quote}
        </p>
        <FaQuoteRight className="absolute bottom-0 right-0 text-blue-400 opacity-30 text-xl" />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        — {quote.author}
      </p>
    </div>
  );
}
