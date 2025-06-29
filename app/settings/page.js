"use client";

import { useState } from 'react';
import { FaCog, FaInfoCircle, FaBell } from 'react-icons/fa';
import PSASettings from '@/components/PSASettings';
import OnboardingButton from '@/components/OnboardingButton';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('psa');
  
  const tabs = [
    { id: 'psa', label: 'Feature Announcements', icon: <FaInfoCircle /> },
    // We can add more tabs in the future
  ];
  
  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FaCog className="text-primary" /> Settings
          </h1>
          <p className="text-muted">
            Manage your preferences and customize your experience
          </p>
        </header>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <nav className="bg-surface rounded-lg border border-border p-4">
              <ul className="space-y-2">
                {tabs.map(tab => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-primary-light text-primary font-medium' 
                          : 'hover:bg-background'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-primary-light rounded-md text-primary">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <FaBell /> Restart Onboarding
                </h3>
                <p className="text-sm mb-3">
                  Want to see the app tour again?
                </p>
                <OnboardingButton variant="text" className="w-full" />
              </div>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4">
            {activeTab === 'psa' && <PSASettings />}
            {/* Add more tab content here */}
          </div>
        </div>
      </div>
    </main>
  );
}
