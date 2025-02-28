import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

  const signup = async (email, password, role) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName: user.name });
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: role,
      createdAt: new Date(),
    });
  };

  const logout = () => auth.signOut();

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
