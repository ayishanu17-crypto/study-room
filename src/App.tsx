import React, { useState, useEffect } from 'react';

type RoomTab = 'whiteboard' | 'pomodoro' | 'flashcards' | 'chat';
import type { User, StudyRoom } from './types';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from './services/firebase';
import { fetchRooms, createRoom, subscribeToRoomsByHost } from './services/studyService';
import RoomWorkspace from './components/RoomWorkspace';
import StudyHubDashboard from './components/StudyHubDashboard';
import ProfileDashboard from './components/ProfileDashboard';
import ExploreRooms from './components/ExploreRooms';
import Leaderboard from './components/Leaderboard';
import Conversations from './components/Conversations';
import {
  LogIn,
  LogOut,
  Plus,
  Users,
  ArrowRight,
  BookOpen,
  Layers,
  Flame,
  Compass,
  Sparkles,
  TimerReset,
  PenTool,
  Trophy,
  ShieldCheck,
  UserRound
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentRoom, setCurrentRoom] = useState<StudyRoom | null>(null);
const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [myRooms, setMyRooms] = useState<StudyRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState<'explore' | 'create'>('explore');
  const [currentView, setCurrentView] = useState<'home' | 'how-it-works' | 'rules'>('home');
  const [showStudyHub, setShowStudyHub] = useState(false);
  const [showExploreRooms, setShowExploreRooms] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingRoom, setPendingRoom] = useState<StudyRoom | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [roomError, setRoomError] = useState('');
  const [roomTab, setRoomTab] = useState<RoomTab>('whiteboard');

useEffect(() => {
    let unsubscribeMyRooms: (() => void) | null = null;

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Anonymous Student',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined
        });

        if (unsubscribeMyRooms) unsubscribeMyRooms();
        unsubscribeMyRooms = subscribeToRoomsByHost(firebaseUser.uid, setMyRooms);
      } else {
        setUser(null);
        setMyRooms([]);
        if (unsubscribeMyRooms) {
          unsubscribeMyRooms();
          unsubscribeMyRooms = null;
        }
      }
      setLoading(false);
    });

    try {
      window.localStorage.setItem('kvantum-theme', 'dark');
    } catch (error) {
      console.warn('Unable to persist theme preference:', error);
    }

    fetchRooms().then(setRooms).catch(console.error);

    return () => {
      unsubscribe();
      if (unsubscribeMyRooms) unsubscribeMyRooms();
    };
  }, []);

useEffect(() => {
    if (user) {
      if (pendingRoom) {
        const room = pendingRoom;
        setPendingRoom(null);
        setCurrentRoom(room);
        setRoomTab('whiteboard');
        setShowStudyHub(false);
        setShowExploreRooms(false);
        setShowProfileSettings(false);
        setShowConversations(false);
        setShowLeaderboard(false);
      } else {
        setShowStudyHub(true);
        setShowProfileSettings(false);
        setShowConversations(false);
        setShowLeaderboard(false);
        setCurrentView('home');
      }
      setShowAuth(false);
      setShowExploreRooms(false);
    } else {
      setShowStudyHub(false);
      setShowProfileSettings(false);
      setShowConversations(false);
      setShowLeaderboard(false);
    }
  }, [user, pendingRoom]);

const handleGoogleLogin = async () => {
    try {
      setAuthError('');
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
      setShowAuth(false);
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError('Google sign-in failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please enter both your email and password.');
      return;
    }

    try {
      setAuthError('');
      setAuthLoading(true);
      if (authMode === 'signin') {
        await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword);
} else {
        await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword);
      }
      setShowAuth(false);
      setAuthEmail('');
      setAuthPassword('');
    } catch (error: unknown) {
      console.error('Email auth failed:', error);
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError('Authentication failed. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
} catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setCurrentRoom(null);
      setShowStudyHub(false);
      setShowExploreRooms(false);
      setShowProfileSettings(false);
      setShowConversations(false);
      setShowLeaderboard(false);
      setRoomError('');
    }
  };

