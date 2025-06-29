"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/themecontext";
import { useUser } from "@/app/usercontext";
import { useQuote } from "@/app/quotecontext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Link from "next/link";
import AchievementStats from "./AchievementStats";
import { 
  FaTrophy, 
  FaFire, 
  FaQuoteLeft, 
  FaBook, 
  FaPuzzlePiece, 
  FaBookmark, 
  FaComment, 
  FaBullseye,
  FaArrowRight
} from "react-icons/fa";

export default function Dashboard() {
  const { darkMode } = useTheme();
  const { user } = useUser();
  const { quote, author } = useQuote();
  
  const [goals, setGoals] = useState([]);
  const [wordGameData, setWordGameData] = useState({ streak: 0, lastPlayed: null, level: 1 });
  const [goalStats, setGoalStats] = useState({ completed: 0, total: 0, streak: 0 });
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate badge level based on streaks and achievements
  const calculateLevel = (streaks) => {
    if (streaks >= 30) return { level: 5, badge: "Diamond" };
    if (streaks >= 21) return { level: 4, badge: "Platinum" };
    if (streaks >= 14) return { level: 3, badge: "Gold" };
    if (streaks >= 7) return { level: 2, badge: "Silver" };
    return { level: 1, badge: "Bronze" };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Fetch Word Game Data
        const wordGameRef = doc(db, "users", user.uid, "gameData", "wordGame");
        const wordGameSnap = await getDoc(wordGameRef);
        
        if (wordGameSnap.exists()) {
          const data = wordGameSnap.data();
          setWordGameData({
            streak: data.streak || 0,
            lastPlayed: data.lastPlayed?.toDate() || null,
            level: calculateLevel(data.streak || 0)
          });
        }
        
        // Fetch Goals Data
        const goalsRef = doc(db, "users", user.uid, "goals", "goalsList");
        const goalsSnap = await getDoc(goalsRef);
        
        if (goalsSnap.exists()) {
          const data = goalsSnap.data();
          const goalsArray = data.goals || [];
          setGoals(goalsArray.slice(0, 3)); // Get latest 3 goals
          
          // Calculate goal stats
          const completed = goalsArray.filter(goal => goal.completed).length;
          setGoalStats({
            completed,
            total: goalsArray.length,
            streak: data.streak || 0
          });
        }
        
        // Fetch Saved Quotes
        const savedQuotesRef = doc(db, "users", user.uid, "quotes", "savedQuotes");
        const savedQuotesSnap = await getDoc(savedQuotesRef);
        
        if (savedQuotesSnap.exists()) {
          const data = savedQuotesSnap.data();
          setSavedQuotes(data.quotes?.slice(0, 3) || []); // Get latest 3 saved quotes
        }
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // If no user is logged in, don't render the dashboard
  if (!user) return null;

  // Calculate badge and level info
  const { level, badge } = calculateLevel(Math.max(wordGameData.streak, goalStats.streak));

  // Format date
  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className={`min-h-screen py-8 px-4 md:px-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome, {user.displayName || user.email?.split('@')[0] || 'User'}!
          </h1>
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Here's your personalized dashboard with all your progress
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Achievement Stats Card */}
            <AchievementStats />
            
            {/* Daily Quote Card */}
            <div className={`rounded-xl p-6 shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center mb-4">
                <FaQuoteLeft className="text-2xl text-blue-500 mr-3" />
                <h2 className="text-xl font-bold">Today's Quote</h2>
              </div>
              <div className="mb-4">
                <blockquote className={`italic text-lg mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  "{quote || "Loading today's inspiration..."}"
                </blockquote>
                <p className="text-right font-medium">— {author || "Unknown"}</p>
              </div>
              <Link 
                href="/dailyquotes" 
                className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 font-medium mt-4 
                  ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
              >
                Get More Quotes <FaArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Word Game Status Card */}
            <div className={`rounded-xl p-6 shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center mb-4">
                <FaPuzzlePiece className="text-2xl text-green-500 mr-3" />
                <h2 className="text-xl font-bold">Word Challenge</h2>
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <FaFire className={`mr-2 ${wordGameData.streak > 0 ? "text-orange-500" : "text-gray-400"}`} />
                  <span className="font-medium">Current Streak: {wordGameData.streak} days</span>
                </div>
                <div className="flex items-center mb-3">
                  <span className="font-medium">Last Played: {formatDate(wordGameData.lastPlayed)}</span>
                </div>
                <div className="flex items-center">
                  <FaTrophy className={`mr-2 text-yellow-500`} />
                  <span className="font-medium">Level: {level} ({badge})</span>
                </div>
              </div>
              <Link 
                href="/dailywordgame" 
                className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 font-medium mt-4 
                  ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white`}
              >
                Play Today's Challenge <FaArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Goals Progress Card */}
            <div className={`rounded-xl p-6 shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center mb-4">
                <FaBullseye className="text-2xl text-purple-500 mr-3" />
                <h2 className="text-xl font-bold">Goal Tracker</h2>
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-3 justify-between">
                  <span className="font-medium">Completed:</span>
                  <span>{goalStats.completed}/{goalStats.total} goals</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${goalStats.total > 0 ? (goalStats.completed / goalStats.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="flex items-center">
                  <FaFire className={`mr-2 ${goalStats.streak > 0 ? "text-orange-500" : "text-gray-400"}`} />
                  <span className="font-medium">Activity Streak: {goalStats.streak} days</span>
                </div>
              </div>
              <Link 
                href="/goals" 
                className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 font-medium mt-4 
                  ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"} text-white`}
              >
                View All Goals <FaArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Recent Saved Quotes Card */}
            <div className={`rounded-xl p-6 shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center mb-4">
                <FaBookmark className="text-2xl text-red-500 mr-3" />
                <h2 className="text-xl font-bold">Saved Quotes</h2>
              </div>
              <div className="mb-4">
                {savedQuotes.length > 0 ? (
                  <ul className={`space-y-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {savedQuotes.map((q, index) => (
                      <li key={index} className="italic">"{q.quote.substring(0, 60)}..."</li>
                    ))}
                  </ul>
                ) : (
                  <p>No saved quotes yet. Start saving your favorites!</p>
                )}
              </div>
              <Link 
                href="/saved-quotes" 
                className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 font-medium mt-4 
                  ${darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white`}
              >
                View Saved Quotes <FaArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Books Card */}
            <div className={`rounded-xl p-6 shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center mb-4">
                <FaBook className="text-2xl text-yellow-500 mr-3" />
                <h2 className="text-xl font-bold">Recommended Books</h2>
              </div>
              <div className="mb-4">
                <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Discover motivational books curated just for you to boost your personal growth journey.
                </p>
              </div>
              <Link 
                href="/books" 
                className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 font-medium mt-4 
                  ${darkMode ? "bg-yellow-600 hover:bg-yellow-700" : "bg-yellow-500 hover:bg-yellow-600"} text-white`}
              >
                Browse Books <FaArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Chat Card */}
            <div className={`rounded-xl p-6 shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center mb-4">
                <FaComment className="text-2xl text-teal-500 mr-3" />
                <h2 className="text-xl font-bold">Motivation Chat</h2>
              </div>
              <div className="mb-4">
                <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Need a quick boost? Chat with our AI assistant for personalized motivation and advice.
                </p>
              </div>
              <Link 
                href="/chat" 
                className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 font-medium mt-4 
                  ${darkMode ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-500 hover:bg-teal-600"} text-white`}
              >
                Start Chatting <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
