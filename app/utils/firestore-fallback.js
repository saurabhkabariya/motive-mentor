"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

/**
 * Custom hook for handling Firestore operations with localStorage fallback
 * Use this when accessing collections that might have permission issues
 */
export function useFirestoreWithFallback(userId, collectionName, documentId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate a consistent localStorage key
  const localStorageKey = `${collectionName}_${documentId}_${userId}`;

  // Fetch data from Firestore with localStorage fallback
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to get from localStorage first
        const localData = localStorage.getItem(localStorageKey);
        let parsedLocalData = null;

        if (localData) {
          try {
            parsedLocalData = JSON.parse(localData);
            // Set initial data from localStorage to avoid UI delay
            setData(parsedLocalData);
          } catch (e) {
            console.error("Error parsing localStorage data:", e);
          }
        }

        // Then try Firestore
        const docRef = doc(db, "users", userId, collectionName, documentId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const firestoreData = docSnapshot.data();
          setData(firestoreData);
          
          // Update localStorage with latest from Firestore
          localStorage.setItem(localStorageKey, JSON.stringify(firestoreData));
          setError(null);
        } else if (parsedLocalData) {
          // If document doesn't exist in Firestore but we have localStorage data
          // Keep using the localStorage data
          console.log(`Using localStorage data for ${collectionName}/${documentId}`);
          setError(null);
        } else {
          // No data in Firestore or localStorage
          setData(null);
          setError(new Error("Document does not exist"));
        }
      } catch (err) {
        console.error(`Error fetching ${collectionName}/${documentId}:`, err);
        setError(err);
        
        // Still use localStorage data if available when Firestore fails
        const localData = localStorage.getItem(localStorageKey);
        if (localData) {
          try {
            setData(JSON.parse(localData));
            console.log(`Using localStorage data due to Firestore error`);
          } catch (e) {
            console.error("Error parsing localStorage data:", e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, collectionName, documentId, localStorageKey]);

  // Update data in Firestore with localStorage fallback
  const updateData = async (newData, merge = true) => {
    if (!userId) return false;

    try {
      // Update in localStorage first for immediate UI feedback
      const updatedData = merge ? { ...(data || {}), ...newData } : newData;
      localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
      
      // Update state
      setData(updatedData);
      
      // Try to update in Firestore
      const docRef = doc(db, "users", userId, collectionName, documentId);
      
      if (merge) {
        await setDoc(docRef, newData, { merge: true });
      } else {
        await setDoc(docRef, newData);
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error(`Error updating ${collectionName}/${documentId}:`, err);
      setError(err);
      // Data is already updated in localStorage and state
      return false;
    }
  };

  // Delete document from Firestore with localStorage fallback
  const deleteData = async () => {
    if (!userId) return false;

    try {
      // Remove from localStorage first
      localStorage.removeItem(localStorageKey);
      
      // Update state
      setData(null);
      
      // Try to delete from Firestore
      const docRef = doc(db, "users", userId, collectionName, documentId);
      await deleteDoc(docRef);
      
      setError(null);
      return true;
    } catch (err) {
      console.error(`Error deleting ${collectionName}/${documentId}:`, err);
      setError(err);
      // Data is already removed from localStorage and state
      return false;
    }
  };

  return { data, loading, error, updateData, deleteData };
}
