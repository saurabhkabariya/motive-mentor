// components/Chat.js
// "use client";
// import { useState } from "react";
// import { db, auth } from "@/lib/firebaseConfig";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { useCollectionData } from "react-firebase-hooks/firestore";
// import { useTheme } from "@/app/themecontext";

// export default function Chat() {
//   const [message, setMessage] = useState("");
//   const messagesRef = collection(db, "messages");
//   const [messages] = useCollectionData(messagesRef, { idField: "id" });
//   const { darkMode } = useTheme(); 

//   const sendMessage = async () => {
//     if (message.trim() === "") return;

//     await addDoc(messagesRef, {
//       text: message,
//       createdAt: serverTimestamp(),
//       user: auth.currentUser.displayName,
//       avatar: auth.currentUser.photoURL,
//     });

//     setMessage("");
//   };

//   return (
//     <div className={`mx-auto mt-8 p-4 shadow-lg rounded-md ${darkMode ? "bg-gray-900 text-white border-white border-2 rounded" : "bg-gray-100 text-black border-gray-500 border-2 rounded"}`}>
//       <div className={`h-60 overflow-y-auto mb-4`}>
//         {messages &&
//           messages
//             .sort((a, b) => a.createdAt - b.createdAt)
//             .map((msg,index) => (
//               <div key={msg.id || index} className="flex items-center mb-2">
//                 {/* <img
//                   src={msg.avatar}
//                   alt="User Avatar"
//                   className="w-8 h-8 rounded-full mr-2"
//                 /> */}
//                 <div className={`w-10 h-10 rounded-full mr-2 flex justify-center items-center ${darkMode ? "border-white border-2":"border-gray-500 border-2"}`}>{msg.user.charAt(0)}</div>
//                 <div>
//                   <p className="font-bold">{msg.user}</p>
//                   <p className={`${darkMode ? "text-white" : "text-gray-900"}`}>{msg.text}</p>
//                 </div>
//               </div>
//             ))}
//       </div>

//       <div className="flex">
//         <input
//           type="text"
//           className={`flex-grow p-2 border rounded-md ${darkMode ? "text-white placeholder:text-white" : "text-black placeholder:text-black"}`}
//           placeholder="Type a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}

//         />
//         <button
//           onClick={sendMessage}
//           className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { useTheme } from "@/app/themecontext";

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);

  const { darkMode } = useTheme(); 

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div className={`p-4 h-[70vh] overflow-y-auto ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-center mb-2 ${
            msg.senderId === currentUser.uid ? "justify-end" : "justify-start"
          }`}
        >
          {msg.senderId !== currentUser.uid && (
            <img src={msg.avatar} alt="User Avatar" className="w-8 h-8 mr-2 rounded-full" />
          )}
          <div
            className={`p-2 rounded-lg ${
              msg.senderId === currentUser.uid ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            <p className="text-sm font-semibold">{msg.senderName}</p>
            <p>{msg.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chat;
