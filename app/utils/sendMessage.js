"use client";

import { saveMessage } from "./chatStorage";
import { validateImageUrl } from "./avatarHelper";

export const sendMessage = async (text, user) => {
  if (!text.trim()) return false; // Prevent empty messages
  if (!user) return false; // Prevent sending if user is not authenticated
  
  try {
    // Validate the avatar URL or use default
    const avatar = validateImageUrl(user.photoURL) || "/default-avatar.png";
    
    // Create user object with validated avatar
    const userWithAvatar = {
      ...user,
      photoURL: avatar
    };
    
    // Save message to localStorage
    const savedMessage = saveMessage(text, userWithAvatar);
    
    return !!savedMessage; // Return true if message was saved successfully
  } catch (error) {
    console.error("Error sending message: ", error);
    return false;
  }
};
