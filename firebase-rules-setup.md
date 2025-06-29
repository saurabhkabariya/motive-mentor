# Firebase Security Rules Setup

To fix the "Missing or insufficient permissions" error, you need to update your Firebase security rules. Here's how:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project "motive-mentor-forum"
3. In the left sidebar, click on "Firestore Database"
4. Click on the "Rules" tab
5. Replace the existing rules with the following:

```
rules_version = '2';
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
}
```

6. Click "Publish" to apply the rules

These rules allow:
- Users to read and write only their own data in the `users/{userId}` collection
- Users to access their own subcollections (like `gameData`)
- Public access to the `public` collection (add this only if you need it)
- Denies access to all other documents by default

After updating these rules, the "Missing or insufficient permissions" error should be resolved.
