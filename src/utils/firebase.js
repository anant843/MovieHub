import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDiRgT_PWz6EpHqLbPbdGH64pv5YnE7sjQ",
  authDomain: "netflixgpt-9b853.firebaseapp.com",
  projectId: "netflixgpt-9b853",
  storageBucket: "netflixgpt-9b853.firebasestorage.app",
  messagingSenderId: "611547930717",
  appId: "1:611547930717:web:a928293f08e65e230badb4",
  measurementId: "G-G8Y426979K",
};

const app = initializeApp(firebaseConfig);

// Analytics is optional and only works in browser environments
try {
  getAnalytics(app);
} catch (e) {
  console.warn("Firebase Analytics could not be initialized:", e.message);
}

export const auth = getAuth(app);
