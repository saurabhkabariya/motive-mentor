"use client";
import { useState, useEffect } from "react";
import { useTheme } from "../themecontext";
import Link from "next/link";
import { FaShoppingCart, FaSearch, FaFilter, FaStar } from "react-icons/fa";

// Sample book data
const booksData = [
  {    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    price: 19.99,
    rating: 4.8,
    coverImage: "/images/books/atomic habit.jpg",
    description: "Tiny Changes, Remarkable Results: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    category: "Self-Help",
    link:"https://amzn.to/4korLQ0"
  },
  {    id: 2,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 17.99,
    rating: 4.7,
    coverImage: "/images/books/psychology of money.jpg",
    description: "Timeless lessons on wealth, greed, and happiness",
    category: "Finance",
    link:"https://amzn.to/4mDh9ht"
  },
  {    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    price: 15.99,
    rating: 4.6,
    coverImage: "/images/books/deepwork.jpg",
    description: "Rules for Focused Success in a Distracted World",
    category: "Productivity",
    link:"https://amzn.to/4juoLjA"
  },
  {    id: 4,
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 12.99,
    rating: 4.9,
    coverImage: "/images/books/thinkandgrowrich.jpg",
    description: "The Landmark Bestseller Now Revised and Updated for the 21st Century",
    category: "Finance",
    link:"https://amzn.to/451icBx"
  },
  {    id: 5,
    title: "How to Win Friends & Influence People",
    author: "Dale Carnegie",
    price: 14.99,
    rating: 4.7,
    coverImage: "/images/books/influpeople.jpg",
    description: "The only book you need to lead you to success",
    category: "Self-Help",
    link:"https://amzn.to/4kHgxpe"
  },
  {    id: 6,
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    price: 16.99,
    rating: 4.8,
    coverImage: "/images/books/7habits.jpg",
    description: "Powerful Lessons in Personal Change",
    category: "Self-Help",
    link:"https://amzn.to/4jwOpV1"
  },
  {    id: 7,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    price: 18.99,
    rating: 4.6,
    coverImage: "/images/books/thinking.jpg",
    description: "An exploration of the two cognitive systems that shape our judgments and decisions",
    category: "Psychology",
    link:"https://amzn.to/3Hk6V5G"
  },  {    id: 8,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 13.99,
    rating: 4.7,
    coverImage: "/images/books/alchemist.jpg",
    description: "A magical story about following your dreams",
    category: "Fiction",
    link:"https://amzn.to/43Eg7Jo"
  },
  {    id: 9,
    title: "Mindset: The New Psychology of Success",
    author: "Carol S. Dweck",
    price: 15.49,
    rating: 4.6,
    coverImage: "/images/books/mindset.jpg",
    description: "How we can learn to fulfill our potential by understanding the power of mindset",
    category: "Psychology",
    link:"https://amzn.to/4mzPsq1"
  },
  {    id: 10,
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    price: 14.99,
    rating: 4.5,
    coverImage: "/images/books/subtleart.jpg",
    description: "A counterintuitive approach to living a good life",
    category: "Self-Help",
    link:"https://amzn.to/4kArFEg"
  },
  {    id: 11,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    price: 11.99,
    rating: 4.7,
    coverImage: "/images/books/richdadpoordad.jpg",
    description: "What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!",
    category: "Finance",
    link:"https://amzn.to/4kKAIms"
  },
  {    id: 12,
    title: "The Four Agreements",
    author: "Don Miguel Ruiz",
    price: 10.99,
    rating: 4.6,
    coverImage: "/images/books/fouragreements.jpg",
    description: "A practical guide to personal freedom",
    category: "Spirituality",
    link:"https://amzn.to/45jIb7B"
  }
];

