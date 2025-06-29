"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

// Achievement definitions
export const ACHIEVEMENTS = {
  // Goal Streaks
  GOAL_STREAK_3: {
    id: 'goal_streak_3',
    title: '3-Day Streak',
    description: 'Maintain your goals for 3 consecutive days',
    icon: '🔥',
    category: 'goals',
    level: 1,
    maxProgress: 3,
    color: 'success',
    reward: 'Streak Badge',
  },
  GOAL_STREAK_7: {
    id: 'goal_streak_7',
    title: '7-Day Streak',
    description: 'Maintain your goals for a full week',
    icon: '🔥',
    category: 'goals',
    level: 2,
    maxProgress: 7,
    color: 'success',
    reward: '50 Motivation Points',
  },
  GOAL_STREAK_30: {
    id: 'goal_streak_30',
    title: 'Monthly Master',
    description: 'Maintain your goals for 30 consecutive days',
    icon: '🏆',
    category: 'goals',
    level: 3,
    maxProgress: 30,
    color: 'success',
    reward: 'Gold Badge & 200 Motivation Points',
  },

  // Word Game Achievements
  WORDS_GUESSED_10: {
    id: 'words_guessed_10',
    title: 'Word Beginner',
    description: 'Correctly guess 10 words in the daily word game',
    icon: '📝',
    category: 'wordgame',
    level: 1,
    maxProgress: 10,
    color: 'warning',
    reward: 'Word Badge',
  },
  WORDS_GUESSED_50: {
    id: 'words_guessed_50',
    title: 'Word Enthusiast',
    description: 'Correctly guess 50 words in the daily word game',
    icon: '📚',
    category: 'wordgame',
    level: 2,
    maxProgress: 50,
    color: 'warning',
    reward: '75 Motivation Points',
  },
  WORDS_GUESSED_100: {
    id: 'words_guessed_100',
    title: 'Word Master',
    description: 'Correctly guess 100 words in the daily word game',
    icon: '🧠',
    category: 'wordgame',
    level: 3,
    maxProgress: 100,
    color: 'warning',
    reward: 'Word Master Badge & 150 Motivation Points',
  },

  // Forum Contributions
  FORUM_POSTS_5: {
    id: 'forum_posts_5',
    title: 'Community Newcomer',
    description: 'Make 5 posts in the motivation forum',
    icon: '💬',
    category: 'forum',
    level: 1,
    maxProgress: 5,
    color: 'secondary',
    reward: 'Forum Badge',
  },
  FORUM_POSTS_25: {
    id: 'forum_posts_25',
    title: 'Active Contributor',
    description: 'Make 25 posts in the motivation forum',
    icon: '👥',
    category: 'forum',
    level: 2,
    maxProgress: 25,
    color: 'secondary',
    reward: '100 Motivation Points',
  },
  FORUM_POSTS_100: {
    id: 'forum_posts_100',
    title: 'Community Leader',
    description: 'Make 100 posts in the motivation forum',
    icon: '👑',
    category: 'forum',
    level: 3,
    maxProgress: 100,
    color: 'secondary',
    reward: 'Community Leader Badge & 300 Motivation Points',
  },

  // Quote Savings
  QUOTES_SAVED_5: {
    id: 'quotes_saved_5',
    title: 'Quote Collector',
    description: 'Save 5 motivational quotes to your collection',
    icon: '✨',
    category: 'quotes',
    level: 1,
    maxProgress: 5,
    color: 'primary',
    reward: 'Quote Badge',
  },
  QUOTES_SAVED_20: {
    id: 'quotes_saved_20',
    title: 'Inspiration Seeker',
    description: 'Save 20 motivational quotes to your collection',
    icon: '💫',
    category: 'quotes',
    level: 2,
    maxProgress: 20,
    color: 'primary',
    reward: '50 Motivation Points',
  },
  QUOTES_SAVED_50: {
    id: 'quotes_saved_50',
    title: 'Wisdom Curator',
    description: 'Save 50 motivational quotes to your collection',
    icon: '🌟',
    category: 'quotes',
    level: 3,
    maxProgress: 50,
    color: 'primary',
    reward: 'Wisdom Curator Badge & 150 Motivation Points',
  },
};

// Create context
const AchievementContext = createContext();

export function AchievementProvider({ children }) {
  const [achievements, setAchievements] = useState({});
  const [user, setUser] = useState(null);
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [showAchievementsOverlay, setShowAchievementsOverlay] = useState(false);  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen for achievement updates from Firestore when user is logged in
  useEffect(() => {
    let unsubscribe = () => {};

    if (user) {
      const userAchievementsRef = doc(db, 'user_achievements', user.uid);
      
      // Initialize achievements document if it doesn't exist
      const initializeAchievements = async () => {
        const docSnap = await getDoc(userAchievementsRef);
        if (!docSnap.exists()) {
          // Create a default achievements object with progress 0 for all achievements
          const defaultAchievements = Object.keys(ACHIEVEMENTS).reduce((acc, key) => {
            acc[ACHIEVEMENTS[key].id] = { 
              ...ACHIEVEMENTS[key],
              progress: 0,
              completed: false,
              completedAt: null
            };
            return acc;
          }, {});
          
          await setDoc(userAchievementsRef, { achievements: defaultAchievements });
        }
      };
      
      initializeAchievements();
      
      // Set up real-time listener for achievement updates
      unsubscribe = onSnapshot(userAchievementsRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setAchievements(userData.achievements || {});
        }
      });
    } else {
      // Reset achievements when user logs out
      setAchievements({});
    }

    return () => unsubscribe();
  }, [user]);

  // Update achievement progress
  const updateAchievementProgress = async (achievementId, incrementBy = 1) => {
    if (!user) return;
    
    const userAchievementsRef = doc(db, 'user_achievements', user.uid);
    const docSnap = await getDoc(userAchievementsRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const currentAchievements = userData.achievements || {};
      
      if (currentAchievements[achievementId]) {
        const achievement = currentAchievements[achievementId];
        const newProgress = Math.min(achievement.progress + incrementBy, achievement.maxProgress);
        const wasCompleted = achievement.completed;
        const isNowCompleted = newProgress >= achievement.maxProgress;
        
        // Update the achievement
        const updatedAchievement = {
          ...achievement,
          progress: newProgress,
          completed: isNowCompleted,
          completedAt: isNowCompleted && !wasCompleted ? new Date().toISOString() : achievement.completedAt
        };
        
        // Update Firestore
        await updateDoc(userAchievementsRef, {
          [`achievements.${achievementId}`]: updatedAchievement
        });
        
        // Show notification if achievement newly completed
        if (isNowCompleted && !wasCompleted) {
          setNewAchievement(updatedAchievement);
          setShowAchievementNotification(true);
          
          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setShowAchievementNotification(false);
          }, 5000);
        }
        
        return updatedAchievement;
      }
    }
  };

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        updateAchievementProgress,
        showAchievementNotification,
        setShowAchievementNotification,
        newAchievement,
        showAchievementsOverlay,
        setShowAchievementsOverlay,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

// Custom hook to use the achievement context
export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}
