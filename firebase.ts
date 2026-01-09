import * as firebaseApp from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Bypass TypeScript error for initializeApp if type definitions are incorrect/missing
const { initializeApp } = firebaseApp as any;

/**
 * Firebase Config
 * Note: In Vite, environment variables must start with VITE_
 * using (import.meta as any) to avoid type errors if vite/client types are missing
 */
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase only if config is present (prevents crash during copy-paste preview)
let app;
let db: ReturnType<typeof getFirestore> | null = null;

try {
  // Check if we are running with placeholder values to avoid meaningless connection attempts
  // Also checks if the env var was actually replaced in production
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    console.warn("Firebase config is missing or using placeholders. Please check your environment variables.");
  }
} catch (error) {
  console.error("Firebase initialization error", error);
}

export { db };