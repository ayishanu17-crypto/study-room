import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { ChatMessage, StudyRoom, User } from '../types';
import { sendMessage, subscribeToMessages } from '../services/studyService';
import Whiteboard from './Whiteboard';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, MessageSquare, Edit3, Clock, Brain, Users, CheckCircle2 } from 'lucide-react';

interface RoomWorkspaceProps {
  room: StudyRoom;
  user: User;
  initialTab?: 'whiteboard' | 'pomodoro' | 'flashcards' | 'chat';
  onLeave: () => void;
}

export default function RoomWorkspace({ room, user, onLeave, initialTab = 'whiteboard' }: RoomWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'whiteboard' | 'pomodoro' | 'flashcards' | 'chat'>(initialTab);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [taskText, setTaskText] = useState('Preparing for exams / Coding');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isDark = true;
  const shellClass = 'bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_44%,_#111827)] text-slate-100';
  const headerClass = 'border-slate-800 bg-slate-900/90 text-slate-100 shadow-slate-950/40';
  const panelClass = 'bg-slate-900/80 border-slate-800 text-slate-100';
  const softPanelClass = 'bg-slate-950/70 border-slate-800 text-slate-200';
  const mutedClass = 'text-slate-400';
  const tabClass = 'bg-slate-800 text-indigo-400 shadow-sm';
  const tabInactiveClass = 'text-slate-400 hover:text-slate-100';
  const inputClass = 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500';

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(room.id, (nextMessages) => {
      setMessages(nextMessages);
    });

    return () => unsubscribe();
  }, [room.id]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const text = draftMessage.trim();
    if (!text) return;

    await sendMessage(room.id, user.uid, user.displayName, text);
    setDraftMessage('');
  };

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isCancelled = false;

    const startCamera = async () => {
      if (!isVideoOn) {
        setCameraError('');
        setCameraStream(null);
        return;
      }

      try {
        activeStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (isCancelled) {
          activeStream.getTracks().forEach((track) => track.stop());
          return;
        }

        setCameraStream(activeStream);
        setCameraError('');
      } catch (error) {
        console.error('Camera access failed:', error);
        setCameraError('Camera access was blocked. Allow camera permission to enable your preview.');
        setCameraStream(null);
      }
    };

    void startCamera();

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOn]);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (currentVideo) {
      currentVideo.srcObject = cameraStream;
      if (cameraStream) {
        currentVideo.play().catch((err) => {
          console.warn('Video play interrupted:', err);
        });
      }
    }

    return () => {
      if (currentVideo) {
        currentVideo.srcObject = null;
      }
    };
  }, [cameraStream]);

  const flashcards = [
    {
      question: 'What is the time complexity of a balanced binary search tree insertion?',
      answer: 'O(log n) on average because the height stays balanced.'
    },
    {
      question: 'What is the main purpose of a pomodoro sprint?',
      answer: 'It helps you focus in short, distraction-free bursts with planned breaks.'
    },
    {
      question: 'Why do study rooms improve productivity?',
      answer: 'They create accountability, structure, and shared momentum.'
    },
    {
      question: 'What should you do first when joining a focus room?',
      answer: 'Set a clear goal, mute distractions, and open the tool you need.'
    }
  ];

  const currentFlashcard = flashcards[currentFlashcardIndex];

  useEffect(() => {
    setIsFlipped(false);
  }, [currentFlashcardIndex]);

  // Participants mimicking the StudyStream / Live Study Room silent accountability grid
  const participants = [
    { id: user.uid, name: `${user.displayName} (You)`, isSelf: true, camera: isVideoOn, task: taskText },
    { id: '2', name: 'Sophia Chen', isSelf: false, camera: true, task: 'Preparing for Medical Boards' },
    { id: '3', name: 'Liam Vance', isSelf: false, camera: true, task: 'Data Structures & Algorithms' },
    { id: '4', name: 'Ananya Sharma', isSelf: false, camera: false, task: 'UPSC CSE Target 2026' },
    { id: '5', name: 'Lucas Miller', isSelf: false, camera: true, task: 'Writing Research Paper' },
  ];

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${shellClass}`}>
      
      {/* Top Header Bar */}
      <header className={`border-b px-6 py-3 flex items-center justify-between shrink-0 shadow-xs ${headerClass}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLeave}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
          >
            <ArrowLeft size={14} /> Leave Room
          </button>
          <div>
            <h1 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {room.name} <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h1>
            <span className={`text-[10px] font-mono ${mutedClass}`}>Silent Focus Mode • Mics Off</span>
          </div>
        </div>

        {/* Room Navigation Tabs */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
          <button 
            onClick={() => setActiveTab('whiteboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'whiteboard' ? tabClass : tabInactiveClass}`}
          >
            <Edit3 size={13} /> Whiteboard
          </button>
          <button 
            onClick={() => setActiveTab('pomodoro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'pomodoro' ? tabClass : tabInactiveClass}`}
          >
            <Clock size={13} /> Pomodoro
          </button>
          <button 
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'flashcards' ? tabClass : tabInactiveClass}`}
          >
            <Brain size={13} /> Flashcards
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'chat' ? tabClass : tabInactiveClass}`}
          >
            <MessageSquare size={13} /> Chat
          </button>
        </div>

        <div className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
          <Users size={14} className="text-indigo-600" /> {participants.length} Studying Live
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Workspace Panel */}
        <main className={`flex-1 p-6 flex flex-col overflow-y-auto ${isDark ? 'bg-slate-950/40' : 'bg-[#f8f9fc]'}`}>
{activeTab === 'whiteboard' && (
            <div className="flex-1 min-h-0 overflow-hidden rounded-3xl border border-slate-800 shadow-sm">
              <Whiteboard />
            </div>
          )}

          {activeTab === 'pomodoro' && (
            <div className={`flex-1 border rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 shadow-sm ${panelClass}`}>
              <span className="text-xs text-indigo-600 font-mono tracking-widest uppercase">Synced Focus Timer</span>
              <div className={`text-7xl font-extrabold font-mono tracking-tighter ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{formatTime(timeLeft)}</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRunning((current) => !current)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  {isRunning ? 'Pause Focus' : 'Start Focus Session'}
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setTimeLeft(25 * 60);
                  }}
                  className={`px-4 py-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className={`flex-1 border rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 shadow-sm ${panelClass}`}>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">
                <Brain size={14} /> Active recall deck
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <button
                  type="button"
                  onClick={() => setCurrentFlashcardIndex((current) => (current - 1 + flashcards.length) % flashcards.length)}
                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-slate-800"
                >
                  Previous
                </button>
                <span>{currentFlashcardIndex + 1}/{flashcards.length}</span>
                <button
                  type="button"
                  onClick={() => setCurrentFlashcardIndex((current) => (current + 1) % flashcards.length)}
                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsFlipped((current) => !current)}
                className={`border p-8 rounded-2xl max-w-md w-full text-center space-y-3 shadow-xs transition-all ${softPanelClass}`}
              >
                <span className="text-[10px] text-indigo-600 font-mono uppercase tracking-wider">Tap to flip</span>
                <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {isFlipped ? `Answer: ${currentFlashcard.answer}` : currentFlashcard.question}
                </p>
                <p className={`text-xs pt-4 border-t ${mutedClass}`}>
                  {isFlipped ? 'Nice work. Try the next card.' : 'Flip to reveal the answer.'}
                </p>
              </button>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className={`flex-1 border rounded-3xl p-6 flex flex-col justify-between shadow-sm ${panelClass}`}>
              <div className={`text-xs font-bold pb-3 border-b ${isDark ? 'text-slate-200 border-slate-800' : 'text-slate-700 border-slate-100'}`}>Room Community Check-In</div>
              <div className={`flex-1 py-4 text-xs text-center flex flex-col justify-end gap-2 ${mutedClass}`}>
                {messages.length > 0 ? (
                  <div className="max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-slate-200/60 p-3 text-left">
                    {messages.map((message) => (
                      <div key={message.id} className={`rounded-xl px-3 py-2 text-xs ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-50 text-slate-700'}`}>
                        <div className="font-semibold">{message.userName}</div>
                        <div className="mt-1">{message.text}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>Quiet space. Keep chat focused on study goals and accountability.</div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
                <input 
                  type="text" 
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  placeholder="Share a milestone or encouragement..." 
                  className={`flex-1 border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-600 ${inputClass}`}
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl text-xs font-semibold cursor-pointer">Send</button>
              </form>
            </div>
          )}
        </main>

        {/* Right Sidebar: StudyStream / Live Study Room Grid Feed */}
        <aside className={`w-88 border-l flex flex-col shrink-0 ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              <Users size={14} className="text-indigo-600" /> Focus Grid Feed
            </h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isDark ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>Live</span>
          </div>

          {/* Participant Grid Cards */}
          <div className={`flex-1 p-4 overflow-y-auto space-y-3 ${isDark ? 'bg-slate-950/40' : 'bg-[#fafbfd]'}`}>
            {participants.map((p) => (
              <div key={p.id} className={`border rounded-2xl p-3.5 relative flex flex-col justify-between h-40 shadow-xs overflow-hidden group ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                
                {/* Camera Feed Area */}
                <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-slate-800/80' : 'bg-slate-100'}`}>
                  {p.isSelf && isVideoOn && cameraStream ? (
                    <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                  ) : p.camera ? (
                    <div className="text-slate-400 text-xs font-mono flex flex-col items-center gap-1.5">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${isDark ? 'bg-indigo-500/10 border-indigo-400/30' : 'bg-indigo-50 border-indigo-100'}`}>
                        <Video size={18} className="text-indigo-600 animate-pulse" />
                      </div>
                      <span className={`text-[10px] ${mutedClass}`}>Camera Feed Active</span>
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shadow-xs ${isDark ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-700'}`}>
                      {p.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Top Overlay: Goal / Task Tag */}
                <div className="z-10 flex justify-between items-start">
                  <div className={`backdrop-blur-md text-[10px] px-2.5 py-1 rounded-xl border flex items-center gap-1.5 shadow-xs max-w-52 truncate ${isDark ? 'bg-slate-900/90 text-slate-200 border-slate-700' : 'bg-white/90 text-slate-700 border-slate-200'}`}>
                    <CheckCircle2 size={11} className="text-indigo-600 shrink-0" />
                    <span className="truncate">{p.task}</span>
                  </div>
                </div>

                {/* Bottom Overlay: Name & Camera indicator */}
                <div className={`z-10 flex items-center justify-between backdrop-blur-md px-3 py-1.5 rounded-xl border shadow-xs ${isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{p.name}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${mutedClass}`}>
                    {p.camera ? <Video size={12} className="text-indigo-600" /> : <VideoOff size={12} className="text-slate-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* User Task & Camera Controls Footer */}
          <div className={`p-4 border-t space-y-3 ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
            <div className="space-y-1">
              <label className={`text-[10px] uppercase font-bold tracking-wider ${mutedClass}`}>Set Your Focus Goal</label>
              <input 
                type="text" 
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="What are you working on right now?"
                className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-600 ${inputClass}`}
              />
            </div>

            {cameraError ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-300">
                {cameraError}
              </div>
            ) : null}

            <div className="flex items-center justify-center gap-3 pt-1">
              <button 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${isVideoOn ? (isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200') : (isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600')}`}
              >
                {isVideoOn ? <Video size={14} /> : <VideoOff size={14} />} {isVideoOn ? 'Cam On' : 'Cam Off'}
              </button>
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${isMicOn ? (isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200') : (isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600')}`}
              >
                {isMicOn ? <Mic size={14} /> : <MicOff size={14} />} {isMicOn ? 'Unmuted' : 'Muted'}
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}