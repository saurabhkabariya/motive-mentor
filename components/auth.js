// components/Auth.js
"use client";
import { useUser } from "@/app/usercontext";

export default function Auth() {
  const { user, signOut, requestAuthentication } = useUser();

  return (
    <div className="flex justify-center mt-4">
      {user ? (
        <button 
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      ) : (
        <button 
          onClick={requestAuthentication}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
