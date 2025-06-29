"use client";

import { useUser } from "@/app/usercontext";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

// Client component with hooks
function ProtectedRouteClient({ children, redirectTo = "/", fallback = null, showAuthModal = true }) {
  const { user, loading, requestAuthentication } = useUser();
  const router = useRouter();  

  useEffect(() => {
    if (!loading && !user) {
      if (showAuthModal) {
        // Show the auth modal without forcing an immediate redirect
        requestAuthentication();
      } else if (redirectTo) {
        // Only redirect if not showing auth modal and redirectTo is provided
        router.push(redirectTo);
      }
    }
  }, [user, loading, router, redirectTo, showAuthModal, requestAuthentication]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, show the fallback
  if (!user) {
    return fallback;
  }

  // If authenticated, render the protected content
  return children;
}

// Server component wrapper with Suspense
export default function ProtectedRoute(props) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ProtectedRouteClient {...props} />
    </Suspense>
  );
}
