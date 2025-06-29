"use client";

// Utility to validate image URLs before attempting to display them
export const validateImageUrl = (url) => {
  // Check if URL is null, undefined, or an empty string
  if (!url || url === "null" || url === "undefined" || url.trim() === "") {
    return null;
  }
  
  try {
    // Check if URL is valid
    new URL(url);
    return url;
  } catch (e) {
    // If URL is not valid format, check if it's a local path
    if (url.startsWith('/')) {
      return url; // Local path, which is valid
    }
    return null;
  }
};

// Helper function to get default avatar or initials for a user
export const getAvatarDisplay = (user) => {
  if (!user) {
    return {
      type: 'initials',
      value: 'U'
    };
  }
  
  const validUrl = validateImageUrl(user.photoURL);
  
  if (validUrl) {
    return {
      type: 'image',
      value: validUrl
    };
  }
  
  // Use first letter of display name or email
  const initial = user.displayName 
    ? user.displayName.charAt(0).toUpperCase() 
    : (user.email ? user.email.charAt(0).toUpperCase() : 'U');
    
  return {
    type: 'initials',
    value: initial
  };
};
