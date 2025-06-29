"use client";

import { FaCog } from 'react-icons/fa';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FaCog className="text-primary animate-spin text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-medium">Loading Settings...</h2>
      </div>
    </div>
  );
}