const openRoom = async (room: StudyRoom, tab: RoomTab = 'whiteboard') => {
    setCurrentRoom(room);
    setRoomTab(tab);
    setShowStudyHub(false);
    setShowExploreRooms(false);
    setShowProfileSettings(false);
    setShowConversations(false);
    setShowLeaderboard(false);
  };

  const createAndOpenRoom = async (roomName: string, tab: RoomTab = 'whiteboard') => {
    if (!user) return;

    try {
      setRoomError('');
      const roomId = await createRoom(roomName.trim(), user.uid);
      const newRoom: StudyRoom = {
        id: roomId,
        name: roomName.trim(),
        hostId: user.uid,
        createdAt: Date.now(),
        membersCount: 1
      };
setRooms((prev) => [newRoom, ...prev]);
      setMyRooms((prev) => [newRoom, ...prev]);
      setNewRoomName('');
      await openRoom(newRoom, tab);
    } catch (err) {
      console.error('Error creating room:', err);
      setRoomError('We could not create that room right now. Please try again.');
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !user) return;
    await createAndOpenRoom(newRoomName.trim());
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-xs font-mono uppercase tracking-[0.35em] text-indigo-400">
        Initializing Kvantum Room...
      </div>
    );
  }

  if (currentRoom && user) {
    return (
      <RoomWorkspace
        room={currentRoom}
        user={user}
        onLeave={() => {
          setCurrentRoom(null);
          setShowStudyHub(true);
        }}
        initialTab={roomTab}
      />
    );
  }

  if (showProfileSettings && user) {
    return (
      <ProfileDashboard
        user={user}
        rooms={rooms}
        myRooms={myRooms}
        onSelectRoom={(room) => {
          void openRoom(room, 'whiteboard');
        }}
        onOpenConversations={() => setShowConversations(true)}
        onBack={() => setShowProfileSettings(false)}
        onSignOut={async () => {
          await handleLogout();
          setShowProfileSettings(false);
          setShowStudyHub(false);
        }}
      />
    );
  }

  if (showConversations && user) {
    return (
      <Conversations
        user={user}
        rooms={myRooms.length > 0 ? myRooms : rooms}
        onBack={() => setShowConversations(false)}
      />
    );
  }

if (showLeaderboard && user) {
    return (
      <Leaderboard
        currentUserId={user.uid}
        currentUserName={user.displayName}
        onBack={() => setShowLeaderboard(false)}
      />
    );
  }

