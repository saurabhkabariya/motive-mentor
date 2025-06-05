"use client";
import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold text-white">About Motive Mentor</h3>
          <p className="mt-3 text-sm">
            Empowering minds with motivational quotes, interactive word games, and an inspiring community forum.
          </p>
        </div>

        {/* Quick Links */}
        <div>          <h3 className="text-xl font-bold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/books" className="hover:text-white">Bookstore</Link></li>
            <li><Link href="/dailyquotes" className="hover:text-white">Quote Generator</Link></li>
            <li><Link href="/dailywordgame" className="hover:text-white">Word Game</Link></li>
            <li><Link href="/chat" className="hover:text-white">Motivational Forum</Link></li>
            <li><Link href="/saved-quotes" className="hover:text-white">Saved Quotes</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* FAQs Section */}
        <div>
          <h3 className="text-xl font-bold text-white">FAQs</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li><strong>How does the Quote Generator work?</strong><br />Our AI selects and delivers unique motivational quotes daily.</li>
            <li><strong>How do I play the Word Game?</strong><br />Guess the daily word in five attempts! Earn rewards and climb the leaderboard.</li>
            <li><strong>What is the Motivational Forum?</strong><br />A positive community where users share stories, insights, and personal growth tips.</li>
          </ul>
        </div>

        {/* Newsletter & Social Media */}
        <div>
          <h3 className="text-xl font-bold text-white">Stay Inspired</h3>
          <p className="mt-3 text-sm">Subscribe to our newsletter for daily motivation and exclusive insights.</p>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="mt-3 w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700"
          />
          <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md cursor-pointer">
            Subscribe
          </button>

          {/* Social Media */}
          <div className="mt-4 flex space-x-4">
            <Link href="https://facebook.com"><FaFacebook /></Link>
            <Link href="https://twitter.com"><FaSquareXTwitter /></Link>
            <Link href="https://linkedin.com"><FaLinkedin /></Link>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 border-t border-gray-700 mt-10 pt-4">
        © {new Date().getFullYear()} Motive Mentor. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
