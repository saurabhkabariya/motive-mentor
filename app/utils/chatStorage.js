"use client";

import { getStoredItem, setStoredItem } from './storage';

// Constants
const CHAT_MESSAGES_KEY = 'chat_messages';

/**
 * Get all chat messages from localStorage
 * @returns {Array} Array of chat messages
 */
export function getMessages() {
  return getStoredItem(CHAT_MESSAGES_KEY, []);
}

/**
 * Save a new message to localStorage
 * @param {string} text - The message text
 * @param {object} user - The user object
 * @returns {object} The saved message object
 */
export function saveMessage(text, user) {
  if (!text.trim() || !user) return null;
  
  // Create a new message object
  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text,
    senderId: user.uid || 'anonymous',
    senderName: user.displayName || 'Anonymous',
    avatar: user.photoURL || '/default-avatar.png',
    createdAt: {
      // Mimic Firebase Timestamp object structure
      toDate: () => new Date(),
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: (Date.now() % 1000) * 1000000
    }
  };
  
  // Get existing messages
  const messages = getMessages();
  
  // Add new message
  const updatedMessages = [...messages, newMessage];
  
  // Save back to localStorage
  setStoredItem(CHAT_MESSAGES_KEY, updatedMessages);
  
  return newMessage;
}

/**
 * Delete a message from localStorage
 * @param {string} messageId - The ID of the message to delete
 * @returns {boolean} Whether the operation was successful
 */
export function deleteMessage(messageId) {
  const messages = getMessages();
  const filteredMessages = messages.filter(msg => msg.id !== messageId);
  
  if (filteredMessages.length === messages.length) {
    return false; // No message was deleted
  }
  
  setStoredItem(CHAT_MESSAGES_KEY, filteredMessages);
  return true;
}

/**
 * Clear all chat messages
 * @returns {boolean} Whether the operation was successful
 */
export function clearAllMessages() {
  setStoredItem(CHAT_MESSAGES_KEY, []);
  return true;
}

/**
 * Create a Firestore-like timestamp
 * @returns {Object} A timestamp object that mimics Firestore's timestamp
 */
export function createTimestamp() {
  const now = new Date();
  return {
    toDate: () => now,
    seconds: Math.floor(now.getTime() / 1000),
    nanoseconds: (now.getTime() % 1000) * 1000000
  };
}
