"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrophy, FaMedal, FaStar, FaLock, FaCheck } from 'react-icons/fa';
import { useAchievements, ACHIEVEMENTS } from '@/app/achievementContext';

export default function AchievementsOverlay() {
  const { 
    achievements, 
    showAchievementsOverlay, 
    setShowAchievementsOverlay 
  } = useAchievements();
  
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Group achievements by category
  const categories = {
    all: { label: 'All Achievements', icon: <FaTrophy /> },
    goals: { label: 'Goal Streaks', icon: <FaStar /> },
    wordgame: { label: 'Word Game', icon: <FaMedal /> },
    forum: { label: 'Forum Activity', icon: <FaCheck /> },
    quotes: { label: 'Quote Collection', icon: <FaStar /> },
  };
  
  // Filter achievements based on active category
  const filteredAchievements = Object.values(achievements).filter(achievement => 
    activeCategory === 'all' || achievement.category === activeCategory
  );
  
  // Calculate overall progress
  const totalAchievements = Object.keys(ACHIEVEMENTS).length;
  const completedAchievements = Object.values(achievements).filter(a => a.completed).length;
  const overallProgress = Math.round((completedAchievements / totalAchievements) * 100);
  
  // Calculate level based on completed achievements
  const calculateLevel = () => {
    if (completedAchievements >= 10) return { level: 5, title: 'Achievement Master' };
    if (completedAchievements >= 7) return { level: 4, title: 'Achievement Hunter' };
    if (completedAchievements >= 5) return { level: 3, title: 'Rising Star' };
    if (completedAchievements >= 3) return { level: 2, title: 'Beginner Plus' };
    return { level: 1, title: 'Beginner' };
  };
  
  const { level, title } = calculateLevel();

  if (!showAchievementsOverlay) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowAchievementsOverlay(false)}
      >
        <motion.div
          className="bg-surface rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex justify-between items-center bg-surface-elevated">
            <h2 className="text-2xl font-bold flex items-center">
              <FaTrophy className="text-primary mr-2" /> Your Achievements
            </h2>
            <button 
              onClick={() => setShowAchievementsOverlay(false)}
              className="text-muted hover:text-foreground"
              aria-label="Close achievements"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          {/* Achievement Overview */}
          <div className="p-6 bg-gradient-to-r from-primary-light to-secondary-light border-b border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Level Badge */}
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-surface-elevated flex items-center justify-center text-primary border-4 border-primary">
                    <span className="text-3xl font-bold">{level}</span>
                  </div>
                  <motion.div 
                    className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FaTrophy />
                  </motion.div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-sm text-muted">{completedAchievements} of {totalAchievements} achievements completed</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="flex-1 w-full md:w-auto">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{overallProgress}%</span>
                </div>
                <div className="w-full bg-surface rounded-full h-4 shadow-inner overflow-hidden">
                  <motion.div 
                    className="bg-primary h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted">
                  <span>Beginner</span>
                  <span>Master</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="px-6 pt-4 border-b border-border flex overflow-x-auto scrollbar-hide">
            {Object.entries(categories).map(([key, { label, icon }]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 rounded-t-lg flex items-center mr-2 whitespace-nowrap transition-colors ${
                  activeCategory === key 
                    ? 'bg-primary text-white font-medium' 
                    : 'bg-surface-elevated hover:bg-primary-light'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </div>
          
          {/* Achievements Grid */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 260px)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
              
              {filteredAchievements.length === 0 && (
                <div className="col-span-2 text-center py-8 text-muted">
                  <FaTrophy className="mx-auto text-4xl mb-2 opacity-30" />
                  <p>No achievements in this category yet. Keep going!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AchievementCard({ achievement }) {
  const progress = Math.min(achievement.progress, achievement.maxProgress);
  const progressPercentage = Math.round((progress / achievement.maxProgress) * 100);

  return (
    <div className={`bg-surface-elevated rounded-lg p-4 border ${
      achievement.completed 
        ? `border-${achievement.color}` 
        : 'border-border'
    }`}>
      <div className="flex items-start">
        {/* Achievement Icon */}
        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${
          achievement.completed 
            ? `bg-${achievement.color} text-white` 
            : 'bg-surface text-muted'
        } mr-4 relative`}>
          <span className="text-xl">{achievement.icon}</span>
          
          {achievement.completed && (
            <motion.div 
              className="absolute -top-1 -right-1 bg-success text-white rounded-full w-5 h-5 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <FaCheck size={10} />
            </motion.div>
          )}
        </div>
        
        {/* Achievement Details */}
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-bold text-base">
              {achievement.title}
            </h3>
            {!achievement.completed && achievement.progress === 0 && (
              <FaLock className="text-muted ml-2" size={12} />
            )}
          </div>
          <p className="text-sm text-muted">{achievement.description}</p>
          
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">{progress} / {achievement.maxProgress}</span>
              <span className="text-xs font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2.5 shadow-inner overflow-hidden">
              <motion.div 
                className={`bg-${achievement.color} h-full rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
          
          {/* Reward */}
          <div className="mt-2 text-xs">
            <span className="text-muted">Reward: </span>
            <span className={achievement.completed ? `text-${achievement.color} font-medium` : ''}>
              {achievement.reward}
            </span>
          </div>
          
          {/* Completion Date */}
          {achievement.completed && achievement.completedAt && (
            <div className="mt-1 text-xs text-muted">
              Completed: {new Date(achievement.completedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
