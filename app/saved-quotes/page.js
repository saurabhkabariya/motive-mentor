"use client";
import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai"; 
import { FaRegCopy } from "react-icons/fa";
import { useTheme } from "../themecontext";
import { useUser } from "../usercontext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getStoredItem, setStoredItem } from "@/app/utils/storage";

export default function SavedQuotes() {
  const { darkMode } = useTheme(); 
  const { user, loading } = useUser();
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    const fetchQuotes = async () => {
      setIsLoading(true);
      
      // If user is authenticated, try to get quotes from Firestore
      if (user) {
        try {
          const userQuotesRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userQuotesRef);
          
          if (docSnap.exists() && docSnap.data().savedQuotes) {
            // Sort quotes by savedAt timestamp (newest first)
            const firestoreQuotes = docSnap.data().savedQuotes;
            setQuotes(firestoreQuotes);
              // Also update localStorage for offline access
            setStoredItem("savedQuotes", firestoreQuotes);
          } else {            // No quotes in Firestore, fall back to localStorage
            const localQuotes = getStoredItem("savedQuotes", []);
            setQuotes(localQuotes);
            
            // If we have local quotes, sync them to Firestore
            if (localQuotes.length > 0) {
              await updateDoc(userQuotesRef, {
                savedQuotes: localQuotes.map(q => ({
                  ...q,
                  savedAt: q.savedAt || new Date()
                }))
              }, { merge: true });
            }
          }        } catch (error) {
          console.error("Error fetching quotes from Firestore:", error);
          // Fall back to localStorage if Firestore fails
          const saved = getStoredItem("savedQuotes", []);
          setQuotes(saved);
        }
      } else {
        // User not authenticated, get quotes from localStorage
        const saved = getStoredItem("savedQuotes", []);
        setQuotes(saved);
      }
      
      setIsLoading(false);
    };

    fetchQuotes();
  }, [user, loading]);
  const deleteQuote = async (index) => {
    // Create a new array without the deleted quote
    const updatedQuotes = quotes.filter((_, i) => i !== index);
    setQuotes(updatedQuotes);
    
    // Update localStorage
    setStoredItem("savedQuotes", updatedQuotes);
    
    // If user is authenticated, update Firestore
    if (user) {
      try {
        const userQuotesRef = doc(db, "users", user.uid);
        await updateDoc(userQuotesRef, {
          savedQuotes: updatedQuotes
        });
      } catch (error) {
        console.error("Error updating Firestore:", error);
        // Firestore update failed, but local state and localStorage are already updated
      }
    }
  };

  const handleCopyQuote = (quote, author) => {
    navigator.clipboard.writeText(`"${quote}" - ${author}`);
    alert("Quote copied to clipboard");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (quotes.length === 0) {
      return <p className="text-center mt-4">No saved quotes yet.</p>;
    }

    return (
      <ul className="mt-4 space-y-3">
        {quotes.map((q, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg shadow flex justify-between items-center transition-all duration-300 hover:shadow-lg 
              ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div>
              <p>&quot;{q.quote}&quot;</p>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>- {q.author}</p>
            </div>
            <div className="right-btns flex justify-between gap-5">
              <button
                onClick={() => handleCopyQuote(q.quote, q.author)}
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
    );
  };
  return (    <div className={`min-h-screen p-5 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-2xl font-bold text-center">Saved Quotes</h1>
      
        {user ? (
        // For authenticated users, show all their quotes with sync feature
        renderContent()
      ) : (
        // For non-authenticated users
        <div>
          <div className="bg-blue-100 text-blue-800 p-4 my-4 rounded-lg dark:bg-blue-900 dark:text-blue-200">
            <p>Sign in to sync your saved quotes across devices!</p>
            <button 
              onClick={() => useUser().requestAuthentication('/saved-quotes')}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
            >
              Sign In
            </button>
          </div>          {renderContent()}
        </div>
      )}
    </div>
  );
}
