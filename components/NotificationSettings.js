"use client";
import { useState, useEffect } from "react";
import { FaCog, FaTimes, FaBell, FaCalendarAlt, FaExclamationTriangle, FaFire } from "react-icons/fa";
import { requestNotificationPermission } from "@/app/utils/notifications";

export default function NotificationSettings({ userId, darkMode, onClose }) {
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    browser: true,
    deadline: true,
    streak: true,
    progress: true,
    overdue: true
  });
    useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    // Check notification permission
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
    
    // Fetch user notification settings
    const fetchSettings = () => {
      setLoading(true);
      
      try {
        // Get from localStorage
        const localSettings = localStorage.getItem(`notification_settings_${userId}`);
        
        if (localSettings) {
          const parsedSettings = JSON.parse(localSettings);
          setSettings(parsedSettings);
        } else {
          // Save default settings to localStorage
          localStorage.setItem(`notification_settings_${userId}`, JSON.stringify(settings));
        }
      } catch (e) {
        console.error("Error parsing localStorage settings:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [userId]);
  // Update specific setting
  const handleToggleSetting = (setting) => {
    try {
      // Update state first to keep UI responsive
      const updatedSettings = {
        ...settings,
        [setting]: !settings[setting]
      };
      
      setSettings(updatedSettings);
      
      // Save to localStorage
      localStorage.setItem(`notification_settings_${userId}`, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Error updating notification setting:", error);
    }
  };

  const handleRequestPermission = () => {
    requestNotificationPermission();
    setPermissionStatus(Notification.permission);
  };

  if (loading) {
    return (
      <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="animate-pulse h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="animate-pulse h-10 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        <div className="animate-pulse h-10 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        <div className="animate-pulse h-10 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notification Settings</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes />
        </button>
      </div>
      
      {permissionStatus !== "granted" && (
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-lg">
          <p className="font-medium">Browser notifications are not enabled</p>
          <p className="text-sm mt-1">Enable notifications to receive updates about your goals even when you&apos;re not on the site.</p>
          <button 
            onClick={handleRequestPermission}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Enable Browser Notifications
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaBell className="text-blue-500 mr-3" />
            <div>
              <p className="font-medium">Browser Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications in your browser</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.browser}
              onChange={() => handleToggleSetting('browser')}
              disabled={permissionStatus !== "granted"}
            />
            <div className={`w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${permissionStatus !== "granted" ? "opacity-50" : ""}`}></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaCalendarAlt className="text-yellow-500 mr-3" />
            <div>
              <p className="font-medium">Deadline Reminders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Notify when goals are approaching their deadline</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.deadline}
              onChange={() => handleToggleSetting('deadline')}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaFire className="text-orange-500 mr-3" />
            <div>
              <p className="font-medium">Streak Reminders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Notify to maintain your daily streak</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.streak}
              onChange={() => handleToggleSetting('streak')}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-orange-500 mr-3" />
            <div>
              <p className="font-medium">Progress Warnings</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Notify when goal progress is falling behind</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.progress}
              onChange={() => handleToggleSetting('progress')}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3" />
            <div>
              <p className="font-medium">Overdue Alerts</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Notify when goals are past their deadline</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.overdue}
              onChange={() => handleToggleSetting('overdue')}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
