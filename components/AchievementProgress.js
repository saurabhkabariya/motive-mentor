"use client";

import { motion } from 'framer-motion';
import { useAchievements } from '@/app/achievementContext';

export default function AchievementProgress({ 
  category, 
  className = "",
  showTitle = true
}) {
  const { achievements, setShowAchievementsOverlay } = useAchievements();
  
  // Filter achievements by category
  const categoryAchievements = Object.values(achievements)
    .filter(a => a.category === category)
    .sort((a, b) => a.level - b.level);
  
  // Check if there are any achievements (meaning user is logged in)
  const hasAchievements = categoryAchievements.length > 0;
  
  if (!hasAchievements) return null;
  
  const completedCount = categoryAchievements.filter(a => a.completed).length;
  const totalCount = categoryAchievements.length;
  
  // Get the active achievement (the first incomplete one, or the last if all complete)
  const activeAchievement = categoryAchievements.find(a => !a.completed) || categoryAchievements[categoryAchievements.length - 1];
  
  // Calculate progress percentage
  const progressPercentage = Math.round((activeAchievement.progress / activeAchievement.maxProgress) * 100);
  
  return (
    <motion.div
      className={`bg-surface rounded-lg p-3 border border-border ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => setShowAchievementsOverlay(true)}
      whileHover={{ scale: 1.02 }}
      style={{ cursor: 'pointer' }}
    >
      {showTitle && (
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Achievement Progress</h4>
          <span className="text-xs text-muted">{completedCount}/{totalCount}</span>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          activeAchievement.completed 
            ? `bg-${activeAchievement.color} text-white` 
            : `bg-${activeAchievement.color}-light text-${activeAchievement.color}`
        }`}>
          <span className="text-lg">{activeAchievement.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-medium truncate">{activeAchievement.title}</h5>
          <div className="w-full bg-surface-elevated rounded-full h-2 mt-1 overflow-hidden">
            <motion.div 
              className={`bg-${activeAchievement.color} h-full rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-xs text-muted">{activeAchievement.progress}/{activeAchievement.maxProgress}</span>
            <span className="text-xs text-muted">{progressPercentage}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
