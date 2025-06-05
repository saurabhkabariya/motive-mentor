import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export const sendMessage = async (text, user) => {
  if (!text.trim()) return; // Prevent empty messages

  try {
    await addDoc(collection(db, "messages"), {
      text,
      senderId: user.uid,
      senderName: user.displayName || "Anonymous",
      avatar: user.photoURL || "/default-avatar.png",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};
