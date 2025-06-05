"use client";
import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const response = await fetch("/api/feedback");
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return alert("Please fill all fields!");

    const newFeedback = { name, email, message };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) throw new Error("Failed to submit feedback");

      setFeedbacks([...feedbacks, newFeedback]);
      setName("");
      setEmail("");
      setMessage("");
      alert("Feedback submitted successfully! 🎉");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-4">User Feedback</h1>

      {/* Feedback Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md max-w-lg mx-auto space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Your Feedback"
          className="w-full p-3 border rounded-lg h-24"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
          Submit Feedback
        </button>
      </form>

      {/* Display Feedback */}
      <div className="mt-6 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-3">Submitted Feedback</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback submitted yet.</p>
        ) : (
          <ul className="space-y-3">
            {feedbacks.map((f, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="font-bold">{f.name}</p>
                  <p className="text-sm text-gray-600">{f.email}</p>
                  <p className="mt-1">{f.message}</p>
                </div>
                <button className="text-red-500 hover:text-red-700 transition">
                  <AiOutlineDelete size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
