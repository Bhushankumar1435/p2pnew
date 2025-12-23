// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Firebase config (from Firebase Console)
const firebaseConfig = {
 
  apiKey: "AIzaSyDfGsUhSN1N5bxtTEnJHzL83ixHAcn4KSg",
 
  authDomain: "coinp2p-a3cbf.firebaseapp.com",
 
  projectId: "coinp2p-a3cbf",
 
  storageBucket: "coinp2p-a3cbf.firebasestorage.app",
 
  messagingSenderId: "357380116630",
 
  appId: "1:357380116630:web:9b80fb8e4b35839e0432b7",
 
  measurementId: "G-NLSCH686HS"
 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export messaging for FCM
export const messaging = getMessaging(app);