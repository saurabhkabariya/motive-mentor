// "use client"; // Ensure this is a Client Component

// import { useTheme } from "@/app/themecontext";
// import { useState, useEffect } from "react";

// const API_URL = "https://random-word-api.herokuapp.com/word?number=1";

// export default function DailyWordGame() {
//   const [word, setWord] = useState("");
//   const [hint, setHint] = useState("");
//   const [input, setInput] = useState("");
//   const [tries, setTries] = useState(5);
//   const [hintUsed, setHintUsed] = useState(false);
//   const [message, setMessage] = useState("");
//   const [streak, setStreak] = useState(0);
//   const [usedWords, setUsedWords] = useState([]);

//   const { darkMode } = useTheme(); 

//   // Load stored words & streak AFTER the component mounts (Client-Side)
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedWords = JSON.parse(localStorage.getItem("usedWords")) || [];
//       const savedStreak = localStorage.getItem("streak") || 0;
      
//       setUsedWords(storedWords);
//       setStreak(parseInt(savedStreak, 10));
//     }
//     fetchNewWord();
//   }, []);

//   const fetchNewWord = async () => {
//     let newWord = "";
    
//     do {
//       try {
//         const response = await fetch(API_URL);
//         const data = await response.json();
//         newWord = data[0].toLowerCase();
//       } catch (error) {
//         console.error("Error fetching word:", error);
//         setMessage("⚠️ Error fetching word. Try again later.");
//         return;
//       }
//     } while (usedWords.includes(newWord));

//     setWord(newWord);
//     setHint(`The word starts with '${newWord[0]}' and has ${newWord.length} letters.`);
//     setUsedWords([...usedWords, newWord]);

//     if (typeof window !== "undefined") {
//       localStorage.setItem("usedWords", JSON.stringify([...usedWords, newWord]));
//     }
//   };

//   const handleSubmit = () => {
//     if (input.toLowerCase() === word) {
//       setMessage("🎉 Correct! You've completed today's challenge.");
//       setStreak(streak + 1);
//       if (typeof window !== "undefined") {
//         localStorage.setItem("streak", streak + 1);
//       }
//     } else {
//       setTries(tries - 1);
//       setMessage(`❌ Incorrect! ${tries - 1} tries left.`);
//       if (tries - 1 === 0) {
//         setMessage(`Game Over! The correct word was "${word}".`);
//         if (typeof window !== "undefined") {
//           localStorage.setItem("streak", 0);
//         }
//       }
//     }
//     setInput("");
//   };

//   const getHint = () => {
//     if (!hintUsed) {
//       setMessage(`💡 Hint: ${hint}`);
//       setHintUsed(true);
//     } else {
//       setMessage("You've already used your hint!");
//     }
//   };

//   return (
//     <div className={`mx-auto p-5 text-center mid-part flex items-center flex-col justify-center w-full ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
//       <h2 className="text-2xl font-bold mb-3">Daily Word Challenge</h2>
//       <p className="text-lg mb-2">Guess the word in 5 tries!</p>
//       <p className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>Streak: {streak} 🔥</p>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         className={`word-input w-1/2 p-2 border rounded mt-3 ${darkMode ? "text-white placeholder:text-white" : "text-black placeholder:text-black"}`}
//         placeholder="Enter your guess..."
//         disabled={tries === 0}
//       />
//       <div className="flex items-center justify-between">
//         <button
//             onClick={handleSubmit}
//             className="bg-blue-500 text-white px-4 py-2 mt-3 rounded disabled:opacity-50"
//             disabled={tries === 0}
//         >
//             Submit
//         </button>
//         <button
//             onClick={getHint}
//             className="bg-green-500 text-white px-4 py-2 mt-2 ml-2 rounded disabled:opacity-50"
//             disabled={hintUsed || tries === 0}
//         >
//             Get Hint
//         </button>
//       </div>
//       <p className="mt-3 font-semibold">{message}</p>
//     </div>
//   );
// }

// "use client"; // Ensure this is a Client Component

// import { useTheme } from "@/app/themecontext";
// import { useState, useEffect } from "react";

// const EASY_WORD_API = "https://random-word-api.herokuapp.com/word?number=1&length=5";

// export default function DailyWordGame() {
//   const [word, setWord] = useState("");
//   const [displayWord, setDisplayWord] = useState("");
//   const [input, setInput] = useState("");
//   const [tries, setTries] = useState(5);
//   const [hints, setHints] = useState(3);
//   const [message, setMessage] = useState("");
//   const [streak, setStreak] = useState(0);
//   const [gameOver, setGameOver] = useState(false);

//   const { darkMode } = useTheme();

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const savedStreak = localStorage.getItem("streak") || 0;
//       const lastPlayed = localStorage.getItem("lastPlayed");
//       const savedWord = localStorage.getItem("dailyWord");

