
"use client";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}