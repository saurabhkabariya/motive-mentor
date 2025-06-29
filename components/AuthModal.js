"use client";
import { useState, useEffect, useCallback } from "react";
import { FaTimes, FaGoogle } from "react-icons/fa";
import { 
  signInWithPopup, 
  signInWithRedirect, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { auth, provider, db } from "@/lib/firebaseConfig";
import { useTheme } from "@/app/themecontext";
import { useRouter } from "next/navigation";
import { testUserPermissions } from "@/app/utils/firestore-helper";

export default function AuthModal({ isOpen, onClose }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();
  const router = useRouter();
  
  // Track popup blocker detection
  const [useRedirectAuth, setUseRedirectAuth] = useState(false);
  
  useEffect(() => {
    // Reset error when modal opens
    if (isOpen) {
      setError("");
    }
    
    // Set persistence when component mounts
    setPersistence(auth, browserLocalPersistence).catch(error => {
      console.error("Error setting persistence:", error);
    });
    
    // Check local storage for previous popup issues
    const hadPopupIssues = localStorage.getItem('auth_use_redirect') === 'true';
    if (hadPopupIssues) {
      setUseRedirectAuth(true);
    }
  }, [isOpen]);
  
  const handleGoogleSignIn = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      // Configure sign-in options for better performance
      provider.setCustomParameters({
        prompt: 'select_account',
        'login_hint': '', // Clear any previous login hints
      });
      
      let result;
      
      // Use redirect auth if we've detected popup issues before
      if (useRedirectAuth) {
        await signInWithRedirect(auth, provider);
        // The page will redirect and handle auth in a separate flow
        return;
      }
      
      try {
        // Try popup authentication first
        result = await signInWithPopup(auth, provider);
      } catch (popupError) {
        console.warn("Popup auth failed, falling back to redirect:", popupError);
        
        // Check if error is related to popup blocking
        if (
          popupError.code === 'auth/popup-blocked' || 
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.code === 'auth/cancelled-popup-request' ||
          popupError.message?.includes('Cross-Origin-Opener-Policy')
        ) {
          // Remember to use redirect auth next time
          localStorage.setItem('auth_use_redirect', 'true');
          setUseRedirectAuth(true);
          
          // Use redirect auth as fallback
          await signInWithRedirect(auth, provider);
          return;
        } else {
          // Re-throw other errors
          throw popupError;
        }
      }
      
      const userId = result.user.uid;
      
      // After signing in, test if the user has permission to write to Firestore
      const hasPermission = await testUserPermissions(db, userId, (permissionError) => {
        console.warn("Firestore permission check failed after sign-in:", permissionError);
        // We won't show an error to the user here since they just signed in
        // The app will fall back to localStorage when they try to save quotes
      });
      
      if (!hasPermission) {
        console.warn("User has authenticated but lacks Firestore permissions. Local storage will be used as fallback.");
        // We still consider sign-in successful, we'll just use localStorage
      }
      
      // The modal will be closed automatically by the parent component
      // when it detects that the user is authenticated
    } catch (error) {
      console.error("Authentication error:", error);
      setError(getAuthErrorMessage(error.code || error.message));
    } finally {
      setLoading(false);
    }
  }, [useRedirectAuth]);
  
  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing the sign in.';
      case 'auth/cancelled-popup-request':
        return 'The sign-in popup was cancelled.';
      case 'auth/popup-blocked':
        return 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection and try again.';
      case 'auth/timeout':
        return 'The operation has timed out. Please try again.';
      default:
        return 'An error occurred. Please try again.';
    }  };const handleClose = (e) => {
    // Prevent event propagation when clicking the close button
    if (e) {
      e.stopPropagation();
    }
    // Call onClose first, which will trigger closeAuthModal in the parent component
    onClose();
    // No redirect here - let the parent component handle that if needed
  };
  if (!isOpen) return null;
    return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn" onClick={handleClose}>
      <div className={`relative w-full max-w-md p-8 rounded-lg shadow-xl animate-slideIn ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} border border-blue-300 dark:border-blue-700`} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 text-blue-600 dark:text-blue-400">Welcome</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Sign in to access all features</p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}        {/* Google Sign In Button */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-4 px-6 border border-gray-300 rounded-lg shadow-sm font-medium flex items-center justify-center space-x-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-70 transition-colors text-lg"
          aria-label="Sign in with Google"
        >
          {loading ? (
            <>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                <span>Opening Google Sign-in...</span>
              </div>
            </>
          ) : (
            <>
              <FaGoogle className="text-red-500 text-xl" />
              <span>Continue with Google</span>
            </>
          )}
        </button>
        
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