if (showExploreRooms) {
    return (
      <ExploreRooms
        user={user}
        rooms={rooms}
        onSelectRoom={(room) => {
          if (user) {
            void openRoom(room, 'whiteboard');
          }
        }}
        onBack={() => setShowExploreRooms(false)}
        onSignIn={(room) => {
          setPendingRoom(room);
          setShowAuth(true);
        }}
      />
    );
  }

  if (showStudyHub && user) {
    return (
<StudyHubDashboard
        user={user}
        rooms={rooms}
        myRooms={myRooms}
        roomError={roomError}
        onClearRoomError={() => setRoomError('')}
        onSelectRoom={(room) => {
          void openRoom(room, 'whiteboard');
        }}
        onCreateRoom={async (roomName) => {
          await createAndOpenRoom(roomName, 'whiteboard');
        }}
        onOpenTool={async (tab) => {
          if (rooms.length > 0) {
            await openRoom(rooms[0], tab);
          } else {
            await createAndOpenRoom('Quick Focus Room', tab);
          }
        }}
        onOpenProfile={() => setShowProfileSettings(true)}
        onOpenConversations={() => setShowConversations(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onSignOut={async () => {
          await handleLogout();
          setShowStudyHub(false);
        }}
      />
    );
  }

  const featureCards = [
    {
      icon: TimerReset,
      title: 'Pomodoro focus',
      description: 'Stay in flow with shared countdowns and study sprints.'
    },
    {
      icon: PenTool,
      title: 'Live whiteboard',
      description: 'Sketch concepts together in real time without leaving the room.'
    },
    {
      icon: BookOpen,
      title: 'Flashcards & quizzes',
      description: 'Turn review into active recall with instant practice modes.'
    },
    {
      icon: Trophy,
      title: 'Friendly competition',
      description: 'Keep momentum high with room streaks and leaderboards.'
    }
  ];

  const isDark = true;
  const shellClass = 'bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_32%),linear-gradient(135deg,_#020617,_#0f172a_45%,_#111827)] text-slate-100';
  const headerClass = 'border-white/10 bg-slate-950/60';
  const panelClass = 'border-white/10 bg-slate-900/70 shadow-black/20';
  const softPanelClass = 'border-slate-800/80 bg-slate-950/70';
  const mutedTextClass = 'text-slate-400';
  const secondaryTextClass = 'text-slate-300';
  const headingTextClass = 'text-white';
  const inputClass = 'border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500';

  const renderContent = () => {
    if (currentView === 'how-it-works') {
      return (
        <section className={`rounded-[32px] border p-8 shadow-lg backdrop-blur ${panelClass} ${isDark ? 'shadow-black/20' : 'shadow-slate-200/50'}`}>
          <div className="max-w-4xl space-y-6">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">How it works</div>
            <h2 className={`text-3xl font-semibold ${headingTextClass}`}>Everything you need to study with intention.</h2>
            <p className={`text-lg leading-8 ${secondaryTextClass}`}>
              Kvantum Room is a calm virtual study space where people join live rooms, stay focused with shared timers, and work together through whiteboards, flashcards, and quick progress checks.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                'Open a room and choose your focus goal.',
                'Join with Google or email and start your session instantly.',
                'Use the room tools to stay on task and review material.',
                'Leave with a clear sense of progress and a stronger study routine.'
              ].map((item) => (
                <div key={item} className={`rounded-2xl border p-4 ${softPanelClass}`}>
                  <p className={`text-sm leading-7 ${secondaryTextClass}`}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (currentView === 'rules') {
      return (
        <section className={`rounded-[32px] border p-8 shadow-lg backdrop-blur ${panelClass} ${isDark ? 'shadow-black/20' : 'shadow-slate-200/50'}`}>
          <div className="max-w-4xl space-y-6">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">Rules</div>
            <h2 className={`text-3xl font-semibold ${headingTextClass}`}>A respectful space for serious focus.</h2>
            <div className="space-y-3">
              {[
                'Stay respectful and keep the room calm and distraction-free.',
                'Mute yourself and keep your camera on only when you are comfortable doing so.',
                'Use the room for studying, reviewing, and focused work.',
                'Avoid spam, loud interruptions, or unrelated chatting during sessions.'
              ].map((rule) => (
                <div key={rule} className={`rounded-2xl border p-4 ${softPanelClass}`}>
                  <p className={`text-sm leading-7 ${secondaryTextClass}`}>{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    return (
      <>
      <section className={`grid items-center gap-8 rounded-[32px] border p-6 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-10 ${panelClass}`}> 
        <div className="space-y-6">
          <div className={`inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-200 ${isDark ? '' : 'text-indigo-700'}`}>
            <Sparkles size={14} /> Designed for focused study circles
          </div>

          <div className="space-y-4">
            <h1 className={`max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl ${headingTextClass}`}>
              Study with friends. Focus like a pro.
            </h1>
            <p className={`max-w-xl text-lg leading-8 ${secondaryTextClass}`}>
              Join live rooms, share progress, and power through your goals with smart tools for pomodoro sessions, whiteboards, quizzes, and more.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              <Plus size={16} /> Start a room
            </button>
<button
              onClick={() => setShowExploreRooms(true)}
              className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${isDark ? 'border-slate-700 bg-slate-800/70 text-slate-200 hover:border-indigo-400/40 hover:text-white' : 'border-slate-300 bg-white/90 text-slate-700 hover:border-indigo-400/40 hover:text-slate-900'}`}
            >
              <Compass size={16} /> Explore rooms
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className={`rounded-2xl border p-4 ${softPanelClass}`}>
              <div className={`text-2xl font-semibold ${headingTextClass}`}>{rooms.length}</div>
              <div className={`mt-1 text-sm ${mutedTextClass}`}>Active study rooms</div>
            </div>
            <div className={`rounded-2xl border p-4 ${softPanelClass}`}>
              <div className={`text-2xl font-semibold ${headingTextClass}`}>24/7</div>
              <div className={`mt-1 text-sm ${mutedTextClass}`}>Live accountability</div>
            </div>
            <div className={`rounded-2xl border p-4 ${softPanelClass}`}>
              <div className={`text-2xl font-semibold ${headingTextClass}`}>100%</div>
              <div className={`mt-1 text-sm ${mutedTextClass}`}>Focus-first design</div>
            </div>
          </div>
        </div>

        <div className={`rounded-[28px] border p-6 shadow-inner ${softPanelClass} ${isDark ? 'shadow-black/20' : 'shadow-slate-200/60'}`}>
          <div className="flex items-center justify-between">
            <div>
<div className="text-sm font-semibold text-indigo-400">Live room preview</div>
              <div className={`mt-1 text-xl font-semibold ${headingTextClass}`}>Tonight's deep work sprint</div>
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
              Live
            </div>
          </div>

<div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80"
              alt="Study room preview"
              className="h-44 w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="mt-6 space-y-3">
            <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'}`}>
              <div className="flex items-center justify-between">
                <div className={`font-medium ${headingTextClass}`}>AI prep + code review</div>
                <div className={`flex items-center gap-1 text-sm ${mutedTextClass}`}>
                  <Users size={14} className="text-indigo-400" /> 8 studying
                </div>
              </div>
              <div className={`mt-3 flex items-center gap-2 text-sm ${mutedTextClass}`}>
                <Flame size={14} className="text-amber-400" /> 3 focus blocks left
              </div>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'}`}>
              <div className={`flex items-center gap-2 text-sm ${secondaryTextClass}`}>
                <ShieldCheck size={14} className="text-emerald-400" /> Shared goals, zero distractions
              </div>
              <div className={`mt-2 flex items-center gap-2 text-sm ${mutedTextClass}`}>
                <BookOpen size={14} className="text-cyan-400" /> Flashcards synced to the room
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className={`rounded-[24px] border p-5 shadow-lg backdrop-blur ${panelClass} ${isDark ? 'shadow-black/20' : 'shadow-slate-200/50'}`}>
              <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
                <Icon size={18} />
              </div>
              <h3 className={`mt-4 text-lg font-semibold ${headingTextClass}`}>{feature.title}</h3>
              <p className={`mt-2 text-sm leading-7 ${mutedTextClass}`}>{feature.description}</p>
            </div>
          );
        })}
      </section>

      <section className={`rounded-[32px] border p-8 shadow-lg backdrop-blur ${panelClass} ${isDark ? 'shadow-black/20' : 'shadow-slate-200/50'}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">About Kvantum Room</div>
            <h2 className={`mt-3 text-3xl font-semibold ${headingTextClass}`}>A calm digital study room built for focus and accountability.</h2>
            <p className={`mt-4 text-lg leading-8 ${secondaryTextClass}`}>
              Kvantum Room brings together live study circles, shared focus tools, and simple room-based collaboration so students can stay productive without noise or distraction.
            </p>
          </div>
<button
            onClick={() => setShowExploreRooms(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <ArrowRight size={16} /> See others live
          </button>
        </div>
      </section>

      <section id="rules" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`rounded-[28px] border p-6 shadow-lg backdrop-blur ${panelClass} ${isDark ? 'shadow-black/20' : 'shadow-slate-200/50'}`}>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
            <Sparkles size={14} /> Why students love it
          </div>
          <div className="mt-5 space-y-4">
            <div className={`rounded-2xl border p-4 ${softPanelClass}`}>
              <div className={`font-semibold ${headingTextClass}`}>Built for real momentum</div>
              <p className={`mt-1 text-sm leading-7 ${mutedTextClass}`}>
                Turn scattered study sessions into a shared routine with clear goals and instant visibility.
              </p>
            </div>
            <div className={`rounded-2xl border p-4 ${softPanelClass}`}>
              <div className={`font-semibold ${headingTextClass}`}>Less friction, more focus</div>
              <p className={`mt-1 text-sm leading-7 ${mutedTextClass}`}>
                Start a room in seconds and jump into your workflow without extra setup.
              </p>
            </div>
            <div className={`rounded-2xl border p-4 ${softPanelClass}`}>
              <div className={`font-semibold ${headingTextClass}`}>Stay connected anywhere</div>
              <p className={`mt-1 text-sm leading-7 ${mutedTextClass}`}>
                Host your study circle from a laptop, tablet, or phone and keep everyone aligned.
              </p>
            </div>
          </div>
        </div>

        <div id="contact-us" className={`rounded-[28px] border p-6 shadow-lg backdrop-blur ${panelClass} ${isDark ? 'shadow-black/20' : 'shadow-slate-200/50'}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">Join the flow</div>
              <h2 className={`mt-2 text-2xl font-semibold ${headingTextClass}`}>Choose a room or create your own</h2>
            </div>
            <div className={`rounded-full border px-3 py-1 text-sm ${isDark ? 'border-slate-800 bg-slate-950/70 text-slate-400' : 'border-slate-200 bg-white/90 text-slate-600'}`}>
              {rooms.length} active sessions
            </div>
          </div>

<div className={`mt-5 flex items-center gap-2 rounded-2xl border p-1.5 ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white/90'}`}>
            <button
              onClick={() => setShowExploreRooms(true)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'explore' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Compass size={14} /> Explore rooms
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Plus size={14} /> Create room
            </button>
          </div>

          {activeTab === 'explore' && (
            <div className="mt-5 space-y-3">
              {rooms.map((room) => (
                <div key={room.id} className={`flex items-center justify-between rounded-2xl border p-4 transition hover:border-indigo-500/40 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white/90'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <h3 className={`font-semibold ${headingTextClass}`}>{room.name}</h3>
                    </div>
                    <div className={`mt-2 flex items-center gap-3 text-sm ${mutedTextClass}`}>
                      <span className="flex items-center gap-1.5"><Users size={13} className="text-indigo-400" /> {room.membersCount || 1} studying</span>
                      <span className={`font-mono text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>ID: {room.id.slice(0, 6)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!user) {
                        handleGoogleLogin();
                      } else {
                        setCurrentRoom(room);
                      }
                    }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition hover:border-indigo-400/40 hover:bg-indigo-600 hover:text-white ${isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-slate-50 text-slate-700'}`}
                  >
                    {user ? 'Join room' : 'Sign in'} <ArrowRight size={14} />
                  </button>
                </div>
              ))}

              {rooms.length === 0 && (
                <div className={`rounded-2xl border border-dashed p-8 text-center ${isDark ? 'border-slate-700 bg-slate-950/40' : 'border-slate-300 bg-white/80'}`}>
                  <BookOpen size={28} className={`mx-auto ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                  <p className={`mt-3 text-sm font-semibold ${secondaryTextClass}`}>No rooms yet</p>
                  <p className={`mt-1 text-sm ${mutedTextClass}`}>Create the first room and start your study circle.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className={`mt-5 rounded-2xl border p-6 ${softPanelClass}`}>
              <h3 className={`text-lg font-semibold ${headingTextClass}`}>Create a new study room</h3>
              <p className={`mt-2 text-sm leading-7 ${mutedTextClass}`}>
                Give your group a clear goal and open the door to a focused session.
              </p>

              {user ? (
                <form onSubmit={handleCreateRoom} className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <label className={`text-xs font-semibold uppercase tracking-[0.2em] ${mutedTextClass}`}>Room name</label>
                    <input
                      type="text"
                      placeholder="e.g. Advanced Algorithms Prep"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none ${inputClass}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    <Plus size={14} /> Launch room
                  </button>
                </form>
              ) : (
                <div className={`mt-5 rounded-2xl border p-5 text-center ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white/90'}`}>
                  <p className={`text-sm ${mutedTextClass}`}>Sign in to host a room and invite your study circle.</p>
                  <button
                    onClick={handleGoogleLogin}
                    className="mt-4 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Sign in with Google
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="contact-us" className={`rounded-[32px] border p-8 shadow-lg backdrop-blur ${panelClass} ${isDark ? 'shadow-black/20' : 'shadow-slate-200/50'}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">Contact Us</div>
            <h2 className={`mt-3 text-3xl font-semibold ${headingTextClass}`}>Reach out to the Kvantum Room team.</h2>
            <p className={`mt-4 text-lg leading-8 ${secondaryTextClass}`}>
              For questions, support, or ideas, email us and we will get back to you as soon as possible.
            </p>
          </div>
          <div className={`rounded-2xl border p-6 ${softPanelClass}`}>
            <p className={`text-base leading-8 ${secondaryTextClass}`}>Email: hello@kvantumroom.com</p>
            <p className={`mt-2 text-base leading-8 ${secondaryTextClass}`}>Support: support@kvantumroom.com</p>
          </div>
        </div>
      </section>
      </>
    );
  };

  return (
    <div className={`min-h-screen ${shellClass} selection:bg-indigo-500 selection:text-white`}>
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${headerClass}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-2.5 shadow-lg shadow-indigo-500/30">
              <Layers size={20} />
            </div>
            <div>
              <div className={`flex items-center gap-2 text-sm font-semibold ${headingTextClass}`}>
                Kvantum Room
                <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.25em] text-indigo-300">
                  Live
                </span>
              </div>
              <div className={`text-[11px] uppercase tracking-[0.28em] ${mutedTextClass}`}>
                Study together, stay sharp
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-2 md:flex">
              {[
                { label: 'Home', value: 'home' },
                { label: 'How it works', value: 'how-it-works' },
                { label: 'Rules', value: 'rules' }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setCurrentView(item.value as 'home' | 'how-it-works' | 'rules')}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  {item.label}
                </button>
              ))}
              <a
                href="#contact-us"
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                Contact Us
              </a>
            </nav>

            {user ? (
              <div className={`flex items-center gap-3 rounded-2xl border px-3 py-2 shadow-sm ${isDark ? 'border-slate-800/80 bg-slate-900/80' : 'border-slate-200/80 bg-white/90'}`}>
                <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{user.displayName}</span>
                <button
                  onClick={() => {
                    setShowStudyHub(true);
                    setShowProfileSettings(false);
                    setShowConversations(false);
                    setShowLeaderboard(false);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${isDark ? 'border-slate-700/70 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                >
                  <UserRound size={13} /> Study Hub
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300 ${isDark ? 'border-slate-700/70 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
              >
                <LogIn size={14} /> Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuth && !user && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-[28px] border p-6 shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white/95'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-semibold ${headingTextClass}`}>{authMode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  {authMode === 'signin'
                    ? 'Sign in with Google or use your email and password.'
                    : 'Create an account to host rooms and join study sessions.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAuth(false);
                  setAuthError('');
                  setAuthEmail('');
                  setAuthPassword('');
                }}
                className={`rounded-full border px-3 py-1 text-sm ${isDark ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
              >
                Close
              </button>
            </div>

            <div className={`mt-6 flex rounded-2xl border p-1 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError('');
                }}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${authMode === 'signin' ? 'bg-indigo-600 text-white' : isDark ? 'text-slate-400' : 'text-slate-600'}`}
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError('');
                }}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${authMode === 'signup' ? 'bg-indigo-600 text-white' : isDark ? 'text-slate-400' : 'text-slate-600'}`}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleEmailAuth} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className={`text-xs font-semibold uppercase tracking-[0.2em] ${mutedTextClass}`}>Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none ${inputClass}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-xs font-semibold uppercase tracking-[0.2em] ${mutedTextClass}`}>Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none ${inputClass}`}
                />
              </div>

              {authError && (
                <div className={`rounded-2xl border px-3 py-2 text-sm ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {authLoading ? 'Please wait...' : authMode === 'signin' ? 'Sign in with email' : 'Create account'}
              </button>
            </form>

            <div className={`my-5 flex items-center gap-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <div className={`h-px flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <span className="text-xs uppercase tracking-[0.25em]">or</span>
              <div className={`h-px flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              <LogIn size={16} /> Continue with Google
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {renderContent()}
      </main>
    </div>
  );
}