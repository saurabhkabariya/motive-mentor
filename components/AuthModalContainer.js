"use client";
import { useUser } from "@/app/usercontext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AuthModal from "./AuthModal";

export default function AuthModalContainer() {
  const { user, showAuthModal, closeAuthModal, authRedirectPath, clearAuthRedirectPath } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const handleCloseModal = () => {
    // First close the auth modal
    closeAuthModal();
    
    // If user is logged in and there's no specific redirect path, go to dashboard
    if (user && !authRedirectPath) {
      // Small delay to ensure the modal closing animation can complete
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);
    }
    // For non-logged in users who cancel the login, just stay on the current page
  };// If user becomes authenticated, close the modal and redirect
  useEffect(() => {
    if (user && showAuthModal) {
      // First close the auth modal
      closeAuthModal();
      
      // If there's a specific redirect path, use it
      if (authRedirectPath) {
        // Small delay to ensure the modal closing animation can complete
        setTimeout(() => {
          router.push(authRedirectPath);
          // Clear the redirect path after use
          clearAuthRedirectPath();
        }, 300);
      }
      // Otherwise, redirect to dashboard as the default after login
      else {
        // Small delay to ensure the modal closing animation can complete
        setTimeout(() => {
          router.push('/dashboard');
        }, 300);
      }
    }
  }, [user, showAuthModal, closeAuthModal, router, pathname, authRedirectPath, clearAuthRedirectPath]);
  
  return (
    <AuthModal 
      isOpen={showAuthModal} 
      onClose={handleCloseModal} 
    />
  );
}
