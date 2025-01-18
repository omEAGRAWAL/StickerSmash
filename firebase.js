// Import the necessary functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAmBYT4Rk-w50q_EcTNkJ7bn4TzcwaEifU",
  authDomain: "my-store-d252d.firebaseapp.com",
  projectId: "my-store-d252d",
  storageBucket: "my-store-d252d.firebasestorage.app",
  messagingSenderId: "404237039001",
  appId: "1:404237039001:web:8c8cfdf6989fd446064f08",
  measurementId: "G-LQYR2NM945",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const RecaptchaVerifier = RecaptchaVerifier(auth);

// Export the Firebase app, auth, and RecaptchaVerifier for reuse
export { app, auth, RecaptchaVerifier, analytics };
