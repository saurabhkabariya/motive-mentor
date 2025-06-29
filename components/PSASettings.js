"use client";

import { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaRedo, FaInfoCircle } from 'react-icons/fa';

export default function PSASettings() {
  const [psaEnabled, setPSAEnabled] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [psaHistory, setPSAHistory] = useState({});
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const storedPSAEnabled = localStorage.getItem('psaEnabled');
    if (storedPSAEnabled !== null) {
      setPSAEnabled(storedPSAEnabled === 'true');
    }
    
    const storedOnboardingCompleted = localStorage.getItem('onboardingCompleted');
    setOnboardingCompleted(storedOnboardingCompleted === 'true');
    
    const storedPSAHistory = JSON.parse(localStorage.getItem('psaHistory') || '{}');
    setPSAHistory(storedPSAHistory);
  }, []);
  
  // Update localStorage when settings change
  useEffect(() => {
    localStorage.setItem('psaEnabled', psaEnabled.toString());
  }, [psaEnabled]);
  
  // Toggle PSA visibility
  const togglePSA = () => {
    setPSAEnabled(!psaEnabled);
  };
  
  // Reset onboarding
  const resetOnboarding = () => {
    localStorage.removeItem('onboardingCompleted');
    setOnboardingCompleted(false);
    alert('Onboarding has been reset. You will see the onboarding tour on your next visit or page refresh.');
  };
  
  // Reset all PSA history
  const resetPSAHistory = () => {
    localStorage.removeItem('psaHistory');
    setPSAHistory({});
    alert('PSA history has been reset. You will see PSAs again when visiting relevant pages.');
  };
  
  // Feature names for display
  const featureNames = {
    goals: 'Goal Tracking',
    wordgame: 'Word Game',
    forum: 'Community Forum',
    quotes: 'Saved Quotes'
  };
  
  return (
    <div className="p-6 bg-surface rounded-lg border border-border shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaInfoCircle className="text-primary" />
        PSA & Onboarding Settings
      </h2>
      
      {/* Main toggle */}
      <div className="mb-6 flex justify-between items-center p-3 bg-background rounded-md">
        <div>
          <h3 className="font-medium">Show Feature Announcements</h3>
          <p className="text-sm text-muted">Enable or disable all PSAs and feature announcements</p>
        </div>
        <button 
          onClick={togglePSA}
          className={`text-2xl ${psaEnabled ? 'text-primary' : 'text-muted'}`}
          aria-label={psaEnabled ? 'Disable PSAs' : 'Enable PSAs'}
        >
          {psaEnabled ? <FaToggleOn /> : <FaToggleOff />}
        </button>
      </div>
      
      {/* PSA History */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Feature Announcements You've Seen:</h3>
        <div className="bg-background rounded-md p-3">
          <ul className="space-y-2">
            {Object.keys(featureNames).map(feature => (
              <li key={feature} className="flex items-center justify-between text-sm">
                <span className={psaHistory[feature] ? 'text-foreground' : 'text-muted'}>
                  {featureNames[feature]}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  psaHistory[feature] 
                    ? 'bg-success-light text-success' 
                    : 'bg-warning-light text-warning'
                }`}>
                  {psaHistory[feature] ? 'Viewed' : 'Not Viewed'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Reset buttons */}
      <div className="space-y-3">
        <button 
          onClick={resetOnboarding}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
          disabled={!onboardingCompleted}
        >
          <FaRedo size={14} /> Reset Onboarding Tour
        </button>
        <button 
          onClick={resetPSAHistory}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
          disabled={Object.keys(psaHistory).length === 0}
        >
          <FaRedo size={14} /> Reset Feature Announcements
        </button>
      </div>
      
      <p className="mt-4 text-xs text-muted">
        Resetting these settings will allow you to see the onboarding tour and feature announcements again.
      </p>
    </div>
  );
}
