// components/Auth.js
import { auth, provider } from "@/lib/firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";

export default function Auth({ user }) {
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      {user ? (
        <button 
          onClick={() => signOut(auth)}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      ) : (
        <button 
          onClick={signIn}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}
