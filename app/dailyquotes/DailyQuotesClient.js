"use client";
import { useTheme } from "@/app/themecontext";
import LoadingScreen from "@/components/LoadingScreen";
import { useQuote } from "../quotecontext";
import { useUser } from "../usercontext";
import { useAchievements } from "../achievementContext";
import { useState, useEffect, useRef } from "react";
import { FiSave, FiCopy, FiRefreshCw, FiChevronUp, FiChevronDown, FiShare2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AdBanner from "@/components/AdBanner";
import TopAdBanner from "@/components/TopAdBanner";
import BottomAdContainer from "@/components/BottomAdContainer";
import AchievementProgress from "@/components/AchievementProgress";
import { getStoredItem, setStoredItem } from "@/app/utils/storage";

// Collection of background image URLs for the immersive interface
const backgroundImages = [
  'https://source.unsplash.com/random/1920x1080/?nature,mountains', 
  'https://source.unsplash.com/random/1920x1080/?nature,ocean',
  'https://source.unsplash.com/random/1920x1080/?nature,forest',
  'https://source.unsplash.com/random/1920x1080/?nature,sunset',
  'https://source.unsplash.com/random/1920x1080/?nature,sunrise',
  'https://source.unsplash.com/random/1920x1080/?nature,stars',
];

export default function DailyQuote() {
  const { darkMode } = useTheme(); 
  const { quote, author, fetchQuote, loading } = useQuote();
  const { user, loading: userLoading, requestAuthentication } = useUser();
  const { updateAchievementProgress } = useAchievements();
  const [saveStatus, setSaveStatus] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasDismissedLoginPrompt, setHasDismissedLoginPrompt] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const drawerRef = useRef(null);
  
  // Preload background images for smoother transitions
  useEffect(() => {
    backgroundImages.forEach(imageUrl => {
      const img = new Image();
      img.src = imageUrl;
    });
  }, []);
  
  // Load saved quotes
  useEffect(() => {
    const quotes = getStoredItem("savedQuotes", []);
    setSavedQuotes(quotes);
  }, []);

  // Load ads
  useEffect(() => {
    // Add script for ads
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = "//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js";
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Check if the user has dismissed the login prompt before
  useEffect(() => {
    const dismissed = getStoredItem("dismissedLoginPrompt", false);
    setHasDismissedLoginPrompt(dismissed);
  }, []);

  // Handle click outside drawer to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target) && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

  const changeBackground = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setBackgroundIndex((prev) => (prev + 1) % backgroundImages.length);
      setIsTransitioning(false);
    }, 500);
  };

  const saveQuote = () => {
    if (!quote) return;
    
    saveToLocalStorage();
    // Update achievement progress if user is logged in
    if (user) {
      updateAchievementProgress('quotes_saved_5');
      updateAchievementProgress('quotes_saved_20');
      updateAchievementProgress('quotes_saved_50');
    }
    
    // If user is not authenticated, show login prompt
    if (!user && !hasDismissedLoginPrompt) {
      setShowLoginPrompt(true);
    }
  };

  const saveToLocalStorage = () => {
    try {
      const savedQuotes = getStoredItem("savedQuotes", []);
      
      // Check if this quote is already saved
      const isAlreadySaved = savedQuotes.some(
        savedQuote => savedQuote.quote === quote && savedQuote.author === author
      );
      
      if (!isAlreadySaved) {
        const newQuote = {
          quote,
          author,
          savedAt: new Date().toISOString(),
          ...(user ? { userId: user.uid } : {})
        };
        
        const updatedQuotes = [...savedQuotes, newQuote];
        
        setStoredItem("savedQuotes", updatedQuotes);
        setSavedQuotes(updatedQuotes);
        setSaveStatus("Quote saved successfully!");
      } else {
        setSaveStatus("Quote already saved!");
      }
      
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error saving quote to localStorage:", error);
      setSaveStatus("Error saving quote. Please try again.");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${quote}" - ${author}`);
    setSaveStatus("Quote copied to clipboard");
    setTimeout(() => setSaveStatus(""), 3000);
  };
  
  const handleNewQuote = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      fetchQuote();
      changeBackground();
    }, 300);
  };
  
  // Handle login prompt actions
  const handleLogin = () => {
    setShowLoginPrompt(false);
    requestAuthentication("/saved-quotes");
  };
  
  const dismissLoginPrompt = () => {
    setShowLoginPrompt(false);
    setHasDismissedLoginPrompt(true);
    setStoredItem("dismissedLoginPrompt", true);
  };

  const deleteQuote = (index) => {
    const updatedQuotes = savedQuotes.filter((_, i) => i !== index);
    setSavedQuotes(updatedQuotes);
    setStoredItem("savedQuotes", updatedQuotes);
  };
  
  return (
    <div className={`relative flex flex-col min-h-screen overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-surface-elevated text-gray-800"}`}>
      {/* Fullscreen background with fade transition */}
      <div 
        className={`fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} 
        style={{ 
          backgroundImage: `url(${backgroundImages[backgroundIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          filter: darkMode ? 'brightness(0.75) saturate(0.9)' : 'brightness(0.9) saturate(1.1)',
          zIndex: 0 // Ensure background is behind all other content
        }}
      />
      
      {/* Floating ad at top */}
      <div className={`relative z-10 w-full mt-4`}>
        <TopAdBanner className={`w-full max-w-5xl mx-auto  ${darkMode ? "bg-gray-900 text-white" : " bg-surface-elevated text-gray-800"}`} />
      </div>

      {/* Achievement Progress for Quotes (if user is logged in) */}
      {user && (
        <div className="relative z-10 w-full max-w-lg mx-auto mt-4 px-4">
          <AchievementProgress 
            category="quotes" 
            className="bg-opacity-80 backdrop-blur-sm rounded-lg p-3"
          />
        </div>
      )}
      
      {/* Main quote content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {loading || userLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl"
            >
              <LoadingScreen />
            </motion.div>
          ) : (
            <motion.div
              key={quote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl text-center"
            >
              <motion.div 
                className={`p-6 backdrop-blur-md rounded-2xl shadow-xl border ${darkMode ? 'bg-gray-900/70 border-gray-700/50' : 'bg-gray-100/70 border-white/50'}`}
                whileHover={{ scale: 1.01 }}
              >
                <motion.p 
                  className={`text-3xl font-serif italic mb-4 ${darkMode ? 'text-white' : 'text-gray-800'} drop-shadow-sm`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  &quot;{quote}&quot;
                </motion.p>
                <motion.p 
                  className={`text-xl ${darkMode ? 'text-gray-200' : 'text-gray-700'} drop-shadow-sm`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  - {author}
                </motion.p>
                {saveStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 py-2 px-4 rounded-full ${darkMode ? 'bg-green-800/80 text-green-100' : 'bg-green-700/80 text-white'} backdrop-blur-sm text-sm font-medium drop-shadow-sm inline-block`}
                  >
                    {saveStatus}
                  </motion.div>
                )}
              </motion.div>
              
              {/* Action buttons */}
              <motion.div 
                className="mt-8 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-3 ${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white rounded-full hover:brightness-110 shadow-lg`}
                  onClick={handleNewQuote}
                >
                  <FiRefreshCw className="mr-1" /> New Quote
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-3 ${darkMode ? 'bg-green-700' : 'bg-green-600'} text-white rounded-full hover:brightness-110 shadow-lg`}
                  onClick={handleCopyQuote}
                >
                  <FiCopy className="mr-1" /> Copy
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-3 ${darkMode ? 'bg-yellow-700' : 'bg-yellow-600'} text-white rounded-full hover:brightness-110 shadow-lg`}
                  onClick={saveQuote}
                >
                  <FiSave className="mr-1" /> {user ? "Save" : "Save Quote"}
                </motion.button>
                
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-3 ${darkMode ? 'bg-purple-700' : 'bg-purple-600'} text-white rounded-full hover:brightness-110 shadow-lg`}
                  onClick={changeBackground}
                >
                  <FiRefreshCw className="mr-1" /> Change Background
                </motion.button> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Login prompt */}
        <AnimatePresence>
          {showLoginPrompt && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50"
            >
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-2xl p-6 mx-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-2">Save Your Collection</h3>
                <p className="text-sm mb-4">Sign in to access your saved quotes from any device and never lose your favorite motivational content.</p>
                <div className="flex flex-wrap gap-3 justify-end">
                  <button 
                    onClick={dismissLoginPrompt}
                    className="px-4 py-2 text-sm rounded-md hover:bg-opacity-80 transition-colors"
                  >
                    Maybe Later
                  </button>
                  <button 
                    onClick={handleLogin}
                    className={`px-4 py-2 text-sm rounded-md text-white ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} hover:bg-opacity-90 transition-colors`}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Saved quotes drawer */}
        <div 
          ref={drawerRef}
          className={`fixed bottom-0 left-0 right-0 ${isDrawerOpen ? 'h-80' : 'h-12'} z-20 transition-all duration-300 ease-in-out ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-md shadow-xl border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <button 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-800 rounded-full p-2 shadow-md border border-gray-200 dark:border-gray-700"
          >
            {isDrawerOpen ? <FiChevronDown /> : <FiChevronUp />}
          </button>
          
          <div className="h-12 flex justify-center items-center font-medium">
            {savedQuotes.length} Saved Quotes
          </div>
          
          {isDrawerOpen && (
            <div className="p-4 h-68 overflow-y-auto">
              {savedQuotes.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {savedQuotes.map((savedQuote, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/70 border-gray-200'} shadow relative`}
                    >
                      <p className="text-sm italic">&quot;{savedQuote.quote}&quot;</p>
                      <p className="text-xs mt-1">- {savedQuote.author}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs opacity-60">
                          {new Date(savedQuote.savedAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`"${savedQuote.quote}" - ${savedQuote.author}`);
                              setSaveStatus("Quote copied");
                              setTimeout(() => setSaveStatus(""), 2000);
                            }}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <FiCopy size={14} />
                          </button>
                          <button 
                            onClick={() => deleteQuote(index)}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors text-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                          </button>
                          <button 
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: 'Motivational Quote',
                                  text: `"${savedQuote.quote}" - ${savedQuote.author}`,
                                  url: window.location.href,
                                }).catch(err => console.error('Error sharing:', err));
                              } else {
                                handleCopyQuote();
                              }
                            }}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <FiShare2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 opacity-70">
                  <p>No saved quotes yet</p>
                  <p className="text-sm mt-2">Click the "Save Quote" button to add quotes to your collection</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <div className="relative z-10 mt-auto">
        <BottomAdContainer className={`w-full max-w-5xl mx-auto ${darkMode ? "bg-gray-900 text-white" : " bg-surface-elevated text-gray-800"}`} />
      </div>
    </div>
  );
}
