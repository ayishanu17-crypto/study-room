import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxruvpiOrP__A-MXRBc7zsXfMItJjJOwk",
  authDomain: "study-room-app-308e5.firebaseapp.com",
  projectId: "study-room-app-308e5",
  storageBucket: "study-room-app-308e5.firebasestorage.app",
  messagingSenderId: "179573038368",
  appId: "1:179573038368:web:324c49fc9d32b3eb974b45",
  measurementId: "G-9V3NK58L7L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut };