"use client";
import { useState, useEffect } from "react";

export default function GoalStatistics({ goals, streakData, darkMode }) {
  const [stats, setStats] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    averageProgress: 0
  });

  useEffect(() => {
    if (!goals || goals.length === 0) return;

    const activeGoals = goals.filter(goal => !goal.completed);
    const completedGoals = goals.filter(goal => goal.completed);
    
    // Calculate total tasks and completed tasks
    let totalTasks = 0;
    let completedTasks = 0;
    let overdueTasks = 0;
    
    goals.forEach(goal => {
      if (goal.tasks) {
        totalTasks += goal.tasks.length;
        completedTasks += goal.tasks.filter(task => task.completed).length;
        
        // Check for overdue tasks
        if (goal.deadline) {
          const deadlineDate = new Date(goal.deadline);
          const today = new Date();
          
          if (deadlineDate < today) {
            const incompleteTasks = goal.tasks.filter(task => !task.completed);
            overdueTasks += incompleteTasks.length;
          }
        }
      }
    });
    
    // Calculate average progress for active goals
    const totalProgress = activeGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
    const averageProgress = activeGoals.length > 0 ? Math.round(totalProgress / activeGoals.length) : 0;
    
    setStats({
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      totalTasks,
      completedTasks,
      overdueTasks,
      averageProgress
    });
  }, [goals]);

  return (
    <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
      <h2 className="text-xl font-semibold mb-4">Your Goal Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-blue-500 text-white">
          <div className="text-2xl font-bold">{stats.totalGoals}</div>
          <div className="text-sm">Total Goals</div>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-green-500 text-white">
          <div className="text-2xl font-bold">{stats.completedGoals}</div>
          <div className="text-sm">Completed Goals</div>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-yellow-500 text-white">
          <div className="text-2xl font-bold">{stats.completedTasks}</div>
          <div className="text-sm">Tasks Done</div>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-purple-500 text-white">
          <div className="text-2xl font-bold">{streakData.currentStreak}</div>
          <div className="text-sm">Day Streak</div>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Average Progress Across All Goals */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Average Goal Progress</span>
            <span>{stats.averageProgress}%</span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full bg-blue-500"
              style={{ width: `${stats.averageProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Task Completion Rate */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Task Completion Rate</span>
            <span>{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full bg-green-500"
              style={{ 
                width: `${stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {stats.overdueTasks > 0 && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg text-sm">
          <div className="font-medium">Attention needed!</div>
          <div>You have {stats.overdueTasks} overdue {stats.overdueTasks === 1 ? 'task' : 'tasks'} that need attention.</div>
        </div>
      )}
    </div>
  );
}
