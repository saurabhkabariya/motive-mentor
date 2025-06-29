"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useOnboarding } from '@/app/onboardingContext';

// The features to showcase in the onboarding flow
const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Motive Mentor!',
    description: 'Your personal motivation companion for daily inspiration and growth.',
    icon: '✨',
    color: 'bg-primary-light',
    textColor: 'text-primary',
    previewPath: '/',
  },
  {
    id: 'goals',
    title: 'Track Your Goals',
    description: 'Set meaningful goals, track your progress, and build habits with our gamified system.',
    icon: '🎯',
    color: 'bg-success-light',
    textColor: 'text-success',
    previewPath: '/goals',
  },
  {
    id: 'wordgame',
    title: 'Daily Word Game',
    description: 'Challenge yourself with fun word puzzles that expand your vocabulary and sharpen your mind.',
    icon: '🧠',
    color: 'bg-warning-light',
    textColor: 'text-warning',
    previewPath: '/dailywordgame',
  },
  {
    id: 'forum',
    title: 'Join the Motivation Forum',
    description: 'Connect with a supportive community, share experiences, and grow together.',
    icon: '🤝',
    color: 'bg-secondary-light',
    textColor: 'text-secondary',
    previewPath: '/chat',
  },
  {
    id: 'quotes',
    title: 'Save Inspiring Quotes',
    description: 'Discover and save personalized quotes that resonate with you and revisit them anytime.',
    icon: '💬',
    color: 'bg-primary-light',
    textColor: 'text-primary',
    previewPath: '/saved-quotes',
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description: "Let's start your journey toward motivation and personal growth.",
    icon: '🚀',
    color: 'bg-success-light',
    textColor: 'text-success',
    previewPath: '/',
  }
];

export default function OnboardingTour() {
  const router = useRouter();
  const { 
    showOnboarding, 
    currentStep, 
    completeOnboarding, 
    skipOnboarding, 
    dismissOnboarding,
    nextStep, 
    prevStep, 
    goToStep 
  } = useOnboarding();
  
  const [showProgress, setShowProgress] = useState(false);
  
  // Show progress indicator after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  if (!showOnboarding) return null;
  
  const currentStepData = ONBOARDING_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  // Preview the current feature
  const handlePreview = () => {
    if (currentStepData.previewPath) {
      dismissOnboarding();
      router.push(currentStepData.previewPath);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div 
          className="relative max-w-md w-full mx-4 bg-surface rounded-lg shadow-xl border border-border"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close button */}
          <button 
            onClick={dismissOnboarding} 
            className="absolute top-3 right-3 text-muted hover:text-foreground z-10"
            aria-label="Close onboarding"
          >
            <FaTimes />
          </button>
          
          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className={`mx-auto w-20 h-20 flex items-center justify-center text-4xl rounded-full ${currentStepData.color} ${currentStepData.textColor} mb-6`}>
              {currentStepData.icon}
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-3">
              {currentStepData.title}
            </h2>
            
            {/* Description */}
            <p className="text-center text-muted mb-6">
              {currentStepData.description}
            </p>
            
            {/* Progress indicator */}
            {showProgress && (
              <div className="flex justify-center space-x-2 mb-6">
                {ONBOARDING_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                      index === currentStep 
                        ? 'bg-primary' 
                        : 'bg-primary-light hover:bg-primary/30'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-col gap-3">
              {/* Navigation buttons */}
              <div className="flex justify-between gap-3">
                {!isFirstStep ? (
                  <button 
                    onClick={prevStep}
                    className="flex-1 btn btn-outline flex items-center justify-center gap-2"
                  >
                    <FaArrowLeft size={12} /> Back
                  </button>
                ) : (
                  <button 
                    onClick={skipOnboarding}
                    className="flex-1 btn btn-outline"
                  >
                    Skip Tour
                  </button>
                )}
                
                {!isLastStep ? (
                  <button 
                    onClick={nextStep}
                    className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                  >
                    Next <FaArrowRight size={12} />
                  </button>
                ) : (
                  <button 
                    onClick={completeOnboarding}
                    className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                  >
                    Get Started <FaCheck size={12} />
                  </button>
                )}
              </div>
              
              {/* Preview button (not for welcome or completion step) */}
              {currentStep !== 0 && currentStep !== ONBOARDING_STEPS.length - 1 && (
                <button 
                  onClick={handlePreview} 
                  className="btn btn-secondary w-full"
                >
                  Preview This Feature
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
