import React, { createContext, useEffect, useState } from 'react'
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from "../firebase/firebase.config"

export const AuthContext = createContext();

const auth = app ? getAuth(app) : null;
const googleProvider = auth ? new GoogleAuthProvider() : null;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    if (!auth) return Promise.reject(new Error("Firebase not configured"));
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signUpWithGmail = () => {
    if (!auth || !googleProvider) return Promise.reject(new Error("Firebase not configured"));
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const login = (email, password) => {
    if (!auth) return Promise.reject(new Error("Firebase not configured"));
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  };

  const updateUserProfile = (name, photoURL) => {
    if (!auth?.currentUser) return Promise.reject(new Error("Not signed in"));
    return updateProfile(auth.currentUser, { displayName: name, photoURL });
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

    const authInfo = {
        user,
        createUser,
        signUpWithGmail,
        login,
        logOut,
        updateUserProfile,
        loading
    }
  return (
    <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider