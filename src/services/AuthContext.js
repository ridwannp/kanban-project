import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Ambil data dari Firestore (termasuk role)
        const docRef = doc(db, "user", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setCurrentUser({ ...user, ...userData }); // merge auth user + firestore data
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = async (email, password, role) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Default name atau bisa dari form
    await updateProfile(user, { displayName: email.split("@")[0] });

    await setDoc(doc(db, "user", user.uid), {
      uid: user.uid,
      name: email.split("@")[0],
      email: user.email,
      role: role,
      createdAt: new Date(),
    });

    // Set user lengkap ke state
    setCurrentUser({
      uid: user.uid,
      name: email.split("@")[0],
      email: user.email,
      role: role,
    });
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
