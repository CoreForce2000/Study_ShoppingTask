// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLf0p8qz1GCB0u8ryb_yZkTP7w82VbVlw",
  authDomain: "shopping-task-phase-1-online.firebaseapp.com",
  projectId: "shopping-task-phase-1-online",
  storageBucket: "shopping-task-phase-1-online.firebasestorage.app",
  messagingSenderId: "703413281266",
  appId: "1:703413281266:web:1adcf8eb900f6cb55e0b6b",
  measurementId: "G-8G6NBQ77NR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };
