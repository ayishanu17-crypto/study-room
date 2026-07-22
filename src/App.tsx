import React, { useState, useEffect } from 'react';
import { User, StudyRoom } from './types';
import { auth, googleProvider, signInWithPopup, signOut } from './services/firebase';
import RoomDashboard from './components/RoomDashboard';
import RoomWorkspace from './components/RoomWorkspace';
import { LogIn } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentRoom, setCurrentRoom] = useState<StudyRoom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Anonymous Student',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Collaborative Study Room</h1>
          <p className="text-sm text-slate-400">Sign in to create or join active study spaces with real-time tools.</p>
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn size={16} /> Continue with Google
          </button>
        </div>
      </div>
    );
  }

  if (currentRoom) {
    return <RoomWorkspace room={currentRoom} user={user} onLeave={() => setCurrentRoom(null)} />;
  }

  return <RoomDashboard user={user} onSelectRoom={(room) => setCurrentRoom(room)} />;
}