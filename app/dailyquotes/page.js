"use client";
import { useTheme } from "@/app/themecontext";
import LoadingScreen from "@/components/LoadingScreen";
import { useQuote } from "../quotecontext";

export default function DailyQuote() {
  const { darkMode } = useTheme(); 
  const { quote, author, fetchQuote, loading } = useQuote(); // ✅ Proper context usage

  const saveQuote = () => {
    let savedQuotes = JSON.parse(localStorage.getItem("savedQuotes")) || [];
    savedQuotes.push({ quote, author }); // ✅ Corrected quote save
    localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
    alert("Quote saved!");
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${quote}" - ${author}`);
    alert("Quote copied to clipboard");
  };

  return (
    <div className={`flex flex-col items-center justify-center mid-part p-5 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className={`p-6 rounded-lg shadow-md text-center max-w-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <p className="text-xl font-semibold">&quot;{quote}&quot;</p>
            <p className={`mt-2 ${darkMode ? "text-white" : "text-gray-600"}`}>- {author}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={fetchQuote}>
                Get New Quote
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleCopyQuote}>
                Copy Quote
              </button>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={saveQuote}>
                Save Quote
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
