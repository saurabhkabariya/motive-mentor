"use client";

import { useState } from "react";
import { sendMessage } from "../app/utils/sendMessage";
import { useTheme } from "@/app/themecontext";

const ChatInput = ({ user }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const { darkMode } = useTheme(); 
  
  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!user) {
      console.error('User is not authenticated');
      return;
    }
    
    if (!text.trim()) return;
    
    setSending(true);
    try {
      await sendMessage(text, user);
      setText(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };
  return (
    <form onSubmit={handleSend} className={`flex p-2 border-t rounded-lg ${darkMode ? "bg-dark-surface text-dark-text border-t-dark-primary/20" : "bg-background text-text border-t-primary/20"}`}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={sending}
        className={`flex-1 p-2 border rounded-md ${darkMode ? "bg-dark-surface border-dark-textSecondary/30 text-dark-text placeholder:text-dark-textSecondary/70" : "bg-surface border-textSecondary/30 text-text placeholder:text-textSecondary/70"}`}
      />
      <button 
        type="submit" 
        disabled={sending || !text.trim()}
        className={`ml-2 p-2 rounded-lg cursor-pointer ${
          sending || !text.trim() 
            ? `${darkMode ? "bg-dark-primary/50" : "bg-primary/50"} cursor-not-allowed` 
            : `${darkMode ? "bg-dark-primary hover:bg-dark-primary/90" : "bg-primary hover:bg-primary/90"}`
        } text-white transition-colors`}
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default ChatInput;