export default function BooksPage() {  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(booksData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const totalPrice = cart.reduce((total, item) => total + item.price, 0).toFixed(2);

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
        </div>
      </div>      {/* Main Content */}
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
                  {/* <div className="flex text-sm mb-1">
                    {renderStars(book.rating)}
                  </div> */}
                  <h3 className="text-lg font-bold mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">by {book.author}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-bold px-6 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Get Now</span>
                    {/* <span className="font-bold text-lg">${book.price}</span> */}
                    <span className="px-2 py-1 bg-yellow-500 text-sm text-white rounded">Bestseller</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
          
          {/* <button 
            onClick={() => setShowCart(!showCart)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <FaShoppingCart className="mr-2" />
            Cart ({cart.length})
          </button> */}
        </div>

        {/* Shopping Cart Dropdown */}
        {/* {showCart && (
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow-lg mb-6`}>
            <h3 className="text-xl font-bold mb-3">Shopping Cart</h3>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div>
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm">${item.price}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="mt-3 flex justify-between items-center">
                  <p className="font-bold">Total: ${totalPrice}</p>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )} */}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (              <div 
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
                </div>
                <div className="p-4">
                  {/* <div className="flex text-sm mb-1">
                    {renderStars(book.rating)}
                    <span className="ml-1 text-sm">({book.rating})</span>
                  </div> */}
                  <h3 className="text-lg font-bold mb-1" onClick={() => openBookDetails(book)}>{book.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">by {book.author}</p>
                  <p className="text-xs line-clamp-2 mb-3">{book.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-auto p-4">
                    <span className="font-bold text-lg">${book.price}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(book);
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
          )}        </div>
      </div>

      {/* Recommendations Section */}
      {/* <div className={`py-12 ${darkMode ? "bg-gray-800" : "bg-gray-50"} mt-16`}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Recommended Reading Lists</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Self-Improvement Essentials",
                description: "Books to help you become your best self",
                image: "/images/books/default-book.svg",
                color: "bg-blue-600"
              },
              {
                title: "Financial Freedom",
                description: "Master your finances and build wealth",
                image: "/images/books/default-book.svg",
                color: "bg-green-600"
              },
              {
                title: "Productivity Mastery",
                description: "Optimize your workflow and achieve more",
                image: "/images/books/default-book.svg",
                color: "bg-purple-600"
              }
            ].map((list, index) => (
              <div 
                key={index}
                className={`rounded-lg overflow-hidden shadow-md cursor-pointer transform transition hover:-translate-y-1`}
              >
                <div className={`${list.color} h-40 relative flex items-center justify-center`}>
                  <h3 className="text-xl font-bold text-white text-center z-10 px-4">{list.title}</h3>
                  <div className="absolute inset-0 opacity-30 flex justify-center">
                    <img 
                      src={list.image} 
                      alt={list.title}
                      className="h-full w-auto object-cover"
                    />
                  </div>
                </div>
                <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                  <p className="text-sm mb-3">{list.description}</p>
                  <button className="text-blue-500 font-medium hover:underline">
                    View Collection →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Newsletter Section */}
      {/* <div className={`mt-16 py-12 ${darkMode ? "bg-gray-800" : "bg-blue-50"}`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get notifications about new book arrivals, special offers, and exclusive discounts.
          </p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none text-gray-800"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition">
              Subscribe
            </button>          </div>
        </div>
      </div> */}

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
                {/* <div className="mt-4 flex justify-between">
                  <span className="text-2xl font-bold">${selectedBook.price}</span>
                  <div className="flex text-sm">
                    {renderStars(selectedBook.rating)}
                    <span className="ml-1">({selectedBook.rating})</span>
                  </div>
                </div> */}
                <button 
                  onClick={() => {
                    // addToCart(selectedBook);
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
                      {/* <li><span className="font-medium">Pages:</span> {Math.floor(Math.random() * 300) + 100}</li> */}
                      <li><span className="font-medium">Language:</span> English</li>
                      {/* <li><span className="font-medium">Publication:</span> {2010 + Math.floor(Math.random() * 13)}</li> */}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    <ul className="space-y-1">
                      <li>✓ Hardcover Available</li>
                      <li>✓ Digital Edition</li>
                      {/* <li>✓ Free Shipping</li>
                      <li>✓ 30-Day Returns</li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
