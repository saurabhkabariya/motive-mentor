"use client";
import { useState, useEffect } from "react";
import { useTheme } from "../themecontext";
import { useUser } from "../usercontext";
import { useAchievements } from "../achievementContext";
import { FaTrophy, FaFire, FaPlus, FaTrash, FaEdit, FaCheck, FaClock, FaMedal, FaCog, FaSave, FaTimes } from "react-icons/fa";
import AchievementsSection from "@/components/AchievementsSection";
import GoalStatistics from "@/components/GoalStatistics";
import MotivationalQuote from "@/components/MotivationalQuote";
import GoalNotifications from "@/components/GoalNotifications";
import NotificationSettings from "@/components/NotificationSettings";
import AchievementProgress from "@/components/AchievementProgress";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function GoalTracker() {
  const { darkMode } = useTheme();
  const { user, loading: userLoading } = useUser();
  const { updateAchievementProgress, setShowAchievementsOverlay } = useAchievements();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: "", description: "", deadline: "", tasks: [] });
  const [newTask, setNewTask] = useState("");
  const [editGoalId, setEditGoalId] = useState(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0, lastCheckIn: null });
  const [userData, setUserData] = useState({
    totalTasksCompleted: 0,
    goalsCompleted: 0
  });  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [editGoalData, setEditGoalData] = useState({ title: "", description: "", deadline: "", tasks: [] });
  const [editTaskInput, setEditTaskInput] = useState("");
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [showBackupMenu, setShowBackupMenu] = useState(false);  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchGoals(user.uid);
      fetchStreakData(user.uid);
    }
  }, [user]);

  // Handle click outside to close backup menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showBackupMenu && !event.target.closest('.backup-menu-container')) {
        setShowBackupMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBackupMenu]);

  // Fetch goals from localStorage
  const fetchGoals = (userId) => {
    try {
      const localGoals = localStorage.getItem(`goals_${userId}`);
      if (localGoals) {
        const parsedGoals = JSON.parse(localGoals);
        setGoals(parsedGoals);
        
        // Calculate user statistics from local data
        let totalTasksCompleted = 0;
        let goalsCompleted = 0;
        
        parsedGoals.forEach(goal => {
          if (goal.completed) goalsCompleted++;
          if (goal.tasks) {
            totalTasksCompleted += goal.tasks.filter(task => task.completed).length;
          }
        });
        
        setUserData({
          totalTasksCompleted,
          goalsCompleted
        });
        
        // Save statistics to localStorage
        updateUserStats(userId, totalTasksCompleted, goalsCompleted);
      } else {
        // Initialize with empty array if no goals found
        setGoals([]);
        setUserData({
          totalTasksCompleted: 0,
          goalsCompleted: 0
        });
        localStorage.setItem(`goals_${userId}`, JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error reading goals from localStorage:", error);
      setGoals([]);
    }
  };
  
  // Helper to update user stats
  const updateUserStats = (userId, totalTasksCompleted, goalsCompleted) => {
    try {
      const stats = {
        totalTasksCompleted,
        goalsCompleted,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(`user_stats_${userId}`, JSON.stringify(stats));
    } catch (error) {
      console.error("Error saving user stats to localStorage:", error);
    }
  };
  // Fetch streak data from localStorage
  const fetchStreakData = (userId) => {
    try {
      const localStreakData = localStorage.getItem(`streak_${userId}`);
      if (localStreakData) {
        const parsedStreakData = JSON.parse(localStreakData);
        // Convert date string back to Date object if it exists
        if (parsedStreakData.lastCheckIn) {
          parsedStreakData.lastCheckIn = new Date(parsedStreakData.lastCheckIn);
        }
        setStreakData(parsedStreakData);
      } else {
        // No streak data yet, initialize with zeros
        const initialStreakData = {
          currentStreak: 0,
          longestStreak: 0,
          lastCheckIn: null
        };
        
        setStreakData(initialStreakData);
        localStorage.setItem(`streak_${userId}`, JSON.stringify(initialStreakData));
      }
    } catch (error) {
      console.error("Error reading streak data from localStorage:", error);
      // Initialize with default values on error
      const initialStreakData = {
        currentStreak: 0,
        longestStreak: 0,
        lastCheckIn: null
      };
      
      setStreakData(initialStreakData);
      localStorage.setItem(`streak_${userId}`, JSON.stringify(initialStreakData));
    }
  };
  // Helper functions for CRUD operations

  // Add a new goal
  const addGoal = (userId, goal) => {
    try {
      // Generate a unique ID for the goal
      const goalId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newGoalWithId = {
        ...goal,
        id: goalId,
        createdAt: new Date().toISOString(),
        completed: false
      };
      
      // Add to state
      const updatedGoals = [...goals, newGoalWithId];
      setGoals(updatedGoals);
      
      // Save to localStorage
      localStorage.setItem(`goals_${userId}`, JSON.stringify(updatedGoals));
      
      return goalId;
    } catch (error) {      console.error("Error adding goal to localStorage:", error);
      return null;
    }
  };

  // Update an existing goal
  const updateGoal = (userId, goalId, updatedGoalData) => {
    try {
      // Check if we're marking the goal as completed
      const goalToUpdate = goals.find(goal => goal.id === goalId);
      const isNewlyCompleted = !goalToUpdate.completed && updatedGoalData.completed;
      
      // Add completion date if the goal is being marked as completed
      const finalGoalData = {
        ...updatedGoalData,
        completedAt: isNewlyCompleted ? new Date().toISOString() : updatedGoalData.completedAt || null
      };
      
      // Update in state
      const updatedGoals = goals.map(goal => 
        goal.id === goalId ? { ...goal, ...finalGoalData } : goal
      );
      
      setGoals(updatedGoals);
      
      // Save to localStorage      localStorage.setItem(`goals_${userId}`, JSON.stringify(updatedGoals));
        // Update achievement progress if a goal is newly completed
      if (isNewlyCompleted && user) {
        try {
          updateAchievementProgress('goal_streak_3');
          updateAchievementProgress('goal_streak_7');
          updateAchievementProgress('goal_streak_30');
        } catch (error) {
          console.error("Error updating achievements:", error);
        }
      }
      
      // Recalculate statistics
      let totalTasksCompleted = 0;
      let goalsCompleted = 0;
      
      updatedGoals.forEach(goal => {
        if (goal.completed) goalsCompleted++;
        if (goal.tasks) {
          totalTasksCompleted += goal.tasks.filter(task => task.completed).length;
        }
      });
      
      // Update user data
      setUserData({
        totalTasksCompleted,
        goalsCompleted
      });
      
      // Update statistics in localStorage
      updateUserStats(userId, totalTasksCompleted, goalsCompleted);
      
      return true;
    } catch (error) {
      console.error("Error updating goal in localStorage:", error);
      return false;
    }
  };
  
  // Delete a goal
  const deleteGoal = (userId, goalId) => {
    try {
      // Remove from state
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      
      // Save to localStorage
      localStorage.setItem(`goals_${userId}`, JSON.stringify(updatedGoals));
      
      // Recalculate statistics
      let totalTasksCompleted = 0;
      let goalsCompleted = 0;
      
      updatedGoals.forEach(goal => {
        if (goal.completed) goalsCompleted++;
        if (goal.tasks) {
          totalTasksCompleted += goal.tasks.filter(task => task.completed).length;
        }
      });
      
      // Update user data
      setUserData({
        totalTasksCompleted,
        goalsCompleted
      });
      
      // Update statistics in localStorage
      updateUserStats(userId, totalTasksCompleted, goalsCompleted);
      
      return true;
    } catch (error) {
      console.error("Error deleting goal from localStorage:", error);
      return false;
    }
  };
  
  // Update streak data
  const updateStreakData = (userId, newStreakData) => {
    try {
      setStreakData(newStreakData);
      
      // Convert Date to string for storage
      const storageStreakData = {
        ...newStreakData,
        lastCheckIn: newStreakData.lastCheckIn ? newStreakData.lastCheckIn.toISOString() : null
      };
      
      // Save to localStorage
      localStorage.setItem(`streak_${userId}`, JSON.stringify(storageStreakData));
      
      return true;
    } catch (error) {
      console.error("Error updating streak data in localStorage:", error);
      return false;
    }
  };

  // Export goals to JSON file
  const exportGoals = () => {
    try {
      if (!user || goals.length === 0) return;
      
      const dataToExport = {
        goals,
        streakData: {
          ...streakData,
          lastCheckIn: streakData.lastCheckIn ? streakData.lastCheckIn.toISOString() : null
        },
        userData,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `goal-tracker-backup-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (error) {
      console.error("Error exporting goals:", error);
      return false;
    }
  };
  
  // Import goals from JSON file
  const importGoals = (event) => {
    try {
      const file = event.target.files[0];
      if (!file || !user) return;
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Validate data structure
          if (!importedData.goals || !Array.isArray(importedData.goals)) {
            alert("Invalid backup file format");
            return;
          }
          
          // Confirm before importing
          if (goals.length > 0) {
            if (!window.confirm("This will replace your current goals. Continue?")) {
              return;
            }
          }
          
          // Import goals
          setGoals(importedData.goals);
          localStorage.setItem(`goals_${user.uid}`, JSON.stringify(importedData.goals));
          
          // Import streak data if available
          if (importedData.streakData) {
            const newStreakData = {
              ...importedData.streakData,
              lastCheckIn: importedData.streakData.lastCheckIn ? new Date(importedData.streakData.lastCheckIn) : null
            };
            
            setStreakData(newStreakData);
            localStorage.setItem(`streak_${user.uid}`, JSON.stringify({
              ...newStreakData,
              lastCheckIn: newStreakData.lastCheckIn ? newStreakData.lastCheckIn.toISOString() : null
            }));
          }
          
          // Import user data if available
          if (importedData.userData) {
            setUserData(importedData.userData);
            updateUserStats(
              user.uid, 
              importedData.userData.totalTasksCompleted, 
              importedData.userData.goalsCompleted
            );
          }
          
          alert("Goals imported successfully!");
          
        } catch (error) {
          console.error("Error parsing imported file:", error);
          alert("Error importing goals: Invalid file format");
        }
      };
      
      reader.readAsText(file);
      
      // Reset the file input
      event.target.value = null;
      
    } catch (error) {
      console.error("Error importing goals:", error);
      alert("Error importing goals");
    }
  };

  // Calculate localStorage usage
  const calculateStorageUsage = () => {
    try {
      let totalSize = 0;
      let goalSize = 0;
      
      // Calculate total localStorage size
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += (localStorage[key].length + key.length) * 2; // Unicode uses 2 bytes per character
        }
      }
      
      // Calculate size used by goals
      if (user) {
        const goalsData = localStorage.getItem(`goals_${user.uid}`);
        if (goalsData) {
          goalSize = goalsData.length * 2;
        }
      }
      
      // Convert to KB with 2 decimal places
      const totalSizeKB = (totalSize / 1024).toFixed(2);
      const goalSizeKB = (goalSize / 1024).toFixed(2);
      
      return {
        totalSizeKB,
        goalSizeKB,
        percentUsed: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2) // 5MB is typical localStorage limit
      };
    } catch (error) {
      console.error("Error calculating storage usage:", error);
      return {
        totalSizeKB: "N/A",
        goalSizeKB: "N/A",
        percentUsed: "N/A"
      };
    }
  };
  
  // Clear old completed goals
  const clearOldCompletedGoals = (days = 30) => {
    try {
      if (!user || goals.length === 0) return false;
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const updatedGoals = goals.filter(goal => {
        // Keep all active goals
        if (!goal.completed) return true;
        
        // For completed goals, check completion date
        const completedDate = goal.completedAt ? new Date(goal.completedAt) : null;
        
        // If no completion date or it's newer than cutoff, keep it
        if (!completedDate || completedDate > cutoffDate) return true;
        
        // Otherwise, remove it
        return false;
      });
      
      if (updatedGoals.length < goals.length) {
        setGoals(updatedGoals);
        localStorage.setItem(`goals_${user.uid}`, JSON.stringify(updatedGoals));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error clearing old completed goals:", error);
      return false;
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  // Render content based on authentication
  return (
    <ProtectedRoute
      redirectTo="/"
      showAuthModal={true}
      fallback={
        <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-3xl font-bold mb-6">Goal Tracker</h1>
            <p className="mb-8">Please sign in to use the Goal Tracker feature.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You can sign in using the button in the navigation bar above.
            </p>
          </div>
        </div>
      }    >
      <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
        <div className="max-w-4xl mx-auto">
          {/* Achievement Progress for Goals */}
          <div className="mb-6">
            <AchievementProgress 
              category="goals" 
              className="mb-4"
            />
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Goal Tracker</h1>
            <div className="flex items-center">              <div className="relative mr-2 backup-menu-container">
                <button
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center"
                  aria-label="Backup and Restore"
                  onClick={() => setShowBackupMenu(!showBackupMenu)}
                >
                  <FaSave className="text-xl" />
                </button>
                <div className={`absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 ${showBackupMenu ? 'block' : 'hidden'}`}>
                  <div className="p-2">
                    <button
                      onClick={exportGoals}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center"
                    >
                      <span className="mr-2">📤</span> Export Goals
                    </button>
                    <label className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center cursor-pointer">
                      <span className="mr-2">📥</span> Import Goals
                      <input
                        type="file"
                        accept=".json"
                        onChange={importGoals}
                        className="hidden"
                      />
                    </label>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => {
                        const result = clearOldCompletedGoals(30);
                        if (result) {
                          alert("Old completed goals cleared successfully!");
                        } else {
                          alert("No old completed goals to clear.");
                        }
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center"
                    >
                      <span className="mr-2">🧹</span> Clear Old Goals
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                      {(() => {
                        const usage = calculateStorageUsage();
                        return (
                          <>
                            <div>Storage Used: {usage.totalSizeKB} KB ({usage.percentUsed}%)</div>
                            <div>Goals Data: {usage.goalSizeKB} KB</div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                className="relative p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Notification Settings"
              >
                <FaCog className="text-xl" />
              </button>
              {user && (
                <GoalNotifications 
                  userId={user.uid}
                  goals={goals}
                  streakData={streakData}
                  darkMode={darkMode}
                  onDismissAll={() => user && fetchGoals(user.uid)}
                />
              )}
            </div>
          </div>{/* Notification Settings */}
          {showNotificationSettings && user && (
            <div className="mb-6">
              <NotificationSettings 
                userId={user.uid}
                darkMode={darkMode}
                onClose={() => setShowNotificationSettings(false)}
              />
            </div>
          )}
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Streak Card */}
            <div className={`col-span-1 p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your Streak</h2>
                <FaFire className="text-orange-500 text-2xl" />
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 text-orange-500">{streakData.currentStreak}</div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">days in a row</p>
                <div className="text-sm">
                  <p>Longest Streak: <span className="font-medium">{streakData.longestStreak} days</span></p>
                  <p className="mt-1">Last Check-in: <span className="font-medium">{streakData.lastCheckIn ? new Date(streakData.lastCheckIn).toLocaleDateString() : 'Never'}</span></p>
                </div>
                {user && (
                  <button 
                    onClick={() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      const lastCheckIn = streakData.lastCheckIn ? new Date(streakData.lastCheckIn) : null;
                      lastCheckIn?.setHours(0, 0, 0, 0);
                      
                      // Check if last check-in was yesterday
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      yesterday.setHours(0, 0, 0, 0);
                      
                      let newStreak = streakData.currentStreak;
                      
                      // If never checked in or streak broken
                      if (!lastCheckIn || (lastCheckIn < yesterday)) {
                        newStreak = 1;
                      } 
                      // If last check-in was yesterday, increment streak
                      else if (lastCheckIn.getTime() === yesterday.getTime()) {
                        newStreak += 1;
                      }
                      // If already checked in today, don't change streak
                      else if (lastCheckIn.getTime() === today.getTime()) {
                        // Do nothing
                      }
                      
                      const newStreakData = {
                        currentStreak: newStreak,
                        longestStreak: Math.max(newStreak, streakData.longestStreak),
                        lastCheckIn: today
                      };
                      
                      updateStreakData(user.uid, newStreakData);
                    }}
                    className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition"
                    disabled={streakData.lastCheckIn && new Date(streakData.lastCheckIn).toDateString() === new Date().toDateString()}
                  >
                    {streakData.lastCheckIn && new Date(streakData.lastCheckIn).toDateString() === new Date().toDateString() 
                      ? 'Already Checked In Today' 
                      : 'Check In Today'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Statistics Card */}
            <div className={`col-span-1 lg:col-span-2 p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your Progress</h2>
                <FaCheck className="text-green-500 text-2xl" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{goals.length}</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Goals</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{goals.filter(g => !g.completed).length}</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Active Goals</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{userData.goalsCompleted}</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Completed Goals</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{userData.totalTasksCompleted}</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Tasks Completed</p>
                </div>
              </div>
              {goals.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Progress Overview</h3>
                  <div className="space-y-2">
                    {goals.filter(g => !g.completed).slice(0, 3).map(goal => {
                      const tasksCompleted = goal.tasks ? goal.tasks.filter(t => t.completed).length : 0;
                      const totalTasks = goal.tasks ? goal.tasks.length : 0;
                      const progress = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
                      
                      return (
                        <div key={goal.id} className="w-full">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{goal.title}</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
            {/* Tab Navigation */}
          <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "active"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active Goals
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "completed"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed Goals
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "achievements"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("achievements")}
            >
              Achievements            </button>
          </div>
          
          {/* Add Goal Button */}
          {activeTab !== "achievements" && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setShowAddGoal(true)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                <FaPlus className="mr-2" /> Add New Goal
              </button>
            </div>
          )}
          
          {/* Add Goal Form */}
          {showAddGoal && (
            <div className={`mb-6 p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Goal</h3>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter goal title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter goal description"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white custom-date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tasks</label>
                  <div className="flex mb-2 gap-3">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="Add a task"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTask.trim()) {
                          setNewGoal({
                            ...newGoal,
                            tasks: [
                              ...newGoal.tasks,
                              { id: Date.now().toString(), title: newTask, completed: false }
                            ]
                          });
                          setNewTask('');
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (newTask.trim()) {
                          setNewGoal({
                            ...newGoal,
                            tasks: [
                              ...newGoal.tasks,
                              { id: Date.now().toString(), title: newTask, completed: false }
                            ]
                          });
                          setNewTask('');
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  {newGoal.tasks.length > 0 && (
                    <ul className="mt-2 border border-gray-300 dark:border-gray-700 rounded-md divide-y divide-gray-300 dark:divide-gray-700">
                      {newGoal.tasks.map((task, index) => (
                        <li key={task.id} className="flex items-center justify-between p-2">
                          <span>{task.title}</span>
                          <button
                            onClick={() => {
                              const updatedTasks = [...newGoal.tasks];
                              updatedTasks.splice(index, 1);
                              setNewGoal({...newGoal, tasks: updatedTasks});
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowAddGoal(false);
                      setNewGoal({ title: "", description: "", deadline: "", tasks: [] });
                      setNewTask("");
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newGoal.title.trim()) {
                        addGoal(user.uid, newGoal);
                        setShowAddGoal(false);
                        setNewGoal({ title: "", description: "", deadline: "", tasks: [] });
                        setNewTask("");
                      }
                    }}
                    disabled={!newGoal.title.trim()}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${!newGoal.title.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Save Goal
                  </button>
                </div>              </div>
            </div>
          )}
          
          {/* Edit Goal Form */}
          {showEditGoal && (
            <div className={`mb-6 p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Goal</h3>
                <button
                  onClick={() => setShowEditGoal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={editGoalData.title}
                    onChange={(e) => setEditGoalData({...editGoalData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter goal title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editGoalData.description}
                    onChange={(e) => setEditGoalData({...editGoalData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter goal description"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={editGoalData.deadline}
                    onChange={(e) => setEditGoalData({...editGoalData, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white custom-date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tasks</label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={editTaskInput}
                      onChange={(e) => setEditTaskInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="Add a task"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && editTaskInput.trim()) {
                          setEditGoalData({
                            ...editGoalData,
                            tasks: [
                              ...editGoalData.tasks,
                              { id: Date.now().toString(), title: editTaskInput, completed: false }
                            ]
                          });
                          setEditTaskInput('');
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (editTaskInput.trim()) {
                          setEditGoalData({
                            ...editGoalData,
                            tasks: [
                              ...editGoalData.tasks,
                              { id: Date.now().toString(), title: editTaskInput, completed: false }
                            ]
                          });
                          setEditTaskInput('');
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  {editGoalData.tasks.length > 0 && (
                    <ul className="mt-2 border border-gray-300 dark:border-gray-700 rounded-md divide-y divide-gray-300 dark:divide-gray-700">
                      {editGoalData.tasks.map((task, index) => (
                        <li key={task.id} className="flex items-center justify-between p-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => {
                                const updatedTasks = [...editGoalData.tasks];
                                updatedTasks[index].completed = !task.completed;
                                setEditGoalData({...editGoalData, tasks: updatedTasks});
                              }}
                              className="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className={task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}>
                              {task.title}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const updatedTasks = [...editGoalData.tasks];
                              updatedTasks.splice(index, 1);
                              setEditGoalData({...editGoalData, tasks: updatedTasks});
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowEditGoal(false);
                      setEditGoalData({ title: "", description: "", deadline: "", tasks: [] });
                      setEditTaskInput("");
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (editGoalData.title.trim()) {
                        updateGoal(user.uid, editGoalId, editGoalData);
                        setShowEditGoal(false);
                        setEditGoalData({ title: "", description: "", deadline: "", tasks: [] });
                        setEditTaskInput("");
                        setEditGoalId(null);
                      }
                    }}
                    disabled={!editGoalData.title.trim()}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${!editGoalData.title.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Update Goal
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Goals List */}
          {activeTab === "active" && (
            <div className="space-y-4">
              {goals.filter(goal => !goal.completed).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">You don't have any active goals yet.</p>
                  <button
                    onClick={() => setShowAddGoal(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Create Your First Goal
                  </button>
                </div>
              ) : (
                goals
                  .filter(goal => !goal.completed)
                  .map(goal => {
                    const tasksCompleted = goal.tasks ? goal.tasks.filter(t => t.completed).length : 0;
                    const totalTasks = goal.tasks ? goal.tasks.length : 0;
                    const progress = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
                    
                    const isOverdue = goal.deadline 
                      ? new Date(goal.deadline) < new Date() 
                      : false;
                    
                    return (
                      <div 
                        key={goal.id} 
                        className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} ${
                          isOverdue ? "border-l-4 border-red-500" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{goal.title}</h3>
                            {goal.description && (
                              <p className="text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditGoalId(goal.id);
                                setEditGoalData({ title: goal.title, description: goal.description, deadline: goal.deadline, tasks: goal.tasks });
                                setShowEditGoal(true);
                              }}
                              className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => {
                                if(window.confirm('Are you sure you want to delete this goal?')) {
                                  deleteGoal(user.uid, goal.id);
                                }
                              }}
                              className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        
                        {goal.deadline && (
                          <div className="flex items-center mb-4 text-sm">
                            <FaClock className={`mr-2 ${isOverdue ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`} />
                            <span className={isOverdue ? "text-red-500" : "text-gray-500 dark:text-gray-400"}>
                              {isOverdue ? "Overdue: " : "Deadline: "}
                              {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                progress < 30 ? "bg-red-500" : 
                                progress < 70 ? "bg-yellow-500" : 
                                "bg-green-500"
                              }`} 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {goal.tasks && goal.tasks.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Tasks</h4>
                            <ul className="space-y-2">
                              {goal.tasks.map(task => (
                                <li key={task.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => {
                                      const updatedGoal = {...goal};
                                      const taskIndex = updatedGoal.tasks.findIndex(t => t.id === task.id);
                                      updatedGoal.tasks[taskIndex].completed = !task.completed;
                                      updateGoal(user.uid, goal.id, updatedGoal);
                                    }}
                                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className={`ml-3 ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
                                    {task.title}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {totalTasks > 0 && tasksCompleted === totalTasks && (
                          <div className="mt-4 text-right">
                            <button
                              onClick={() => updateGoal(user.uid, goal.id, {...goal, completed: true})}
                              className="text-sm px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                              Mark Goal Complete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          )}
          
          {/* Completed Goals */}
          {activeTab === "completed" && (
            <div className="space-y-4">
              {goals.filter(goal => goal.completed).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">You haven't completed any goals yet.</p>
                </div>
              ) : (
                goals
                  .filter(goal => goal.completed)
                  .map(goal => (
                    <div 
                      key={goal.id} 
                      className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} border-l-4 border-green-500`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{goal.title}</h3>
                          {goal.description && (
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => updateGoal(user.uid, goal.id, {...goal, completed: false})}
                          className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Reactivate
                        </button>
                      </div>
                      {goal.tasks && goal.tasks.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Tasks</h4>
                          <ul className="space-y-1">
                            {goal.tasks.map(task => (
                              <li key={task.id} className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                <span className="line-through text-gray-500 dark:text-gray-400">
                                  {task.title}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          )}
            {/* Achievements */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <AchievementProgress 
                category="goals" 
                className="mb-4"
                showTitle={false}
              />
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowAchievementsOverlay(true)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                >
                  View All Achievements
                </button>
              </div>
            </div>
          )}
          
          {/* Ad Banner at bottom of goals page */}        </div>
      </div>
    </ProtectedRoute>
  );
}
