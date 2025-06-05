"use client";

import { useState } from "react";
import { sendMessage } from "../app/utils/sendMessage";
import { useTheme } from "@/app/themecontext";

const ChatInput = ({ user }) => {
  const [text, setText] = useState("");
  const { darkMode } = useTheme(); 

  const handleSend = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      await sendMessage(text, user);
      setText(""); // Clear input after sending
    }
  };

  return (
    <form onSubmit={handleSend} className={`flex p-2 border-t rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border rounded-md"
      />
      <button type="submit" className={`ml-2 p-2 rounded-b-lg cursor-pointer bg-blue-500 text-white`}>
        Send
      </button>
    </form>
  );
};

export default ChatInput;
