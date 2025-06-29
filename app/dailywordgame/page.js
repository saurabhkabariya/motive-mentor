"use client"; // Ensure this is a Client Component

import { useTheme } from "@/app/themecontext";
import { useUser } from "@/app/usercontext";
import { useAchievements } from "@/app/achievementContext";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import AdBanner from "@/components/AdBanner";
import TopAdBanner from "@/components/TopAdBanner";
import BottomAdContainer from "@/components/BottomAdContainer";
import StaticAdBanner from "@/components/StaticAdBanner";
import DirectAdBanner from "@/components/DirectAdBanner";
import AchievementProgress from "@/components/AchievementProgress";

const EASY_WORD_API = "https://random-word-api.vercel.app/api?words=1&length=5";
const AD_URL = "https://ptakeemsaifegro.net/4/9084932"; // Ad link for watching hints & extra plays

export default function DailyWordGame() {
  const [word, setWord] = useState("");
  const [displayWord, setDisplayWord] = useState("");
  const [input, setInput] = useState("");
  const [tries, setTries] = useState(5);
  const [hints, setHints] = useState(1); // Only 1 free hint
  const [message, setMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0); // Track watched ads for extra hints & plays
  const [loading, setLoading] = useState(true);

  const { darkMode } = useTheme();
  const { user, loading: userLoading } = useUser();
  const { updateAchievementProgress } = useAchievements();

  useEffect(() => {
    if (userLoading) return;
    
    const initGameState = async () => {
      setLoading(true);
      
      // User-specific preferences for authenticated users
      if (user) {
        try {
          const userGameRef = doc(db, "users", user.uid, "gameData", "wordGame");
          const docSnap = await getDoc(userGameRef);
          
          if (docSnap.exists()) {
            const gameData = docSnap.data();
            setStreak(gameData.streak || 0);
            
            const lastPlayed = gameData.lastPlayed?.toDate() || null;
            const today = new Date().toDateString();
            
            if (lastPlayed && lastPlayed.toDateString() === today) {
              setGameOver(true);
              setMessage("🎮 You already played today! Watch an ad to play again.");
              if (gameData.currentWord) {
                setWord(gameData.currentWord);
                revealFirstLetter(gameData.currentWord);
              }
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error("Error fetching game data from Firestore:", error);
          // Fall back to localStorage if Firestore fails
        }
      }
      
      // If we don't have game data from Firestore, check localStorage
      const savedStreak = localStorage.getItem("streak") || 0;
      const lastPlayed = localStorage.getItem("lastPlayed");
      const savedWord = localStorage.getItem("dailyWord");

      setStreak(parseInt(savedStreak, 10));

      const today = new Date().toDateString();
      if (lastPlayed === today) {
        setGameOver(true);
        setMessage("🎮 You already played today! Watch an ad to play again.");
        if (savedWord) {
          setWord(savedWord);
          revealFirstLetter(savedWord);
        }
        setLoading(false);
        return;
      }

      // Fetch a new word if it's a new day or first time playing
      await fetchNewWord();
      setLoading(false);
    };

    initGameState();
  }, [user, userLoading]);

  const fetchNewWord = async () => {
    try {
      const response = await fetch(EASY_WORD_API);
      const data = await response.json();
      const newWord = data[0].toLowerCase();

      setWord(newWord);
      revealFirstLetter(newWord);

      // Save to localStorage for non-authenticated users
      localStorage.setItem("dailyWord", newWord);
      localStorage.setItem("lastPlayed", new Date().toDateString());
      
      // If authenticated, save to Firestore
      if (user) {
        try {
          const userGameRef = doc(db, "users", user.uid, "gameData", "wordGame");
          await setDoc(userGameRef, {
            currentWord: newWord,
            lastPlayed: new Date(),
            streak: streak
          }, { merge: true });
        } catch (error) {
          console.error("Error saving game data to Firestore:", error);
          // localStorage already updated as fallback
        }
      }
    } catch (error) {
      console.error("Error fetching word:", error);
      setMessage("⚠️ Error fetching word. Try again later.");
    }
  };

  const revealFirstLetter = (word) => {
    const firstLetter = word[0];
    setDisplayWord(firstLetter + " " + "_ ".repeat(word.length - 1).trim());
  };
  const handleSubmit = () => {
    if (gameOver) return;

    if (input.toLowerCase() === word) {
      setMessage("🎉 Correct! You've completed today's challenge.");
      const newStreak = streak + 1;
      setStreak(newStreak);
      setGameOver(true);
      
      // Update streak in localStorage
      localStorage.setItem("streak", newStreak);
      localStorage.setItem("lastPlayed", new Date().toDateString());
      
      // If authenticated, update Firestore and achievements
      if (user) {
        try {
          const userGameRef = doc(db, "users", user.uid, "gameData", "wordGame");
          setDoc(userGameRef, {
            streak: newStreak,
            lastPlayed: new Date(),
            wordsGuessed: (user?.wordsGuessed || 0) + 1
          }, { merge: true });
            // Update achievements
          updateAchievementProgress('words_guessed_10');
          updateAchievementProgress('words_guessed_50');
          updateAchievementProgress('words_guessed_100');
        } catch (error) {
          console.error("Error updating streak in Firestore:", error);
        }
      }
    } else {
      setTries((prev) => prev - 1);
      setMessage(`❌ Incorrect! ${tries - 1} tries left.`);
    }

    if (tries - 1 === 0) {
      setMessage(`❌ Better luck tomorrow! The correct word was "${word}".`);
      setGameOver(true);
      
      // Reset streak in localStorage
      localStorage.setItem("streak", 0);
      localStorage.setItem("lastPlayed", new Date().toDateString());
      
      // If authenticated, update Firestore
      if (user) {
        try {
          const userGameRef = doc(db, "users", user.uid, "gameData", "wordGame");
          setDoc(userGameRef, {
            streak: 0,
            lastPlayed: new Date()
          }, { merge: true });
        } catch (error) {
          console.error("Error resetting streak in Firestore:", error);
        }
      }
    }
    setInput("");
  };

  const revealHint = () => {
    if (gameOver) return;

    if (hints === 0) {
      watchAdForHint();
      return;
    }

    let updatedDisplay = displayWord.split(" ");
    let unrevealedIndexes = updatedDisplay
      .map((char, index) => (char === "_" ? index : null))
      .filter((index) => index !== null);

    if (unrevealedIndexes.length > 0) {
      const revealIndex = unrevealedIndexes[Math.floor(Math.random() * unrevealedIndexes.length)];
      updatedDisplay[revealIndex] = word[revealIndex];
    }

    setDisplayWord(updatedDisplay.join(" "));
    setHints((prev) => prev - 1);
  };

  const watchAdForHint = () => {
    window.open(AD_URL, "_blank");
    setTimeout(() => {
      setHints(hints + 1);
      setMessage("✅ You earned an extra hint!");
    }, 5000); // Simulating ad watch delay
  };

  const watchAdForExtraPlay = () => {
    window.open(AD_URL, "_blank");
    setTimeout(() => {
      setAdsWatched(adsWatched + 1);
      setGameOver(false);
      setTries(5);
      setHints(1);
      fetchNewWord();
      setMessage("✅ You can play again!");
    }, 5000); // Simulating ad watch delay
  };

  // Show loading state while initializing
  if (loading || userLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-5 md:mx-100 md:my-10 ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"} shadow-md rounded-md`}>      {/* Top Ad Banner */}
      <TopAdBanner className="w-full max-w-5xl mb-6" />
      
      <h1 className="text-2xl font-bold mb-4">Daily Word Game</h1>
      
      {/* Achievement Progress for Word Game */}
      {user && (
        <div className="w-full max-w-md mb-4">
          <AchievementProgress 
            category="wordgame" 
            className="mb-4"
          />
        </div>
      )}
      
      {/* Ad banner below title */}
      <AdBanner className="w-full max-w-md mb-6" />
      
      {loading ? (
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-4"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-36"></div>
        </div>
      ) : (
        <>
          {user ? (
            <p className="text-sm mb-3 font-bold">Welcome, {user.displayName || user.email}!</p>
          ) : (
            <div className="mb-3 text-sm">
              <span>Sign in to save your progress: </span>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                className="underline font-semibold"
              >
                Sign In
              </button>
            </div>
          )}
          
          <p className={`${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"} p-1 rounded-md`}>Streak: {streak} 🔥</p>
          <p className="text-lg mt-3">{displayWord}</p>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`word-input p-2 border rounded mt-3 ${darkMode ? "text-white placeholder:text-white" : "text-black placeholder:text-black"}`}
            placeholder="Enter your guess..."
            disabled={gameOver || tries === 0}
          />
          <div className="flex items-center justify-between">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 mt-3 rounded disabled:opacity-50"
              disabled={gameOver || tries === 0}
            >
              Submit
            </button>

            <button
              onClick={revealHint}
              className={`px-4 py-2 mt-2 ml-2 rounded ${
                hints > 0 ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
              }`}
            >
              {hints > 0 ? `Use Hint (${hints} left)` : "Watch Ad for Hint"}
            </button>
          </div>

          <p className="mt-3">Tries left: {tries}</p>
          <p className={` ${darkMode ? "text-white" : "text-gray-600"}`}>Hints left: {hints}</p>
          <p className="mt-3 font-semibold">{message}</p>

          {/* Ad Banner in the middle of game area */}
          <StaticAdBanner className="my-4 max-w-md mx-auto" />

          {gameOver && (
            <button
              onClick={watchAdForExtraPlay}
              className="bg-yellow-500 text-white px-4 py-2 mt-3 rounded"
            >
              Watch Ad to Play Again
            </button>
          )}
        </>
      )}
      
      {/* Side-by-side ads and game instructions in a responsive layout */}
      <div className="w-full max-w-5xl mt-8 flex flex-col md:flex-row justify-center items-center">
        
        <div className={`w-full mx-auto md:w-1/3 p-4 rounded-lg shadow ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Guess the hidden word in 5 tries</li>
            <li>Each correct letter position shows in the word</li>
            <li>Use hints when you're stuck</li>
            <li>Build your streak for higher scores</li>
          </ul>
        </div>
        
      </div>
      
      {/* Bottom Ad Container */}
      <BottomAdContainer className="mt-8 w-full max-w-5xl" />
    </div>
  );
}
