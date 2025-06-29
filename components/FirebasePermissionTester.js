"use client";
import { useState, useEffect } from 'react';
import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

/**
 * This component helps diagnose Firebase permission issues
 * Add this component temporarily to a page to test Firebase permissions
 */
export default function FirebasePermissionTester() {
  const [user, setUser] = useState(null);
  const [testStatus, setTestStatus] = useState('idle');
  const [testResult, setTestResult] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
    useEffect(() => {
    // Get current auth state
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    
    return () => unsubscribe();
  }, []);
  
  const runPermissionTest = async () => {
    if (!user) {
      setTestStatus('error');
      setTestResult('No user is signed in. Please sign in first.');
      return;
    }
    
    setTestStatus('testing');
    setErrorDetails(null);
    
    try {
      // Step 1: Try to create a test document
      const testDocRef = doc(db, "users", user.uid, "_test", "permissions");
      const testData = { 
        timestamp: new Date().toISOString(),
        test: "Firebase permission test"
      };
      
      // Step 2: Write to the document
      await setDoc(testDocRef, testData);
      setTestResult("✅ Write test passed");
      
      // Step 3: Read the document
      const docSnap = await getDoc(testDocRef);
      if (docSnap.exists()) {
        setTestResult(prev => `${prev}\n✅ Read test passed`);
      } else {
        setTestResult(prev => `${prev}\n❌ Read test failed - Document doesn't exist after writing`);
      }
      
      // Step 4: Delete the test document
      await deleteDoc(testDocRef);
      setTestResult(prev => `${prev}\n✅ Delete test passed`);
      
      setTestStatus('success');
    } catch (error) {
      console.error("Permission test failed:", error);
      setTestStatus('error');
      setTestResult(`❌ Test failed: ${error.message}`);
      setErrorDetails({
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    }
  };
  
  return (
    <div className="p-4 border rounded-lg max-w-lg mx-auto my-4">
      <h2 className="text-xl font-bold mb-4">Firebase Permission Tester</h2>
      
      <div className="mb-4">
        <p><strong>Auth Status:</strong> {user ? `Signed in as ${user.email}` : 'Not signed in'}</p>
        {user && (
          <p className="text-xs text-gray-500 mt-1">User ID: {user.uid}</p>
        )}
      </div>
      
      <button 
        onClick={runPermissionTest}
        disabled={!user || testStatus === 'testing'}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {testStatus === 'testing' ? 'Testing...' : 'Run Permission Test'}
      </button>
      
      {testStatus !== 'idle' && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <pre className="whitespace-pre-wrap text-sm">
            {testResult}
          </pre>
          
          {errorDetails && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-red-600">Error Details:</h3>
              <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded">
                Code: {errorDetails.code}
                Message: {errorDetails.message}
                Stack: {errorDetails.stack}
              </pre>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>This component tests if your Firebase security rules are correctly configured.</p>
        <p>If tests fail, make sure your security rules allow authenticated users to read/write their own data.</p>
      </div>
    </div>
  );
}
