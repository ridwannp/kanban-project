// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoN3gzSrP44wdjpY_nsot3HEQ0fgM_eV8",
  authDomain: "kanban-project-a3f8e.firebaseapp.com",
  projectId: "kanban-project-a3f8e",
  storageBucket: "kanban-project-a3f8e.appspot.com", // Perbaikan typo
  messagingSenderId: "467810366668",
  appId: "1:467810366668:web:12d52e8fc95245a4807e69",
  measurementId: "G-EYXQTNEBQ3",
};

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "7624468091:AAFBl05r3N-8MfCyJfeuXY5mBeDU7aQ-_Zg";
const TELEGRAM_CHAT_ID = "-4608467109";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to send Telegram Notification
const sendTelegramNotification = async (message) => {
  const telegramApiUrl = `https://api.telegram.org/bot7624468091:AAFBl05r3N-8MfCyJfeuXY5mBeDU7aQ-_Zg/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const result = await response.json();
    if (!result.ok) {
      console.error("Telegram API Error:", result);
    }
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
};

export const addProject = async (projectData) => {
  try {
    const newProjectData = {
      ...projectData,
      taskId: "",
      status: "Todo",
    };

    const docRef = await addDoc(collection(db, "task"), newProjectData);

    const taskId = docRef.id; // Ambil ID Firestore

    // Update taskId ke Firestore
    await updateDoc(doc(db, "task", taskId), { taskId });

    if (newProjectData.status === "Todo") {
      const message = `🚀 *New Project Added!*\n\n📌 *Title:* ${newProjectData.judul}\n🔺 *Priority:* ${newProjectData.priority}\n👤 *Assigned To:* ${newProjectData.assignedTo}\n📅 *Deadline:* ${newProjectData.deadline}`;
      await sendTelegramNotification(message);
    }
  } catch (error) {
    console.error("❌ Error adding project:", error);
  }
};

export { auth, db };
