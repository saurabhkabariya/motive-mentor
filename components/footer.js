"use client";
import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useTheme } from "../app/themecontext";

const Footer = () => {
  const { darkMode } = useTheme();

  const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      };  return (
    <footer className={`text-foreground border-t border-border-light py-10 shadow-md relative z-10 ${darkMode ? "bg-gray-900 text-white" : "bg-surface-elevated text-gray-800"}`}>
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold text-primary">About Motive Mentor</h3>
          <p className="mt-3 text-sm text-muted">
            Empowering minds with motivational quotes, interactive word games, and an inspiring community forum.
          </p>
        </div>

        {/* Quick Links */}
        <div>            <h3 className="text-xl font-bold text-primary">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/goals" className="hover:text-primary transition-colors duration-200">Goal Tracker</Link></li>
            <li><Link href="/books" className="hover:text-primary transition-colors duration-200">Bookstore</Link></li>
            <li><Link href="/dailyquotes" className="hover:text-primary transition-colors duration-200">Quote Generator</Link></li>
            <li><Link href="/dailywordgame" className="hover:text-primary transition-colors duration-200">Word Game</Link></li>
            <li><Link href="/chat" className="hover:text-primary transition-colors duration-200">Motivational Forum</Link></li>
            <li><Link href="/saved-quotes" className="hover:text-primary transition-colors duration-200">Saved Quotes</Link></li>
            <li><Link href="/settings" className="hover:text-primary transition-colors duration-200">Settings</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
          </ul>
        </div>        {/* FAQs Section */}
        <div>
          <h3 className="text-xl font-bold text-primary">FAQs</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li><strong className="text-foreground">How does the Quote Generator work?</strong><br /><span className="text-muted">Our AI selects and delivers unique motivational quotes daily.</span></li>
            <li><strong className="text-foreground">How do I play the Word Game?</strong><br /><span className="text-muted">Guess the daily word in five attempts! Earn rewards and climb the leaderboard.</span></li>
            <li><strong className="text-foreground">What is the Motivational Forum?</strong><br /><span className="text-muted">A positive community where users share stories, insights, and personal growth tips.</span></li>
          </ul>
        </div>

        {/* Newsletter & Social Media */}
        <div>
          <h3 className="text-xl font-bold text-primary">Stay Inspired</h3>
          <p className="mt-3 text-sm text-muted">Subscribe to our newsletter for daily motivation and exclusive insights.</p>
          <button className="mt-2 w-full btn btn-primary py-2 rounded-md cursor-pointer" onClick={handleLogin}>
            Subscribe
          </button>

          {/* Social Media */}
          <div className="mt-4 flex space-x-4">
            <Link href="https://facebook.com" className="text-primary hover:text-primary transition-colors duration-200"><FaFacebook size={20} /></Link>
            <Link href="https://twitter.com" className="text-primary hover:text-primary transition-colors duration-200"><FaSquareXTwitter size={20} /></Link>
            <Link href="https://linkedin.com" className="text-primary hover:text-primary transition-colors duration-200"><FaLinkedin size={20} /></Link>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-muted border-t border-border mt-10 pt-4">
        © {new Date().getFullYear()} Motive Mentor. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
