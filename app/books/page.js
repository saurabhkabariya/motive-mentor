"use client";
import { useState, useEffect } from "react";
import { useTheme } from "../themecontext";
import { useUser } from "../usercontext";
import Link from "next/link";
import { FaShoppingCart, FaSearch, FaFilter, FaStar } from "react-icons/fa";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { booksData } from "./bookdata";

export default function BooksPage() {
  const { darkMode } = useTheme();
  const { user, loading: userLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(booksData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  // Extract unique categories
  const categories = ["All", ...new Set(booksData.map(book => book.category))];

  useEffect(() => {
    // Filter books based on search term and category
    let results = booksData;
    
    if (searchTerm) {
      results = results.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      results = results.filter(book => book.category === selectedCategory);
    }
    
    setFilteredBooks(results);
  }, [searchTerm, selectedCategory]);

  // Load user's favorite books
  useEffect(() => {
    if (!userLoading && user) {
      const fetchFavoriteBooks = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists() && docSnap.data().favoriteBooks) {
            setFavoriteBooks(docSnap.data().favoriteBooks);
          }
        } catch (error) {
          console.error("Error fetching favorite books:", error);
        }
      };
      
      fetchFavoriteBooks();
    }
  }, [user, userLoading]);

  const addToCart = (book) => {
    setCart([...cart, book]);
  };

  const removeFromCart = (id) => {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const openBookDetails = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0).toFixed(2);  // Toggle book favorite status
  const toggleFavorite = async (bookId) => {
    if (!user) {
      // Use the requestAuthentication from the context
      const { requestAuthentication } = useUser();
      requestAuthentication('/books');
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      
      // Check if the book is already a favorite
      const isCurrentlyFavorite = favoriteBooks.includes(bookId);
      
      if (isCurrentlyFavorite) {
        // Remove from favorites
        const updatedFavorites = favoriteBooks.filter(id => id !== bookId);
        setFavoriteBooks(updatedFavorites);
        
        await setDoc(userDocRef, {
          favoriteBooks: updatedFavorites
        }, { merge: true });
      } else {
        // Add to favorites
        const updatedFavorites = [...favoriteBooks, bookId];
        setFavoriteBooks(updatedFavorites);
        
        await setDoc(userDocRef, {
          favoriteBooks: arrayUnion(bookId)
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error updating favorite books:", error);
    }
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };

  // Check if a book is favorited
  const isFavorite = (bookId) => {
    return favoriteBooks.includes(bookId);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      {/* Hero Banner */}
      <div className="relative">
        <div className="container mx-auto py-12 px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Motive Mentor Bookstore</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            Discover books that will inspire, motivate, and transform your life.
          </p>
          <div className="max-w-md relative">
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 pr-10 rounded-lg focus:outline-none border-2 placeholder:text-gray-500"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>      </div>
      
      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Featured Books */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {booksData.slice(0, 3).map(book => (
              <div 
                key={`featured-${book.id}`} 
                className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden flex cursor-pointer transition duration-300 transform hover:-translate-y-1`}
                onClick={() => openBookDetails(book)}
              >
                <div className="w-1/3 bg-gray-300">
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/images/books/default-book.svg'}
                  />
                </div>
                <div className="w-2/3 p-4">
                  <h3 className="text-lg font-bold mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">by {book.author}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-bold px-6 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Get Now</span>
                    <span className="px-2 py-1 bg-yellow-500 text-sm text-white rounded">Bestseller</span>
                  </div>
                </div>
              </div>
            ))}
          </div>        </div>
        
        {/* Filter and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <FaFilter className="mr-2" />
            <span className="mr-3">Filter by:</span>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-2 rounded-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {user && (
            <div className="text-sm px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              Signed in as {user.email}
            </div>
          )}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <div 
                key={book.id} 
                className={`${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"} flex flex-col rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:-translate-y-1 cursor-pointer`}
              >
                <div className="h-48 bg-gray-300 overflow-hidden relative" onClick={() => openBookDetails(book)}>
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/images/books/default-book.svg'}
                  />
                  {[1, 4, 10].includes(book.id) && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 text-xs">
                      Bestseller
                    </div>
                  )}
                  
                  {user && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(book.id);
                      }}
                      className="absolute top-0 left-0 m-2 text-xl"
                    >
                      {isFavorite(book.id) ? "❤️" : "🤍"}
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" onClick={() => openBookDetails(book)}>{book.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">by {book.author}</p>
                  <p className="text-xs line-clamp-2 mb-3">{book.description}</p>
                </div>
                <div className="flex justify-between items-center mt-auto p-4">
                  {/* <span className="font-bold text-lg">${book.price}</span> */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(book.link, "_blank");
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm cursor-pointer"
                  >
                    Get Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-xl">No books found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Book Details Modal */}
      {showModal && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className={`relative max-w-3xl w-full rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} p-6 max-h-[90vh] overflow-y-auto`}>
            <button 
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="bg-gray-300 rounded-lg overflow-hidden">
                  <img 
                    src={selectedBook.coverImage} 
                    alt={selectedBook.title}
                    className="w-full h-auto object-cover"
                    onError={(e) => e.target.src = '/images/books/default-book.svg'}
                  />
                </div>
                {user && (
                  <button 
                    onClick={() => toggleFavorite(selectedBook.id)}
                    className="mt-4 w-full py-2 border rounded-md text-center"
                  >
                    {isFavorite(selectedBook.id) ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
                  </button>
                )}
                <button 
                  onClick={() => {
                    window.location.href=selectedBook.link;
                    closeModal();
                  }}
                  className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                >
                  Get Now
                </button>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">by {selectedBook.author}</p>
                
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="mb-4">{selectedBook.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Details</h3>
                    <ul className="space-y-1">
                      <li><span className="font-medium">Category:</span> {selectedBook.category}</li>
                      <li><span className="font-medium">Language:</span> English</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    <ul className="space-y-1">
                      <li>✓ Hardcover Available</li>
                      <li>✓ Digital Edition</li>
                    </ul>
                  </div>
                </div>
              </div>            </div>          </div>
        </div>
      )}
      
    </div>
  );
}
