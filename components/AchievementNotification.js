"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '@/app/achievementContext';
import { FaTrophy, FaTimes } from 'react-icons/fa';

export default function AchievementNotification() {
  const { 
    showAchievementNotification, 
    setShowAchievementNotification,
    newAchievement 
  } = useAchievements();

  if (!newAchievement) return null;

  return (
    <AnimatePresence>
      {showAchievementNotification && (
        <motion.div
          className="fixed top-20 right-4 z-50 max-w-sm"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`bg-${newAchievement.color}-light border-2 border-${newAchievement.color} rounded-lg shadow-lg p-4 text-foreground relative`}>
            <button 
              onClick={() => setShowAchievementNotification(false)}
              className="absolute top-2 right-2 text-muted hover:text-foreground"
              aria-label="Close notification"
            >
              <FaTimes size={16} />
            </button>
            
            <div className="flex items-center">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-${newAchievement.color} text-white mr-4`}>
                <span className="text-2xl">{newAchievement.icon}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <FaTrophy className={`text-${newAchievement.color} mr-2`} />
                  <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                </div>
                <p className="font-medium">{newAchievement.title}</p>
                <p className="text-sm text-muted mt-1">{newAchievement.description}</p>
                
                <div className="mt-2 text-sm font-medium">
                  <span className={`text-${newAchievement.color}`}>Reward: {newAchievement.reward}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
