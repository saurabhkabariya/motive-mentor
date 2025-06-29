"use client";
import { useState, useEffect } from "react";
import { FaTrophy, FaMedal, FaFire, FaStar, FaCheck, FaCalendarCheck } from "react-icons/fa";

const achievementsList = [
  {
    id: "streak-3",
    title: "Getting Started",
    description: "Maintain a 3-day streak",
    icon: <FaFire className="text-orange-400" />,
    requiredValue: 3,
    type: "streak"
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: <FaFire className="text-orange-500" />,
    requiredValue: 7,
    type: "streak"
  },
  {
    id: "streak-14",
    title: "Consistent Champion",
    description: "Maintain a 14-day streak",
    icon: <FaFire className="text-orange-600" />,
    requiredValue: 14,
    type: "streak"
  },
  {
    id: "streak-30",
    title: "Habit Master",
    description: "Maintain a 30-day streak",
    icon: <FaTrophy className="text-yellow-500" />,
    requiredValue: 30,
    type: "streak"
  },
  {
    id: "tasks-10",
    title: "Task Tackler",
    description: "Complete 10 tasks",
    icon: <FaCheck className="text-green-500" />,
    requiredValue: 10,
    type: "tasks"
  },
  {
    id: "tasks-50",
    title: "Productivity Pro",
    description: "Complete 50 tasks",
    icon: <FaCheck className="text-green-600" />,
    requiredValue: 50,
    type: "tasks"
  },
  {
    id: "goals-1",
    title: "First Milestone",
    description: "Complete your first goal",
    icon: <FaStar className="text-blue-500" />,
    requiredValue: 1,
    type: "goals"
  },
  {
    id: "goals-5",
    title: "Goal Crusher",
    description: "Complete 5 goals",
    icon: <FaMedal className="text-blue-600" />,
    requiredValue: 5,
    type: "goals"
  }
];

export default function AchievementsSection({ userData, darkMode }) {
  const [achievements, setAchievements] = useState([]);
  
  useEffect(() => {
    if (!userData) return;
    
    // Calculate which achievements the user has earned
    const { currentStreak, totalTasksCompleted = 0, goalsCompleted = 0 } = userData;
    
    const earnedAchievements = achievementsList.map(achievement => {
      let earned = false;
      
      switch (achievement.type) {
        case "streak":
          earned = currentStreak >= achievement.requiredValue;
          break;
        case "tasks":
          earned = totalTasksCompleted >= achievement.requiredValue;
          break;
        case "goals":
          earned = goalsCompleted >= achievement.requiredValue;
          break;
      }
      
      return {
        ...achievement,
        earned
      };
    });
    
    setAchievements(earnedAchievements);
  }, [userData]);

  if (!userData) return null;

  return (
    <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
      <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`p-4 rounded-lg text-center transition-all ${
              achievement.earned 
                ? darkMode ? 'bg-gray-700' : 'bg-blue-50' 
                : darkMode ? 'bg-gray-900 opacity-50' : 'bg-gray-100 opacity-50'
            } ${achievement.earned ? 'transform hover:scale-105' : ''}`}
          >
            <div className="text-3xl mb-2 flex justify-center">
              {achievement.earned ? achievement.icon : <div className="opacity-30">{achievement.icon}</div>}
            </div>
            <h3 className="font-medium mb-1">{achievement.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
            {!achievement.earned && (
              <div className="mt-2 text-xs">
                <span className="inline-block px-2 py-1 rounded-full text-gray-800 bg-gray-200 dark:bg-gray-500">
                  Locked
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complete more goals and maintain your streak to unlock all achievements!
        </p>
      </div>
    </div>
  );
}
