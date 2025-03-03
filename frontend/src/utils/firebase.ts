import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqWO-8otL5m5wKHt3eQGu2UOSp9AzVwe0",
  authDomain: "blogqandu.firebaseapp.com",
  projectId: "blogqandu",
  storageBucket: "blogqandu.firebasestorage.app",
  messagingSenderId: "408120003046",
  appId: "1:408120003046:web:9af4b347935b49b1246e27",
  measurementId: "G-234N5J6NJT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);