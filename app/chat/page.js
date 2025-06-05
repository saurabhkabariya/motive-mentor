// pages/chat.js
// "use client";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "@/lib/firebaseConfig";
// import Auth from "@/components/auth";
// import Chat from "@/components/chat";
// import { useTheme } from "../themecontext";

// export default function ChatPage() {
//   const [user] = useAuthState(auth);
//   const { darkMode } = useTheme(); 

//   return (
//     <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-100 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
//       <h1 className="text-2xl font-bold mb-4">Motive Mentor Chat</h1>
//       <Auth user={user} />
//       {user && <Chat />}
//     </div>
//   );
// }

"use client";


import { useState, useEffect } from "react";
import { auth } from "@/lib/firebaseConfig";
import Chat from "@/components/chat";
import ChatInput from "@/components/ChatInput";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useTheme } from "../themecontext";

const ChatPage = () => {
  const [user, setUser] = useState(null);
  const { darkMode } = useTheme(); 

  useEffect(() => {
    onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
    });
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className={`max-w-lg mx-auto mt-10 border rounded-lg shadow-lg h-full ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h2 className={`text-xl font-bold text-center rounded-lg p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>Chat Forum</h2>
      {!user ? (
        <div className="text-center p-4">
          <button onClick={handleLogin} className={`p-2 rounded-md cursor-pointer bg-blue-500 text-white`}>
            Sign in with Google
          </button>
        </div>
      ) : (
        <>
          <Chat currentUser={user} />
          <ChatInput user={user} />
        </>
      )}
    </div>
  );
};

export default ChatPage;