//       setStreak(parseInt(savedStreak, 10));

//       const today = new Date().toDateString();
//       if (lastPlayed === today) {
//         setGameOver(true);
//         setMessage(`🎮 You already played today! Come back tomorrow.`);
//         if (savedWord) setWord(savedWord);
//         return;
//       }

//       fetchNewWord();
//     }
//   }, []);

//   const fetchNewWord = async () => {
//     try {
//       const response = await fetch(EASY_WORD_API);
//       const data = await response.json();
//       const newWord = data[0].toLowerCase();

//       setWord(newWord);
//       setDisplayWord("_ ".repeat(newWord.length).trim());

//       if (typeof window !== "undefined") {
//         localStorage.setItem("dailyWord", newWord);
//         localStorage.setItem("lastPlayed", new Date().toDateString());
//       }
//     } catch (error) {
//       console.error("Error fetching word:", error);
//       setMessage("⚠️ Error fetching word. Try again later.");
//     }
//   };

//   const handleSubmit = () => {
//     if (gameOver) return;

//     if (input.toLowerCase() === word) {
//       setMessage("🎉 Correct! You've completed today's challenge.");
//       setStreak(streak + 1);
//       setGameOver(true);
//       if (typeof window !== "undefined") {
//         localStorage.setItem("streak", streak + 1);
//         localStorage.setItem("lastPlayed", new Date().toDateString());
//       }
//     } else {
//       setTries((prev) => prev - 1);
//       setMessage(`❌ Incorrect! ${tries - 1} tries left.`);
//     }

//     if (tries - 1 === 0) {
//       setMessage(`❌ Better luck tomorrow! The correct word was "${word}".`);
//       setGameOver(true);
//       if (typeof window !== "undefined") {
//         localStorage.setItem("streak", 0);
//         localStorage.setItem("lastPlayed", new Date().toDateString());
//       }
//     }
//     setInput("");
//   };

//   const revealHint = () => {
//     if (gameOver || hints === 0) return;

//     let updatedDisplay = displayWord.split(" ");
//     let unrevealedIndexes = updatedDisplay
//       .map((char, index) => (char === "_" ? index : null))
//       .filter((index) => index !== null);

//     if (unrevealedIndexes.length > 0) {
//       const revealIndex = unrevealedIndexes[Math.floor(Math.random() * unrevealedIndexes.length)];
//       updatedDisplay[revealIndex] = word[revealIndex];
//     }

//     setDisplayWord(updatedDisplay.join(" "));
//     setHints((prev) => prev - 1);
//   };

//   return (
//     <div className={`mx-auto p-5 text-center mid-part flex items-center flex-col justify-center w-full ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
//       <h2 className="text-2xl font-bold mb-3">Daily Word Challenge</h2>
//       <p className="text-lg mb-2">Guess the word in 5 tries!</p>
//       <p className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>Streak: {streak} 🔥</p>
//       <p className="text-lg mt-3">{displayWord}</p>

//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         className={`word-input w-1/2 p-2 border rounded mt-3 ${darkMode ? "text-white placeholder:text-white" : "text-black placeholder:text-black"}`}
//         placeholder="Enter your guess..."
//         disabled={gameOver || tries === 0}
//       />
//       <div className="flex items-center justify-between">
//         <button
//             onClick={handleSubmit}
//             className="bg-blue-500 text-white px-4 py-2 mt-3 rounded disabled:opacity-50"
//             disabled={gameOver || tries === 0}
//         >
//             Submit
//         </button>
//         <button
//             onClick={revealHint}
//             className="bg-green-500 text-white px-4 py-2 mt-2 ml-2 rounded disabled:opacity-50"
//             disabled={gameOver || hints === 0}
//         >
//             Use Hint ({hints} left)
//         </button>
//       </div>
//       <p className="mt-3">Tries left: {tries}</p>
//       <p className={` ${darkMode ? "text-white" : "text-gray-600"}`}>Hints left: {hints}</p>
//       <p className="mt-3 font-semibold">{message}</p>
//     </div>
//   );
// }


"use client"; // Ensure this is a Client Component

import { useTheme } from "@/app/themecontext";
import { useState, useEffect } from "react";

const EASY_WORD_API = "https://random-word-api.herokuapp.com/word?number=1&length=5";
const AD_URL = "https://ptakeemsaifegro.net/4/9084932"; // Ad link for watching hints & extra plays

