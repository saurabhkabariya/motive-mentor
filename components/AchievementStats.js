"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaArrowRight } from 'react-icons/fa';
import { useAchievements } from '@/app/achievementContext';

export default function AchievementStats() {
  const { achievements, setShowAchievementsOverlay } = useAchievements();
  const [hoveredAchievement, setHoveredAchievement] = useState(null);
  
  // Calculate the total and completed achievements
  const totalAchievements = Object.keys(achievements).length;
  const completedAchievements = Object.values(achievements).filter(a => a.completed);
  const completedCount = completedAchievements.length;
  const overallProgress = totalAchievements > 0 ? Math.round((completedCount / totalAchievements) * 100) : 0;
  
  // Get the most recent achievements (limit to 3)
  const recentAchievements = [...completedAchievements]
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 3);
  
  // Check if there are any achievements (meaning user is logged in)
  const hasAchievements = totalAchievements > 0;
  
  if (!hasAchievements) return null;
  
  return (
    <motion.div
      className="bg-surface-elevated rounded-lg border border-border shadow-md p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <FaTrophy className="text-primary mr-2" /> Your Achievements
        </h3>
        <button
          onClick={() => setShowAchievementsOverlay(true)}
          className="text-sm text-primary hover:text-primary-dark flex items-center"
        >
          View All <FaArrowRight className="ml-1" size={12} />
        </button>
      </div>
      
      {/* Progress Summary */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-medium">{completedCount} of {totalAchievements}</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2.5 shadow-inner overflow-hidden">
          <motion.div 
            className="bg-primary h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
      
      {/* Recent Achievements */}
      {recentAchievements.length > 0 ? (
        <div>
          <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
          <div className="space-y-2">
            {recentAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                className={`p-2 rounded-md border border-${achievement.color}-light bg-${achievement.color}-light/20 flex items-center`}
                onMouseEnter={() => setHoveredAchievement(achievement.id)}
                onMouseLeave={() => setHoveredAchievement(null)}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-8 h-8 rounded-full bg-${achievement.color} text-white flex items-center justify-center mr-3 flex-shrink-0`}>
                  <span>{achievement.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm truncate">{achievement.title}</h5>
                  {hoveredAchievement === achievement.id ? (
                    <p className="text-xs text-muted truncate">{achievement.description}</p>
                  ) : (
                    <p className="text-xs text-muted truncate">
                      Completed: {new Date(achievement.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-muted">
          <p className="text-sm">Complete achievements to see them here!</p>
        </div>
      )}
    </motion.div>
  );
}
