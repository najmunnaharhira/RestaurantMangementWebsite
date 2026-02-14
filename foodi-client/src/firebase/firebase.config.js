// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration (set in .env - copy from .env.example)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

const hasValidConfig =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your-api-key-here" &&
  firebaseConfig.authDomain;

// Initialize Firebase only when config is present (app still loads when .env is missing)
let app = null;
if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (err) {
    console.warn("Firebase init failed:", err.message);
  }
}

export default app;
