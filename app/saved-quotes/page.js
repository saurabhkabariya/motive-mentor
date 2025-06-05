"use client";
import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai"; 
import { FaRegCopy } from "react-icons/fa";
import { useTheme } from "../themecontext";


export default function SavedQuotes() {
  const { darkMode } = useTheme(); 
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedQuotes")) || [];
    setQuotes(saved);
  }, []);

  const deleteQuote = (index) => {
    const updatedQuotes = quotes.filter((_, i) => i !== index);
    setQuotes(updatedQuotes);
    localStorage.setItem("savedQuotes", JSON.stringify(updatedQuotes));
  };

  const handleCopyQuote = (quote, author) => {
    navigator.clipboard.writeText(`"${quote}" - ${author}`);
    alert("Quote copied to clipboard");
  };

  return (
    <div className={`min-h-screen p-5 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-2xl font-bold text-center">Saved Quotes</h1>
      {quotes.length === 0 ? (
        <p className="text-center mt-4">No saved quotes yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {quotes.map((q, index) => (
            <li
              key={index}
              className={`p-4 rounded-lg shadow flex justify-between items-center transition-all duration-300 hover:shadow-lg 
                ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div>
                <p>&quot;{q.quote}&quot;</p>
                <p className="text-gray-600 dark:text-gray-300">- {q.author}</p>
              </div>
              <div className="right-btns flex justify-between gap-5">
                <button
                  onClick={() => handleCopyQuote(q.q, q.a)}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                >
                  <FaRegCopy size={25} />
                </button>
                <button
                  onClick={() => deleteQuote(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <AiOutlineDelete size={25} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
