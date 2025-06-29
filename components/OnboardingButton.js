"use client";

import { useOnboarding } from '@/app/onboardingContext';
import { FaQuestionCircle } from 'react-icons/fa';

export default function OnboardingButton({ className = "", variant = "icon", "data-testid": testId = "" }) {
  const { setShowOnboarding, resetSteps } = useOnboarding();
  
  const handleStartTour = () => {
    resetSteps();
    setShowOnboarding(true);
  };
  
  if (variant === "icon") {
    return (
      <button 
        onClick={handleStartTour}
        className={`md:p-2 rounded-full text-primary hover:bg-primary-light transition-colors duration-200 ${className}`}
        aria-label="Take the app tour"
        title="Take the app tour"
        data-onboarding-trigger
        data-testid={testId || "onboarding-button-icon"}
      >
        <FaQuestionCircle size={26} />
      </button>
    );
  }
  
  if (variant === "text") {
    return (
      <button 
        onClick={handleStartTour}
        className={`btn btn-outline text-primary hover:border-primary hover:bg-primary-light transition-colors duration-200 ${className}`}
        data-onboarding-trigger
        data-testid={testId || "onboarding-button-text"}
      >
        Take Tour
      </button>
    );
  }
  
  return (
    <button 
      onClick={handleStartTour}
      className={`flex items-center gap-2 btn btn-outline text-primary hover:border-primary hover:bg-primary-light transition-colors duration-200 ${className}`}
      data-onboarding-trigger
      data-testid={testId || "onboarding-button-default"}
    >
      <FaQuestionCircle size={16} /> Take App Tour
    </button>
  );
}
