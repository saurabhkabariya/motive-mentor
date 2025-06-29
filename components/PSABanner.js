"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaTimes, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { useOnboarding } from '@/app/onboardingContext';

export default function PSABanner({ 
  feature, 
  showBackground = true,
  autoClose = true,
  autoCloseDelay = 7000
}) {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const { goToStep } = useOnboarding();
  
  // Find the step index for the specified feature
  const getStepIndex = (featureId) => {
    const stepMap = {
      'goals': 1,
      'wordgame': 2,
      'forum': 3,
      'quotes': 4
    };
    return stepMap[featureId] || 0;
  };
  
  // Auto-close the PSA after a delay
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay]);
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  const handleExplore = () => {
    // Route to feature page
    const routeMap = {
      'goals': '/goals',
      'wordgame': '/dailywordgame',
      'forum': '/chat',
      'quotes': '/saved-quotes'
    };
    
    if (routeMap[feature]) {
      router.push(routeMap[feature]);
    }
    handleClose();
  };
  
  const handleLearnMore = () => {
    // Start onboarding at relevant step
    goToStep(getStepIndex(feature));
    handleClose();
  };
  
  // PSA content based on feature
  const psaContent = {
    goals: {
      title: "Track Your Progress",
      description: "Setting and tracking goals increases your chances of success by 42%",
      icon: "🎯",
      color: "bg-success-light",
      textColor: "text-success"
    },
    wordgame: {
      title: "Word Games Benefit Your Brain",
      description: "Regular word games can improve vocabulary and cognitive function",
      icon: "🧠",
      color: "bg-warning-light",
      textColor: "text-warning"
    },
    forum: {
      title: "Community Support Matters",
      description: "People with strong social connections report higher happiness levels",
      icon: "🤝",
      color: "bg-secondary-light",
      textColor: "text-secondary"
    },
    quotes: {
      title: "Daily Inspiration Works",
      description: "Reading motivational quotes can improve your mood and productivity",
      icon: "💬",
      color: "bg-primary-light",
      textColor: "text-primary"
    }
  };
  
  const content = psaContent[feature] || {
    title: "Feature Highlight",
    description: "Discover more about this feature",
    icon: "✨",
    color: "bg-primary-light",
    textColor: "text-primary"
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`relative rounded-lg p-4 shadow-md mb-6 
            ${showBackground ? `${content.color} border border-${content.color}` : ''}`}
        >
          {/* Close button */}
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2 text-muted hover:text-foreground"
            aria-label="Close message"
          >
            <FaTimes size={16} />
          </button>
          
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 p-2 rounded-full ${content.color} ${content.textColor}`}>
              <span className="text-xl">{content.icon}</span>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 className={`font-medium mb-1 ${content.textColor}`}>
                <FaInfoCircle className="inline mr-1" size={14} /> 
                {content.title}
              </h3>
              <p className="text-sm text-foreground mb-3">{content.description}</p>
              
              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={handleExplore}
                  className="btn-sm bg-primary hover:bg-primary-dark text-white rounded px-3 py-1 text-xs font-medium"
                >
                  <FaCheckCircle className="inline mr-1" size={12} /> 
                  Try It Now
                </button>
                <button 
                  onClick={handleLearnMore}
                  className="btn-sm bg-transparent hover:bg-primary-light text-primary border border-primary rounded px-3 py-1 text-xs font-medium"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
