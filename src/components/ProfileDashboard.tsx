import { BookOpen, DoorOpen, MessageSquare, Sparkles, Trophy, UserRound, ArrowRight, Users, BadgeCheck } from 'lucide-react';
import type { StudyRoom, User } from '../types';

interface ProfileDashboardProps {
  user: User;
  rooms: StudyRoom[];
  onSelectRoom: (room: StudyRoom) => void;
}

const sectionIcons = [
  { key: 'profile', icon: UserRound, label: 'Profile' },
  { key: 'achievements', icon: Trophy, label: 'Achievements' },
  { key: 'conversations', icon: MessageSquare, label: 'Conversations' },
  { key: 'rooms', icon: DoorOpen, label: 'Rooms' }
] as const;

export default function ProfileDashboard({ user, rooms, onSelectRoom }: ProfileDashboardProps) {
  const initials = user.displayName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-[calc(100vh-88px)] bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_45%,_#111827)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-4">
        <aside className="hidden w-20 shrink-0 flex-col justify-between rounded-[28px] border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-black/20 lg:flex">
          <div className="space-y-3">
            <div className="rounded-2xl bg-indigo-600/90 p-3 text-white shadow-lg shadow-indigo-600/20">
              <Sparkles size={18} />
            </div>
            {sectionIcons.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  type="button"
                  className="flex w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-slate-400 transition hover:border-indigo-500/40 hover:text-white"
                  title={section.label}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-2 text-center text-[11px] uppercase tracking-[0.25em] text-slate-500">
            Kvantum
          </div>
        </aside>

        <section className="flex-1 rounded-[32px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-xl font-semibold text-white">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="h-16 w-16 rounded-2xl object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Profile</p>
                <h2 className="text-2xl font-semibold text-white">{user.displayName}</h2>
                <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">
              <div className="flex items-center gap-2 font-semibold">
                <BadgeCheck size={16} /> Focus streak: 7 days
              </div>
              <p className="mt-1 text-xs text-slate-400">Your calm study rhythm is building strong momentum.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                  <Trophy size={16} /> Achievements
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    'Completed 3 focus sprints this week',
                    'Joined 2 collaborative rooms',
                    'Shared 5 study milestones'
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                  <MessageSquare size={16} /> Conversations
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { title: 'Physics group', preview: 'We are meeting at 7 PM for a quick recap.' },
                    { title: 'Coding sprint', preview: 'Reminder: bring your notes and questions.' },
                    { title: 'Exam prep', preview: 'Shared flashcards for tomorrow’s review.' }
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-400">{item.preview}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                  <DoorOpen size={16} /> Your rooms
                </div>
                <div className="mt-4 space-y-3">
                  {rooms.length > 0 ? rooms.slice(0, 4).map((room) => (
                    <div key={room.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{room.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                          <Users size={12} /> {room.membersCount || 1} studying
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectRoom(room)}
                        className="flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-500/20"
                      >
                        Open <ArrowRight size={12} />
                      </button>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-400">
                      No rooms yet. Create one and it will appear here.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                  <BookOpen size={16} /> Study pulse
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">Focus sessions: 12 this month</div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">Shared notes: 8 this week</div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">Room balance: steady and productive</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
