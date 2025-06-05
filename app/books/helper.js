"use client";
import { useEffect } from "react";
import { useTheme } from "../themecontext";

export default function BooksPage() {
  const { darkMode } = useTheme();

  // Update the book image URLs to use the default image
  useEffect(() => {
    const images = document.querySelectorAll('.book-cover-img');
    images.forEach(img => {
      img.onerror = () => {
        img.src = '/images/books/default-book.jpg';
      };
    });
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      {/* Update the BooksPage component to use the default image */}
    </div>
  );
}
