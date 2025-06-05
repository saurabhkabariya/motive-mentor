"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useTheme } from "./themecontext";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export default function LandingPage() {

  const [isBottom, setIsBottom] = useState(false);
  const { darkMode } = useTheme();

  const [user, setUser] = useState(null);

  
    useEffect(() => {
      onAuthStateChanged(auth, (loggedInUser) => {
        setUser(loggedInUser);
      });
    }, []);
  
    const handleLogin = async () => {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    };

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setIsBottom(true);
      } else {
        setIsBottom(false); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (isBottom) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div className={`mx-auto px-6 py-12 w-full ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Hero Section */}
      <section className="text-center">
        <motion.h1
          className={`text-5xl font-bold leading-tight ${darkMode ? " text-white" : "text-gray-800"}`}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Welcome to <span className="text-blue-500">Motive Mentor</span>
        </motion.h1>
        <p className={`text-lg mt-4 ${darkMode ? " text-white" : "text-gray-600"}`}>
          Your ultimate platform for daily motivation, interactive word challenges, and a vibrant community.
        </p>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/chat">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition" onClick={handleLogin}>
              Join the Community
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Why Motive Mentor? */}
      <section className="mt-16 text-center">
        <h2 className={`text-3xl font-bold ${darkMode ? " text-white" : "text-gray-800"}`}>Why Choose Motive Mentor?</h2>
        <p className={`mt-3 ${darkMode ? " text-white" : "text-gray-600"}`}>
          We provide daily inspiration, fun challenges, and a community to help you stay motivated every day!
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-6">
          {[
            {
              title: "Daily Motivation",
              description: "Stay inspired with fresh motivational quotes tailored to uplift your mindset.",
              icon: "💡",
            },
            {
              title: "Engaging Word Challenges",
              description: "Boost your vocabulary and mental sharpness with our daily word puzzles.",
              icon: "🧠",
            },
            {
              title: "Community Forum",
              description: "Connect with like-minded individuals, share ideas, and grow together.",
              icon: "🤝",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`p-6 shadow-lg rounded-lg text-center ${darkMode ? " bg-gray-900" : "bg-white"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="text-4xl">{item.icon}</div>
              <h3 className="text-xl font-semibold mt-3">{item.title}</h3>
              <p className={`mt-2 ${darkMode ? " text-white" : "text-gray-600"}`}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16 px-5">
        <h2 className={`text-3xl font-bold text-center ${darkMode ? " text-white" : "text-gray-800"}`}>Explore Our Features</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            {
              title: "Quote Generator",
              description: "Discover motivational quotes that inspire and uplift you.",
              link: "/dailyquotes",
              image: "/images/quotes_section.jpg",
              bgColor: "bg-yellow-500",
            },
            {
              title: "Daily Word Game",
              description: "Challenge yourself with engaging word puzzles every day.",
              link: "/dailywordgame",
              image: "/images/wordgame_section.jpg",
              bgColor: "bg-green-500",
            },
            {
              title: "Motivational Forum",
              description: "Share your thoughts, get inspired, and interact with a positive community.",
              link: "/chat",
              image: "/images/forum_section.jpg",
              bgColor: "bg-blue-500",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-2xl shadow-lg text-white ${feature.bgColor}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover opacity-80" />
              <div className="p-5">
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.description}</p>
                <Link href={feature.link}>
                  <button className="mt-4 bg-white text-black py-2 px-4 rounded-md hover:bg-gray-200 transition">
                    Explore Now
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-16 text-center">
        <h2 className={`text-3xl font-bold ${darkMode ? " text-white" : "text-gray-800"}`}>Get Started Today!</h2>
        <p className={`mt-3 ${darkMode ? " text-white" : "text-gray-600"}`}>Join thousands of users on a journey of motivation and growth.</p>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/chat">
            <button className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition" onClick={handleLogin}>
              Sign Up for Free
            </button>
          </Link>
        </motion.div>
      </section>
      {/* Scroll Button (Only visible on Mobile) */}
      <button
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg md:hidden transition-transform duration-300"
        onClick={handleScroll}
      >
        {isBottom ? <FaArrowUp size={20} /> : <FaArrowDown size={20} />}
      </button>
    </div>
  );
}
