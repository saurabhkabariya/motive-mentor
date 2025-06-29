"use client";

import { FaTrophy } from 'react-icons/fa';
import { useAchievements } from '@/app/achievementContext';
import { motion } from 'framer-motion';

export default function AchievementButton({ className = "" }) {
  const { setShowAchievementsOverlay, achievements } = useAchievements();
  
  // Calculate the number of completed achievements
  const completedCount = Object.values(achievements).filter(a => a.completed).length;
  
  // Check if there are any achievements at all (meaning user is logged in)
  const hasAchievements = Object.keys(achievements).length > 0;
  
  if (!hasAchievements) return null;
  
  return (
    <motion.button
      onClick={() => setShowAchievementsOverlay(true)}
      className={`relative bg-surface p-2 rounded-full hover:bg-primary-light transition-colors duration-200 ${className}`}
      aria-label="View your achievements"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaTrophy className="text-primary" size={20} />
      
      {completedCount > 0 && (
        <motion.div 
          className="absolute -top-1 -right-1 bg-success text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          {completedCount}
        </motion.div>
      )}
    </motion.button>
  );
}
