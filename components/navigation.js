"use client";
import { useTheme } from "@/app/themecontext";
import { useUser } from "@/app/usercontext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaSun, FaMoon, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import UserAvatar from "./UserAvatar";
import OnboardingButton from "./OnboardingButton";
import AchievementButton from "./AchievementButton";
import { Suspense } from 'react';

// Client component that uses navigation hooks
export function NavigationClient() {
  const { darkMode, setDarkMode } = useTheme(); 
  const { user, signOut, requestAuthentication } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = () => {
    requestAuthentication();
    if (isMobile) {
      setIsOpen(false); // Close mobile menu after login click
    }
  };
  
  // Track active link based on current pathname
  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  // Custom link handler with visual feedback
  const handleNavigation = (e, href) => {
    e.preventDefault();
    
    // Set as active immediately for better UX
    setActiveLink(href);
    
    // Close mobile menu if open
    if (isOpen) {
      setIsOpen(false);
    }
    
    // Close user menu if open
    if (showUserMenu) {
      setShowUserMenu(false);
    }
    
    // Check if it's a hash link
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      // Navigate to the page
      router.push(path);
      // After a short delay, scroll to the element
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      // For regular links, proceed with normal navigation
      setTimeout(() => {
        router.push(href);
      }, 100);
    }
  };
  
  // Redirect logged-in users from home page to dashboard
  useEffect(() => {
    if (user && pathname === '/') {
      router.push('/dashboard');
    }
  }, [user, pathname, router]);

  return (
    <nav className={`p-1 md:p-4 shadow-md border-b border-border-light z-50 relative ${darkMode ? "bg-gray-900 text-white" : " bg-surface-elevated text-gray-800"}`}>
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        
        <Link href="/" className="text-2xl md:text-3xl font-bold text-primary flex-shrink-0 mr-1 md:mr-4">
          MotiveMentor
        </Link>
        
        <div className="hidden md:flex gap-4 lg:gap-6 text-sm lg:text-lg flex-grow justify-center">
          {user ? (
            // Navigation links for logged-in users
            <>
              <Link 
                href="/dashboard" 
                onClick={(e) => handleNavigation(e, "/dashboard")}
                className={`transition-colors duration-200 hover:text-primary no-underline ${activeLink === "/dashboard" ? "text-primary font-medium" : ""}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/goals" 
                onClick={(e) => handleNavigation(e, "/goals")}
                className={`transition-colors duration-200 hover:text-primary no-underline ${activeLink === "/goals" ? "text-primary font-medium" : ""}`}
              >
                Goal Tracker
              </Link>
              <Link 
                href="/chat" 
                onClick={(e) => handleNavigation(e, "/chat")}
                className={`transition-colors duration-200 hover:text-primary no-underline ${activeLink === "/chat" ? "text-primary font-medium" : ""}`}
              >
                Forum
              </Link>
              <Link 
                href="/dailyquotes" 
                onClick={(e) => handleNavigation(e, "/dailyquotes")}
                className={`transition-colors duration-200 hover:text-primary no-underline ${activeLink === "/dailyquotes" ? "text-primary font-medium" : ""}`}
              >
                Quote Generator
              </Link>
              <Link 
                href="/saved-quotes" 
                onClick={(e) => handleNavigation(e, "/saved-quotes")}
                className={`transition-colors duration-200 hover:text-primary no-underline ${activeLink === "/saved-quotes" ? "text-primary font-medium" : ""}`}
              >
                Saved Quotes
              </Link>
            </>
          ) : (
            // Navigation links for non-logged-in users
            <>
              <Link 
                href="/" 
                onClick={(e) => handleNavigation(e, "/")}
                className={`transition-colors duration-200 hover:text-primary no-underline ${activeLink === "/" ? "text-primary font-medium" : ""}`}
              >
                Home
              </Link>
              <Link 
                href="/#explore" 
                onClick={(e) => handleNavigation(e, "/#explore")}
                className={`transition-colors duration-200 hover:text-primary no-underline ${activeLink === "/#explore" ? "text-primary font-medium" : ""}`}
              >
                Explore
              </Link>
            </>
          )}
          
          {/* Common links for both logged-in and non-logged-in users */}
          <Link 
            href="/dailywordgame" 
            onClick={(e) => handleNavigation(e, "/dailywordgame")}
            className={`transition-colors duration-200 hover:text-primary no-underline ${activeLink === "/dailywordgame" ? "text-primary font-medium" : ""}`}
          >
            Word Game
          </Link>
          <Link 
            href="/books" 
            onClick={(e) => handleNavigation(e, "/books")}
            className={`transition-colors duration-200 hover:text-primary no-underline ${activeLink === "/books" ? "text-primary font-medium" : ""}`}
          >
            Books
          </Link>
          
          {!user && (
            <Link 
              href="/dailyquotes" 
              onClick={(e) => handleNavigation(e, "/dailyquotes")}
              className={`transition-colors duration-200 hover:text-primary no-underline ${activeLink === "/dailyquotes" ? "text-primary font-medium" : ""}`}
            >
              Generate Quotes
            </Link>
          )}
        </div>
          <div className="right-btns flex gap-2 md:gap-3 justify-between md:w-auto md:justify-center items-center z-20">
          <OnboardingButton variant="icon" />
          
          {user && <AchievementButton className="mr-1" />}
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="bg-surface border border-primary-dark p-1.5 md:p-2 rounded-full text-primary hover:bg-primary-light mx-1 md:mx-2 transition-colors duration-200 shadow-sm"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
          
          {/* Show user menu and sign-in only on desktop */}
          {!isMobile && user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center md:px-3 py-1 rounded hover:bg-primary-light transition-colors duration-200"
                aria-expanded={showUserMenu}
              >
                <div className="flex items-center w-auto">
                  <UserAvatar user={user} size="sm" className="scale-125 md:scale-150 md:mr-2" />
                  <span className="hidden md:inline ml-1 text-sm">{user.displayName?.split(' ')[0] || "User"}</span>
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 border border-border">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        const onboardingBtn = document.querySelector("[data-onboarding-trigger]");
                        if (onboardingBtn) onboardingBtn.click();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-primary-light transition-colors duration-200"
                    >
                      <span className="mr-2">❓</span> Take App Tour
                    </button>
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-primary-light transition-colors duration-200"
                    >
                      <span className="mr-2">⚙️</span> Settings
                    </Link>
                    <button
                      onClick={signOut}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-primary-light transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-2" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : !isMobile && !user ? (
            <button 
              onClick={handleLogin}
              className="btn btn-primary flex items-center gap-2 text-sm py-1.5 px-3"
            >
              <FaUserCircle size={16} /> Sign In
            </button>
          ) : null}
          
          <button 
            className="md:hidden text-2xl ml-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>
      </div>
        {isOpen && (
        <div className="md:hidden flex flex-col gap-3 mt-4 text-center text-base p-4 rounded-lg shadow-md border border-border">
          {user ? (
            // Navigation links for logged-in users
            <>
              {/* Mobile User Info Section */}
              <div className="flex flex-col items-center pb-3 mb-2 border-b border-border">
                <UserAvatar user={user} size="md" className="mb-2" />
                <span className="font-medium text-base">{user.displayName || "User"}</span>
                <span className="text-xs opacity-70">{user.email}</span>
              </div>
              
              <Link 
                href="/dashboard" 
                onClick={(e) => handleNavigation(e, "/dashboard")}
                className={`py-2 px-3 rounded-md transition-colors duration-200 hover:bg-primary-light ${activeLink === "/dashboard" ? "text-primary font-medium" : ""}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/goals" 
                onClick={(e) => handleNavigation(e, "/goals")}
                className={`py-2 px-3 rounded-md transition-colors duration-200 hover:bg-primary-light ${activeLink === "/goals" ? "text-primary font-medium" : ""}`}
              >
                Goal Tracker
              </Link>
              <Link 
                href="/chat" 
                onClick={(e) => handleNavigation(e, "/chat")}
                className={`py-2 px-3 rounded-md transition-colors duration-200 hover:bg-primary-light ${activeLink === "/chat" ? "text-primary font-medium" : ""}`}
              >
                Forum
              </Link>
              <Link 
                href="/dailyquotes" 
                onClick={(e) => handleNavigation(e, "/dailyquotes")}
                className={`py-2 px-3 rounded-md transition-colors duration-200 hover:bg-primary-light ${activeLink === "/dailyquotes" ? "text-primary font-medium" : ""}`}
              >
                Quote Generator
              </Link>
              <Link 
                href="/saved-quotes" 
                onClick={(e) => handleNavigation(e, "/saved-quotes")}
                className={`py-2 px-3 rounded-md transition-colors duration-200 hover:bg-primary-light ${activeLink === "/saved-quotes" ? "text-primary font-medium" : ""}`}
              >
                Saved Quotes
              </Link>
            </>
          ) : (
            // Navigation links for non-logged-in users
            <>
              <Link 
              href="/" 
              onClick={(e) => handleNavigation(e, "/")}
              className={`py-2 px-3 rounded-md transition-colors duration-200 hover:bg-primary-light ${activeLink === "/" ? "text-primary font-medium" : ""}`}
              >
                Home
              </Link>
              <Link 
                href="/#explore" 
                onClick={(e) => handleNavigation(e, "/#explore")}
                className={`py-2 px-3 rounded-md transition-colors duration-200 hover:bg-primary-light ${activeLink === "/#explore" ? "text-primary font-medium" : ""}`}
              >
                Explore
              </Link>
            </>
          )}
          
          {/* Common links for both logged-in and non-logged-in users */}
          <Link 
            href="/dailywordgame" 
            onClick={(e) => handleNavigation(e, "/dailywordgame")}
            className={`py-2 px-3 rounded-md transition-colors duration-200 hover:bg-primary-light ${activeLink === "/dailywordgame" ? "text-primary font-medium" : ""}`}
          >
            Word Game
          </Link>
          <Link 
            href="/books" 
            onClick={(e) => handleNavigation(e, "/books")}
            className={`py-2 px-3 rounded-md transition-colors duration-200 hover:bg-primary-light ${activeLink === "/books" ? "text-primary font-medium" : ""}`}
          >
            Books
          </Link>
          
          {!user && (
            <>
              <Link 
                href="/dailyquotes" 
                onClick={(e) => handleNavigation(e, "/dailyquotes")}
                className={`py-2 px-3 rounded-md transition-colors duration-200 hover:bg-primary-light ${activeLink === "/dailyquotes" ? "text-primary font-medium" : ""}`}
              >
                Generate Quotes
              </Link>
              
              {/* Mobile Sign In Button */}
              <button 
                onClick={handleLogin}
                className="btn btn-primary w-full mt-2 py-2.5 flex items-center justify-center gap-2"
              >
                <FaUserCircle size={18} /> Sign In
              </button>
            </>
          )}
          
          {user && (
            <>
              {/* User specific actions */}
              <div className="border-t border-border-light mt-2 pt-2">
                <button
                  onClick={() => {
                    const onboardingBtn = document.querySelector("[data-onboarding-trigger]");
                    if (onboardingBtn) onboardingBtn.click();
                    setIsOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-md text-left transition-colors duration-200 hover:bg-primary-light flex items-center"
                >
                  <span className="mr-2">❓</span> Take App Tour
                </button>
                
                <Link 
                  href="/settings" 
                  onClick={(e) => handleNavigation(e, "/settings")}
                  className="w-full py-2 px-3 rounded-md text-left transition-colors duration-200 hover:bg-primary-light flex items-center"
                >
                  <span className="mr-2">⚙️</span> Settings
                </Link>
                
                <button 
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-md text-left transition-colors duration-200 hover:bg-primary-light flex items-center text-error"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// Server component wrapper with Suspense
export default function Navigation() {
  return (
    <Suspense fallback={<nav className="p-4 py-6 shadow-md bg-surface-elevated border-b border-border-light">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl md:text-3xl font-bold text-primary">MotiveMentor</div>
      </div>
    </nav>}>
      <NavigationClient />
    </Suspense>
  );
}
