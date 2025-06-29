"use client";

import Image from 'next/image';
import { useState } from 'react';
import { validateImageUrl } from '../app/utils/avatarHelper';

const UserAvatar = ({ 
  user, 
  size = 'md', 
  className = '',
  showInitialsOnError = true 
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Set sizes based on the size prop
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // Get user information
  const userAvatar = user?.photoURL ? validateImageUrl(user.photoURL) : null;
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  
  // If no avatar URL or there was an error loading the image, show initials
  if (!userAvatar || imageError) {
    return (
      <div className={`${sizeClass} rounded-full bg-gray-300 flex items-center justify-center font-bold ${className}`}>
        {userInitial}
      </div>
    );
  }
    // Otherwise show the avatar image
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden ${className} bg-gray-200 dark:bg-gray-700`}>
      <Image 
        src={userAvatar}
        alt={`${userName}'s avatar`}
        width={sizeClass === sizeClasses.sm ? 24 : sizeClass === sizeClasses.md ? 32 : sizeClass === sizeClasses.lg ? 48 : 64}
        height={sizeClass === sizeClasses.sm ? 24 : sizeClass === sizeClasses.md ? 32 : sizeClass === sizeClasses.lg ? 48 : 64}
        className="w-full h-full object-cover"
        unoptimized
        onError={() => {
          setImageError(true);
        }}
      />
    </div>
  );
};

export default UserAvatar;
