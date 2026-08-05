import { ArrowLeft, Users, Video, LogIn } from 'lucide-react';
import type { StudyRoom, User } from '../types';

interface ExploreRoomsProps {
  user: User | null;
  rooms: StudyRoom[];
  onSelectRoom: (room: StudyRoom) => void;
  onBack: () => void;
  onSignIn: () => void;
}

// Free looping sample clips used as "live preview" placeholders for each room.
const sampleClips = [
  'https://assets.mixkit.co/videos/preview/mixkit-person-writing-on-a-notebook-1194-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-man-looking-at-a-laptop-with-a-cup-of-coffee-4878-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-books-and-a-cup-of-tea-on-a-table-4167-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-reading-a-book-in-a-library-1200-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-open-book-with-a-magnifying-glass-4164-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-studying-at-her-desk-4377-large.mp4'
];

// Demo rooms shown when there are no real rooms in the database yet,
// so the explore page always has content/previews to display.
const demoRooms: StudyRoom[] = [
  { id: 'demo-physics', name: 'Physics group revision', hostId: 'demo', createdAt: Date.now(), membersCount: 8 },
  { id: 'demo-coding', name: 'Coding sprint — algorithms', hostId: 'demo', createdAt: Date.now(), membersCount: 5 },
  { id: 'demo-exam', name: 'Exam prep flashcards', hostId: 'demo', createdAt: Date.now(), membersCount: 3 },
  { id: 'demo-history', name: 'History essay focus', hostId: 'demo', createdAt: Date.now(), membersCount: 6 },
  { id: 'demo-math', name: 'Math problem solving', hostId: 'demo', createdAt: Date.now(), membersCount: 4 },
  { id: 'demo-language', name: 'Language practice circle', hostId: 'demo', createdAt: Date.now(), membersCount: 7 }
];

export default function ExploreRooms({ user, rooms, onSelectRoom, onBack, onSignIn }: ExploreRoomsProps) {
  const isDark = true;
  const shellClass = 'bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_44%,_#111827)] text-slate-100';
  const cardClass = 'border-white/10 bg-slate-900/75 shadow-black/20';

  // Show real rooms if any exist, otherwise fall back to demo rooms so the
  // explore page always has live previews to display.
  const displayRooms = rooms.length > 0 ? rooms : demoRooms;

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${shellClass}`}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={14} /> Back to home
          </button>
          <div className="text-left sm:text-right">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Live now</p>
            <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Explore Study Rooms</h1>
            <p className="mt-1 text-sm text-slate-400">
              {displayRooms.length} active {displayRooms.length === 1 ? 'session' : 'sessions'} • previews are live
            </p>
          </div>
        </header>

        {/* Room grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayRooms.map((room, index) => {
            const clip = sampleClips[index % sampleClips.length];
            const isSignedIn = Boolean(user);
            return (
              <div key={room.id} className={`flex flex-col overflow-hidden rounded-[24px] border transition hover:border-indigo-500/40 ${cardClass}`}>
                {/* Video preview */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <video
                    src={clip}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
                  </div>
                </div>

                {/* Room info */}
                <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                  <div>
                    <h3 className="font-semibold text-white">{room.name}</h3>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                      <Users size={13} className="text-indigo-400" /> {room.membersCount || 1} studying
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isSignedIn) {
                        onSelectRoom(room);
                      } else {
                        onSignIn();
                      }
                    }}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    {isSignedIn ? (
                      <>
                        <Video size={14} /> Join room
                      </>
                    ) : (
                      <>
                        <LogIn size={14} /> Sign in to join
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
