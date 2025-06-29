"use client";
import { useTheme } from "@/app/themecontext";
import FirebaseRulesHelper from "@/components/FirebaseRulesHelper";
import FirebasePermissionTester from "@/components/FirebasePermissionTester";
import { useUser } from "@/app/usercontext";

export default function FirebaseHelperPage() {
  const { darkMode } = useTheme();
  const { user, loading } = useUser();
  
  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Permission Helper</h1>
        
        <div className="mb-8">
          <p className="mb-4">
            This page helps you resolve the "Missing or insufficient permissions" error that can occur when 
            trying to save quotes or other data to your Firebase database.
          </p>
          
          <div className={`p-4 rounded-lg mb-6 ${darkMode ? "bg-red-900 text-red-100" : "bg-red-50 text-red-800"}`}>
            <h2 className="text-xl font-semibold mb-2">About the Error</h2>
            <p>
              <code className="font-mono bg-opacity-20 bg-red-200 px-1 rounded">FirebaseError: Missing or insufficient permissions.</code>
            </p>
            <p className="mt-2">
              This error occurs when your Firebase security rules don't allow the current operation. 
              Firebase uses rules to control who can read and write to your database, and by default, 
              access is restricted for security reasons.
            </p>
          </div>
        </div>
        
        {user ? (
          <FirebasePermissionTester />
        ) : loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Checking authentication status...</p>
          </div>
        ) : (
          <div className={`p-4 rounded-lg mb-6 ${darkMode ? "bg-yellow-900 text-yellow-100" : "bg-yellow-50 text-yellow-800"}`}>
            <p className="font-medium">Please sign in to test your Firebase permissions.</p>
          </div>
        )}
        
        <div className="mt-10">
          <FirebaseRulesHelper />
        </div>
        
        <div className="mt-10 border-t pt-6">
          <h2 className="text-2xl font-bold mb-4">Common Issues & Solutions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Rules aren't updated</h3>
              <p>
                Make sure you've copied and published the exact rules provided above in your Firebase console.
                It may take a few minutes for rule changes to propagate.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">2. User is not authenticated</h3>
              <p>
                The rules only allow access to a user's own data when they're authenticated.
                Make sure you've signed in before trying to save quotes.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">3. Path structure mismatch</h3>
              <p>
                If your code is trying to access a different path structure than what's covered by the rules,
                you'll need to adjust either your code or the rules to match.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
