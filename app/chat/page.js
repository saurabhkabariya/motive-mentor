"use client";

import { useUser } from "@/app/usercontext";
import Chat from "@/components/chat";
import ChatInput from "@/components/ChatInput";
import { useTheme } from "../themecontext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Suspense } from "react";

function ChatPageClient() {
  const { user } = useUser();
  return (
    <div className="max-w-lg mx-auto mt-10 mb-10 border rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full bg-surface">      
      <h2 className="text-xl font-bold text-center rounded-t-lg p-4 bg-surface border-b border-primary-light">
        <span className="text-primary">Chat</span> Forum
      </h2>
      
      <ProtectedRoute
        redirectTo="/"
        showAuthModal={true}
        fallback={
          <div className="text-center p-8">
            <p className="mb-4 font-medium">Please sign in to access the chat forum.</p>
            <p className="text-sm text-muted">
              You can sign in using the button in the navigation bar above.
            </p>
          </div>
        }
      >
        <>
          <Chat currentUser={user} />
          <ChatInput user={user} />
        </>
      </ProtectedRoute>
    </div>
  );
}

// Export a wrapped version with Suspense
export default function ChatPage() {  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto mt-10 mb-10 border rounded-lg shadow-xl h-full bg-surface">
        <h2 className="text-xl font-bold text-center rounded-t-lg p-4 border-b border-primary-light">
          <span className="text-primary">Chat</span> Forum
        </h2>
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-primary shadow-md"></div>
        </div>
      </div>
    }>
      <ChatPageClient />
    </Suspense>
  );
}
