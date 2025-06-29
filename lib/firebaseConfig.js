"use client";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbJrRSsQ4HZERfE_QUBba95dXbzc-wOaI",
  authDomain: "motive-mentor-forum.firebaseapp.com",
  projectId: "motive-mentor-forum",
  storageBucket: "motive-mentor-forum.firebasestorage.app",
  messagingSenderId: "923542470059",
  appId: "1:923542470059:web:5dbed4a4111e9c3d2ee6ee",
  measurementId: "G-40D76WW0YT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure provider with settings that speed up the login process
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  // Optimization: By default force account selection to prevent stale tokens
  prompt: 'select_account',
});

// Initialize Firestore only when needed
export const db = getFirestore(app);

// Enable offline persistence for Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firestore persistence disabled: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required for persistence
        console.warn('Firestore persistence not supported in this browser');
      } else {
        console.error('Error enabling Firestore persistence:', err);
      }
    });
}

// Lazy load analytics only in production and only in the browser
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    try {
      const { getAnalytics, isSupported } = await import("firebase/analytics");
      const analyticsSupported = await isSupported();
      if (analyticsSupported) {
        return getAnalytics(app);
      }
    } catch (err) {
      console.error("Analytics initialization error:", err);
    }
  }
  return null;
};