export default function DailyWordGame() {
  const [word, setWord] = useState("");
  const [displayWord, setDisplayWord] = useState("");
  const [input, setInput] = useState("");
  const [tries, setTries] = useState(5);
  const [hints, setHints] = useState(1); // Only 1 free hint
  const [message, setMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0); // Track watched ads for extra hints & plays

  const { darkMode } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStreak = localStorage.getItem("streak") || 0;
      const lastPlayed = localStorage.getItem("lastPlayed");
      const savedWord = localStorage.getItem("dailyWord");

      setStreak(parseInt(savedStreak, 10));

      const today = new Date().toDateString();
      if (lastPlayed === today) {
        setGameOver(true);
        setMessage("🎮 You already played today! Watch an ad to play again.");
        if (savedWord) {
          setWord(savedWord);
          revealFirstLetter(savedWord);
        }
        return;
      }

      fetchNewWord();
    }
  }, []);

  const fetchNewWord = async () => {
    try {
      const response = await fetch(EASY_WORD_API);
      const data = await response.json();
      const newWord = data[0].toLowerCase();

      setWord(newWord);
      revealFirstLetter(newWord);

      if (typeof window !== "undefined") {
        localStorage.setItem("dailyWord", newWord);
        localStorage.setItem("lastPlayed", new Date().toDateString());
      }
    } catch (error) {
      console.error("Error fetching word:", error);
      setMessage("⚠️ Error fetching word. Try again later.");
    }
  };

  const revealFirstLetter = (word) => {
    const firstLetter = word[0];
    setDisplayWord(firstLetter + " " + "_ ".repeat(word.length - 1).trim());
  };

  const handleSubmit = () => {
    if (gameOver) return;

    if (input.toLowerCase() === word) {
      setMessage("🎉 Correct! You've completed today's challenge.");
      setStreak(streak + 1);
      setGameOver(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("streak", streak + 1);
        localStorage.setItem("lastPlayed", new Date().toDateString());
      }
    } else {
      setTries((prev) => prev - 1);
      setMessage(`❌ Incorrect! ${tries - 1} tries left.`);
    }

    if (tries - 1 === 0) {
      setMessage(`❌ Better luck tomorrow! The correct word was "${word}".`);
      setGameOver(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("streak", 0);
        localStorage.setItem("lastPlayed", new Date().toDateString());
      }
    }
    setInput("");
  };

  const revealHint = () => {
    if (gameOver) return;

    if (hints === 0) {
      watchAdForHint();
      return;
    }

    let updatedDisplay = displayWord.split(" ");
    let unrevealedIndexes = updatedDisplay
      .map((char, index) => (char === "_" ? index : null))
      .filter((index) => index !== null);

    if (unrevealedIndexes.length > 0) {
      const revealIndex = unrevealedIndexes[Math.floor(Math.random() * unrevealedIndexes.length)];
      updatedDisplay[revealIndex] = word[revealIndex];
    }

    setDisplayWord(updatedDisplay.join(" "));
    setHints((prev) => prev - 1);
  };

  const watchAdForHint = () => {
    window.open(AD_URL, "_blank");
    setTimeout(() => {
      setHints(hints + 1);
      setMessage("✅ You earned an extra hint!");
    }, 5000); // Simulating ad watch delay
  };

  const watchAdForExtraPlay = () => {
    window.open(AD_URL, "_blank");
    setTimeout(() => {
      setAdsWatched(adsWatched + 1);
      setGameOver(false);
      setTries(5);
      setHints(1);
      fetchNewWord();
      setMessage("✅ You can play again!");
    }, 5000); // Simulating ad watch delay
  };

  return (
    <div className={`mx-auto p-5 text-center mid-part flex items-center flex-col justify-center w-full ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h2 className="text-2xl font-bold mb-3">Daily Word Challenge</h2>
      <p className="text-lg mb-2">Guess the word in 5 tries!</p>
      <p className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>Streak: {streak} 🔥</p>
      <p className="text-lg mt-3">{displayWord}</p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={`word-input p-2 border rounded mt-3 ${darkMode ? "text-white placeholder:text-white" : "text-black placeholder:text-black"}`}
        placeholder="Enter your guess..."
        disabled={gameOver || tries === 0}
      />
      <div className="flex items-center justify-between">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 mt-3 rounded disabled:opacity-50"
          disabled={gameOver || tries === 0}
        >
          Submit
        </button>

        <button
          onClick={revealHint}
          className={`px-4 py-2 mt-2 ml-2 rounded ${
            hints > 0 ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
          }`}
        >
          {hints > 0 ? `Use Hint (${hints} left)` : "Watch Ad for Hint"}
        </button>
      </div>

      <p className="mt-3">Tries left: {tries}</p>
      <p className={` ${darkMode ? "text-white" : "text-gray-600"}`}>Hints left: {hints}</p>
      <p className="mt-3 font-semibold">{message}</p>

      {gameOver && (
        <button
          onClick={watchAdForExtraPlay}
          className="bg-yellow-500 text-white px-4 py-2 mt-3 rounded"
        >
          Watch Ad to Play Again
        </button>
      )}
    </div>
  );
}
