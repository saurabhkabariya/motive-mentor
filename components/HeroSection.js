"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/themecontext";
import { useRouter } from "next/navigation";

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  }
];

const HeroSection = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const { darkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeIn(false);
      
      // After animation completes, change quote and fade in
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFadeIn(true);
      }, 500); // Match this timing with the CSS transition duration
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleGetInspired = () => {
    router.push('/dailyquotes');
  };  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
      {/* Decorative elements with enhanced colors and animations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Primary color blob - top left */}
        <div 
          className={`absolute top-10 left-10 w-72 h-72 rounded-full ${darkMode ? 'bg-primary-dark/30' : 'bg-primary-light/70'} blur-3xl transform -translate-x-1/2 -translate-y-1/2 opacity-80 animate-float-slow`}
          style={{animationDelay: '0s'}}
        ></div>
        
        {/* Secondary color blob - bottom right */}
        <div 
          className={`absolute bottom-10 right-10 w-96 h-96 rounded-full ${darkMode ? 'bg-secondary-dark/30' : 'bg-secondary-light/70'} blur-3xl transform translate-x-1/2 translate-y-1/2 opacity-80 animate-float`}
          style={{animationDelay: '1s'}}
        ></div>
        
        {/* Success color blob - top right */}
        <div 
          className={`absolute top-1/2 right-1/4 w-48 h-48 rounded-full ${darkMode ? 'bg-success-dark/30' : 'bg-success-light/70'} blur-3xl opacity-60 animate-pulse-slow`}
          style={{animationDelay: '0.5s'}}
        ></div>
        
        {/* Info color blob - bottom left */}
        <div 
          className={`absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full ${darkMode ? 'bg-warning-dark/30' : 'bg-warning-light/70'} blur-3xl opacity-60 animate-float-reverse`}
          style={{animationDelay: '1.5s'}}
        ></div>
        
        {/* Additional decorative elements for more visual interest */}
        <div 
          className={`absolute top-3/4 right-1/3 w-40 h-40 rounded-full ${darkMode ? 'bg-primary-dark/20' : 'bg-primary-light/50'} blur-3xl opacity-70 animate-pulse`}
          style={{animationDelay: '2s'}}
        ></div>
        
        <div 
          className={`absolute top-1/4 left-2/3 w-56 h-56 rounded-full ${darkMode ? 'bg-secondary-dark/20' : 'bg-secondary-light/50'} blur-3xl opacity-70 animate-float-slow`}
          style={{animationDelay: '2.5s'}}
        ></div>
        
        {/* Add subtle pattern overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${darkMode ? 'via-surface-hover/10' : 'via-surface-hover/30'} to-transparent opacity-30`}></div>
        
        {/* Optional: subtle animated dots/particles */}
        <div className="absolute inset-0 opacity-10">
          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-primary-dark' : 'bg-primary'} absolute top-1/4 left-1/3 animate-ping-slow`}></div>
          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-secondary-dark' : 'bg-secondary'} absolute top-2/3 left-2/3 animate-ping-slow`} style={{animationDelay: '1s'}}></div>
          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-success-dark' : 'bg-success'} absolute top-1/2 left-1/4 animate-ping-slow`} style={{animationDelay: '2s'}}></div>
          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-warning-dark' : 'bg-warning'} absolute top-1/3 left-3/4 animate-ping-slow`} style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>      {/* Content container */}
      <div className="container mx-auto max-w-5xl relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-sm">
          <span className={`text-primary ${darkMode ? 'text-primary-dark' : 'text-primary'} font-black`}>Daily</span> Inspiration
        </h1>
        
        <div className="min-h-[160px] flex items-center justify-center mb-12">
          <div className={`transition-all duration-500 max-w-2xl transform ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <blockquote className={`text-xl md:text-3xl font-serif italic mb-4 drop-shadow-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              "{quotes[currentQuoteIndex].text}"
            </blockquote>
            <p className={`text-lg md:text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              — {quotes[currentQuoteIndex].author}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleGetInspired}
          className={`btn ${darkMode ? 'bg-primary-dark hover:bg-opacity-90' : 'bg-primary hover:bg-primary-hover'} px-8 py-4 text-lg md:text-xl font-bold rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl text-white relative overflow-hidden group`}
        >
          <span className="relative z-10">Get Inspired Today</span>
          <span className={`absolute inset-0 ${darkMode ? 'bg-secondary-dark' : 'bg-secondary'} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`}></span>
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
