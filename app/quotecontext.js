"use client";
import { createContext, useContext, useEffect, useState } from "react";

const QuoteContext = createContext();

export const useQuote = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true); // 🔧 Added this

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://motivementor-backend.onrender.com/quote");
      const data = await response.json();
      setQuote(data[0].q);
      setAuthor(data[0].a);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote("Failed to load quote. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <QuoteContext.Provider value={{ quote, author, fetchQuote, loading }}>
      {children}
    </QuoteContext.Provider>
  );
};
