"use client";

import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence,
  getRedirectResult 
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

// Create the UserContext
const UserContext = createContext(null);

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRedirectPath, setAuthRedirectPath] = useState(null);
  
  // Handle redirect auth result
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        // Check if we have a redirect result
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          console.log("Redirect authentication successful");
          // User is already set by onAuthStateChanged
        }
      } catch (error) {
        console.error("Error with redirect authentication:", error);
        // Don't show UI error, as it's a background process
      }
    };
    
    // Only run on client side
    if (typeof window !== 'undefined') {
      handleRedirectResult();
    }
  }, []);
  
  // Set persistence to local when the provider mounts
  useEffect(() => {
    // Set persistence to LOCAL to prevent unnecessary re-authentications
    setPersistence(auth, browserLocalPersistence).catch(error => {
      console.error("Error setting auth persistence:", error);
    });
  }, []);
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is signed in - only save what we need to minimize state updates
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName || authUser.email?.split('@')[0] || 'User',
          photoURL: authUser.photoURL,
        });
        
        // Close auth modal if it was open
        setShowAuthModal(false);
        
        // We don't clear authRedirectPath here - let the AuthModalContainer handle the redirect
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);// Sign out function
  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  // Show auth modal function
  const requestAuthentication = (redirectPath) => {
    // Store the redirectPath if provided
    if (redirectPath) {
      setAuthRedirectPath(redirectPath);
    }
    // Show the auth modal
    setShowAuthModal(true);
  };

  // Close auth modal function
  const closeAuthModal = () => {
    setShowAuthModal(false);
    // Don't clear the redirect path here, let it be used by AuthModalContainer
  };
  // Clear auth redirect path
  const clearAuthRedirectPath = () => {
    setAuthRedirectPath(null);
  };
  // Value object with user state and functions
  const value = useMemo(() => ({
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    showAuthModal,
    requestAuthentication,
    closeAuthModal,
    authRedirectPath,
    clearAuthRedirectPath,
  }), [user, loading, showAuthModal, authRedirectPath]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
