"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useTheme } from "./themecontext";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import HeroSection from "@/components/HeroSection";

export default function LandingPageClient() {
  const [isBottom, setIsBottom] = useState(false);
  const { darkMode } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
    });
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
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
    <div className={`mx-auto w-full ${darkMode ? "bg-gray-900 text-white" : "bg-background  text-gray-800"}`}>
      {/* Hero Section with Quote Carousel */}
      <section>
        <HeroSection />
      </section>

      {/* Why Motive Mentor? */}
      <section className="px-6 py-12 mt-8 text-center">
        <h2 className="heading-2 tracking-tight mb-2">Why Choose <span className="text-primary">Motive Mentor</span>?</h2>
        <p className="mt-3 max-w-2xl mx-auto text-muted">
          We provide daily inspiration, fun challenges, and a community to help you stay motivated every day!
        </p>
        <div className="grid md:grid-cols-4 gap-8 mt-10">
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
              title: "Achievement System",
              description: "Earn badges, track progress, and celebrate milestones on your journey to success.",
              icon: "🏆",
            },
            {
              title: "Goal Tracking",
              description: "Set meaningful goals, track your progress, and build habits with our gamified system.",
              icon: "🎯",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="card p-6 shadow-xl rounded-lg text-center border border-primary-dark hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="mt-2 font-medium text-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Achievement System Section */}
      <section className={`px-6 py-12 bg-gradient-to-b to-surface-elevated text-center ${darkMode ? "bg-gray-900 text-white" : "from-background text-gray-800"}`}>
        <h2 className="heading-2 tracking-tight mb-4">
          Track Your <span className="text-primary">Progress</span>
        </h2>
        <p className="text-muted max-w-2xl mx-auto mb-10">
          Our achievement system helps you stay motivated by recognizing your milestones and celebrating your progress.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div 
            className="p-6 rounded-xl shadow-lg border border-primary-dark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Earn Achievements</h3>
            <p className="text-muted">Complete tasks and unlock badges for your accomplishments across all features.</p>
          </motion.div>
          
          <motion.div 
            className="p-6 rounded-xl shadow-lg border border-primary-dark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Level Up</h3>
            <p className="text-muted">Progress through different levels as you consistently engage with the platform.</p>
          </motion.div>
          
          <motion.div 
            className="p-6 rounded-xl shadow-lg border border-primary-dark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Track Streaks</h3>
            <p className="text-muted">Maintain your daily streak to unlock special rewards and achievements.</p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16 px-5" id="explore">
        <h2 className="heading-2 tracking-tight text-center mb-6">
          Explore Our <span className="text-secondary">Features</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[
            {
              title: "Quote Generator",
              description: "Discover motivational quotes that inspire and uplift you.",
              link: "/dailyquotes",
              image: "/images/quotes_section.jpg",
              bgColor: "bg-primary",
              color: "text-white",
              achievement: "Collect quotes to earn badges"
            },
            {
              title: "Daily Word Game",
              description: "Challenge yourself with engaging word puzzles every day.",
              link: "/dailywordgame",
              image: "/images/wordgame_section.jpg",
              bgColor: "bg-success",
              color: "text-black",
              achievement: "Guess 100 words to become a Word Master"
            },
            {
              title: "Motivational Forum",
              description: "Share your thoughts, get inspired, and interact with a positive community.",
              link: "/chat",
              image: "/images/forum_section.jpg",
              bgColor: "bg-secondary",
              color: "text-white",
              achievement: "Become a Community Leader with 100 posts"
            },
            {
              title: "Goal Tracker",
              description: "Track your goals, build daily habits, and maintain streaks to stay motivated.",
              link: "/goals",
              image: "/images/goal_section.jpg",
              bgColor: "bg-warning",
              color: "text-black",
              achievement: "Maintain a 30-day streak for Monthly Master badge"
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${darkMode ? "text-white" : feature.color} ${feature.bgColor}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="relative w-full h-48">
                <Image 
                  src={feature.image} 
                  alt={feature.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-80"
                  priority={index < 2}
                  unoptimized
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold tracking-wide">{feature.title}</h3>
                <p className="text-sm opacity-90 font-medium my-2">{feature.description}</p>
                <div className="mt-2 bg-surface/20 rounded-md px-3 py-1.5 inline-block">
                  <span className="text-xs font-medium flex items-center">
                    <span className="mr-1">🏆</span> {feature.achievement}
                  </span>
                </div>
                <Link href={feature.link}>
                  <button className="btn mt-4 text-primary bg-surface py-2 px-6 rounded-md hover:bg-opacity-90 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1">
                    Explore Now
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-20 text-center pb-20 px-4">
        <div className="card-elevated max-w-4xl mx-auto rounded-3xl shadow-2xl p-10">
          <h2 className="heading-1 mb-4">
            <span className="text-primary">Get Started</span> Today!
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto mb-4 text-muted">
            Join thousands of users on a journey of motivation and growth.
          </p>
          
          {/* Achievement System Highlight */}
          <div className="flex justify-center items-center gap-6 my-6">
            <div className="flex flex-col items-center p-3 rounded-lg bg-surface/40">
              <span className="text-2xl mb-1">🏆</span>
              <span className="text-sm font-medium">Earn Badges</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-surface/40">
              <span className="text-2xl mb-1">📈</span>
              <span className="text-sm font-medium">Track Progress</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-surface/40">
              <span className="text-2xl mb-1">🎯</span>
              <span className="text-sm font-medium">Celebrate Milestones</span>
            </div>
          </div>
          
          <Link href="/dailyquotes">
            <button className="btn btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Start Your Motivation Journey
            </button>
          </Link>
        </div>
      </section>

      {/* Floating scroll button */}
      <button
        onClick={handleScroll}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 hover:scale-110"
        aria-label={isBottom ? "Scroll to top" : "Scroll to bottom"}
      >
        {isBottom ? <FaArrowUp size={20} /> : <FaArrowDown size={20} />}
      </button>
    </div>
  );
}
