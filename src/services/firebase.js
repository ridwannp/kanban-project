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

export const uploadTelegram = async (file, selectedProject) => {
  if (!file) {
    console.error("❌ No file provided");
    return;
  }

  let telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/`; // Gunakan let agar bisa dimodifikasi
  const formData = new FormData();

  const message = `📂 *New File Uploaded!*\n\n🔗 *Judul Project:* ${selectedProject.judul}\n\n *Assignment:* ${selectedProject.assignedTo}\n\n *Event:* ${selectedProject.event}\n\n *Tempat:* ${selectedProject.tempat}\n\n *Deadline:* ${selectedProject.deadline}`;

  formData.append("chat_id", TELEGRAM_CHAT_ID);
  formData.append("caption", message);
  formData.append("parse_mode", "Markdown");

  // Cek tipe file (gambar atau PDF)
  if (file.type.startsWith("image/")) {
    formData.append("photo", file);
    telegramApiUrl += "sendPhoto"; // Endpoint untuk gambar
  } else if (file.type === "application/pdf") {
    formData.append("document", file);
    telegramApiUrl += "sendDocument"; // Endpoint untuk PDF
  } else if (file.type.startsWith("video/")) {
    formData.append("video", file);
    telegramApiUrl += "sendVideo";
  } else {
    console.error("❌ Unsupported file type:", file.type);
    alert("Hanya bisa upload gambar atau PDF!");
    return;
  }

  try {
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.description);
    }
  } catch (error) {
    console.error("❌ Error sending Telegram notification:", error);
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
