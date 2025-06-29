"use client";

import { createContext, useState, useContext, useEffect } from "react";

// Create a context to manage onboarding state
const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if onboarding has been completed on mount
  useEffect(() => {
    const hasCompleted = localStorage.getItem("onboardingCompleted");
    if (hasCompleted === "true") {
      setHasCompletedOnboarding(true);
    } else {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Complete onboarding
  const completeOnboarding = () => {
    localStorage.setItem("onboardingCompleted", "true");
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
  };

  // Skip onboarding (same as complete but with different analytics intent)
  const skipOnboarding = () => {
    localStorage.setItem("onboardingCompleted", "true");
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
    // Here you could add analytics to track skipped onboarding
  };

  // Dismiss for now (will show again on next visit)
  const dismissOnboarding = () => {
    setIsDismissed(true);
    setShowOnboarding(false);
  };

  // Go to next step
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Go to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  // Reset to start step
  const resetSteps = () => {
    setCurrentStep(0);
  };

  // Show a specific step
  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding,
        showOnboarding,
        currentStep,
        isDismissed,
        setShowOnboarding,
        completeOnboarding,
        skipOnboarding,
        dismissOnboarding,
        nextStep,
        prevStep,
        resetSteps,
        goToStep,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

// Custom hook to use the onboarding context
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
