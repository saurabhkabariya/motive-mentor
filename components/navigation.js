"use client";
import { useTheme } from "@/app/themecontext";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaSun, FaMoon } from "react-icons/fa";


export default function Navigation() {
  const { darkMode, setDarkMode } = useTheme(); 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`p-4 shadow-lg ${darkMode ? "bg-gray-900 text-white" : "bg-gray-900 text-white"}`}>
      <div className="container mx-auto flex justify-between items-center">
        
        <Link href="/" className="text-2xl md:text-3xl font-bold">
          MotiveMentor
        </Link>        <div className="hidden md:flex gap-6 text-lg">
          <Link href="/" className="hover:text-gray-300 transition">Home</Link>
          <Link href="/books" className="hover:text-gray-300 transition">Books</Link>
          <Link href="/chat" className="hover:text-gray-300 transition">Motivation Forum</Link>
          <Link href="/dailywordgame" className="hover:text-gray-300 transition">Daily Word Game</Link>
          <Link href="/dailyquotes" className="hover:text-gray-300 transition">Generate Quotes</Link>
          <Link href="/saved-quotes" className="hover:text-gray-300 transition">Saved Quotes</Link>
        </div>

        <div className="right-btns flex gap-3 justify-between md:w-[195px] md:justify-center">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="bg-white p-2 rounded-full text-blue-600 hover:bg-blue-200 mx-4"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          
          <button 
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>

        </div>
        
      </div>
      
      {isOpen && (        <div className={`md:hidden flex flex-col gap-4 mt-4 text-center text-lg ${darkMode ? "bg-gray-800" : "bg-blue-700"} p-4 rounded-lg`}>
          <Link href="/" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/books" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Books</Link>
          <Link href="/dailyquotes" className="hover:text-gray-300 transition"  onClick={() => setIsOpen(false)}>Generate Quotes</Link>
          <Link href="/dailywordgame" className="hover:text-gray-300 transition"  onClick={() => setIsOpen(false)}>Daily Word Game</Link>
          <Link href="/chat" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Motivation Forum</Link>
          <Link href="/saved-quotes" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Saved Quotes</Link>
        </div>
      )}
    </nav>
  );
}
