// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoN3gzSrP44wdjpY_nsot3HEQ0fgM_eV8",
  authDomain: "kanban-project-a3f8e.firebaseapp.com",
  projectId: "kanban-project-a3f8e",
  storageBucket: "kanban-project-a3f8e.firebasestorage.app",
  messagingSenderId: "467810366668",
  appId: "1:467810366668:web:12d52e8fc95245a4807e69",
  measurementId: "G-EYXQTNEBQ3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
