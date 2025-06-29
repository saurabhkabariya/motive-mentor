"use client";
import { useState } from 'react';

export default function FirebaseRulesHelper() {
  const [copied, setCopied] = useState(false);
  
  const securityRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write only their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to nested collections under the user document
      match /{allSubcollections=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Publicly readable documents (if needed)
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;

  const copyRules = () => {
    navigator.clipboard.writeText(securityRules);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="p-6 border rounded-lg max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Firebase Security Rules Setup</h2>
      
      <div className="mb-6">
        <p className="mb-2">To fix the "Missing or insufficient permissions" error, follow these steps:</p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
          <li>Select your project "motive-mentor-forum"</li>
          <li>In the left sidebar, click on "Firestore Database"</li>
          <li>Click on the "Rules" tab</li>
          <li>Replace the existing rules with the rules below</li>
          <li>Click "Publish" to apply the rules</li>
        </ol>
      </div>
      
      <div className="relative">
        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96 mb-4">
          {securityRules}
        </pre>
        
        <button 
          onClick={copyRules}
          className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
        >
          {copied ? "Copied!" : "Copy Rules"}
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">What these rules do:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
          <li>Allow users to read and write only to their own data in the <code className="bg-yellow-100 px-1">users/{'{userId}'}</code> collection</li>
          <li>Allow users to access their own subcollections (like <code className="bg-yellow-100 px-1">gameData</code>)</li>
          <li>Allow public read access to the <code className="bg-yellow-100 px-1">public</code> collection (add this only if needed)</li>
          <li>Deny access to all other documents by default for security</li>
        </ul>
      </div>
      
      <p className="mt-6 text-sm text-gray-500">
        After updating these rules, the "Missing or insufficient permissions" error should be resolved.
        It may take a few minutes for the rules to propagate through Firebase's systems.
      </p>
    </div>
  );
}
