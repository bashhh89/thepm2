import { initializeApp } from "firebase/app";
import { initializeFirestore, enableMultiTabIndexedDbPersistence, connectFirestoreEmulator } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqWO-8otL5m5wKHt3eQGu2UOSp9AzVwe0",
  authDomain: "blogqandu.firebaseapp.com",
  projectId: "blogqandu",
  storageBucket: "blogqandu.firebasestorage.app",
  messagingSenderId: "408120003046",
  appId: "1:408120003046:web:9af4b347935b49b1246e27",
  measurementId: "G-234N5J6NJT"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom settings
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  cacheSizeBytes: 50000000,
  ignoreUndefinedProperties: true,
});

// Function to initialize Firebase features
export const initializeFirebase = async () => {
  try {
    // Enable offline persistence
    await enableMultiTabIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Persistence disabled: multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Persistence not supported by browser');
      } else {
        throw err;
      }
    });

    // Connect to emulator in development
    if (process.env.NODE_ENV === 'development') {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }

    // Test connection
    await db.waitForPendingWrites();
    
    return { success: true };
  } catch (error: any) {
    console.error('Firebase initialization error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to initialize Firebase'
    };
  }
};

export { db };