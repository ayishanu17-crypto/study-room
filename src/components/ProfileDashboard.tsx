import { useState } from 'react';
import { ArrowLeft, BookOpen, DoorOpen, LogOut, MessageSquare, Sparkles, Trophy, UserRound, Users, BadgeCheck, Award, Flame, Zap, CheckCircle2 } from 'lucide-react';
import type { StudyRoom, User } from '../types';

interface ProfileDashboardProps {
  user: User;
  rooms: StudyRoom[];
  myRooms?: StudyRoom[];
  onSelectRoom: (room: StudyRoom) => void;
  onOpenConversations?: () => void;
  onBack?: () => void;
  onSignOut?: () => void;
}

type ProfileSection = 'profile' | 'achievements' | 'conversations' | 'rooms';

const sectionIcons = [
  { key: 'profile', icon: UserRound, label: 'Profile' },
  { key: 'achievements', icon: Trophy, label: 'Achievements' },
  { key: 'conversations', icon: MessageSquare, label: 'Conversations' },
  { key: 'rooms', icon: DoorOpen, label: 'Rooms' }
] as const;

export default function ProfileDashboard({ user, rooms, myRooms, onSelectRoom, onOpenConversations, onBack, onSignOut }: ProfileDashboardProps) {
  const [activeSection, setActiveSection] = useState<ProfileSection>('profile');
  const displayRooms = myRooms ?? rooms;
  const initials = user.displayName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const cardClass = 'border-white/10 bg-slate-950/60 text-slate-300';
  const mutedClass = 'text-slate-400';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_30%),linear-gradient(135deg,#020617,#0f172a_45%,#111827)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-4">
        <aside className="hidden w-20 shrink-0 flex-col justify-between rounded-[28px] border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-black/20 lg:flex">
          <div className="space-y-3">
            <div className="rounded-2xl bg-indigo-600/90 p-3 text-white shadow-lg shadow-indigo-600/20">
              <Sparkles size={18} />
            </div>
            {sectionIcons.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.key;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`flex w-full items-center justify-center rounded-2xl border p-3 transition ${
                    isActive
                      ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-200'
                      : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-indigo-500/40 hover:text-white'
                  }`}
                  title={section.label}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
          <div className="space-y-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-slate-400 transition hover:border-indigo-500/40 hover:text-white"
                title="Back"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="flex w-full items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300 transition hover:bg-rose-500/20"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </aside>

        <section className="flex-1 rounded-4xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {/* Top profile header */}
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

          {/* Mobile section tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {sectionIcons.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.key;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-200'
                      : 'border-slate-800 bg-slate-950/70 text-slate-400'
                  }`}
                >
                  <Icon size={13} /> {section.label}
                </button>
              );
            })}
          </div>

          {/* Profile section */}
          {activeSection === 'profile' && (
            <>
              <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-lg grid grid-cols-1 md:grid-cols-3">
                <div className="h-48 md:h-auto overflow-hidden bg-slate-800">
                  <img
                    src="https://picsum.photos/seed/studyroom/800/600"
                    alt="Random workspace preview"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 md:col-span-2 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                    <Sparkles size={12} /> Active Sanctuary
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                    Deep Focus & Real-Time Sync
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Your rooms are optimized for low-latency collaboration, shared note-writing, and distraction-free learning environments.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                <div className={`rounded-3xl border p-4 ${cardClass}`}>
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                    <BookOpen size={16} /> Study pulse
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">Focus sessions: 12 this month</div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">Shared notes: 8 this week</div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">Room balance: steady and productive</div>
                  </div>
                </div>

                <div className={`rounded-3xl border p-4 ${cardClass}`}>
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                    <UserRound size={16} /> About
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <div className="text-xs uppercase tracking-widest text-slate-500">Display name</div>
                      <div className="mt-1 text-slate-100">{user.displayName}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <div className="text-xs uppercase tracking-widest text-slate-500">Email</div>
                      <div className="mt-1 text-slate-100">{user.email}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <div className="text-xs uppercase tracking-widest text-slate-500">Member since</div>
                      <div className="mt-1 text-slate-100">Active now</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Achievements section */}
          {activeSection === 'achievements' && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                <Trophy size={16} /> Achievements
              </div>
              <p className={`mt-1 text-sm ${mutedClass}`}>Milestones you've unlocked across your study journey.</p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { icon: CheckCircle2, title: 'Completed 3 focus sprints this week', detail: 'Consistency is your superpower', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { icon: Users, title: 'Joined 2 collaborative rooms', detail: 'Learning together with friends', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                  { icon: MessageSquare, title: 'Shared 5 study milestones', detail: 'Keeping the group motivated', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                  { icon: Flame, title: '7-day focus streak', detail: 'Building a strong study rhythm', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { icon: Award, title: 'Early bird', detail: 'Started a session before 7 AM', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
                  { icon: Zap, title: 'Sprint finisher', detail: 'Completed a full pomodoro block', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }
                ].map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={achievement.title} className={`rounded-3xl border p-5 ${cardClass}`}>
                      <div className={`inline-flex rounded-2xl border p-3 ${achievement.color}`}>
                        <Icon size={18} />
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white">{achievement.title}</div>
                      <div className={`mt-1 text-xs ${mutedClass}`}>{achievement.detail}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conversations section */}
          {activeSection === 'conversations' && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                    <MessageSquare size={16} /> Conversations
                  </div>
                  <p className={`mt-1 text-sm ${mutedClass}`}>Chat with your study circles in real time.</p>
                </div>
                <button
                  type="button"
                  onClick={onOpenConversations}
                  className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-500/20"
                >
                  <MessageSquare size={13} /> Open all chats
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {displayRooms.length > 0 ? (
                  displayRooms.slice(0, 5).map((room) => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={onOpenConversations}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-left transition hover:border-indigo-500/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-sm font-bold text-white">
                          {room.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{room.name}</div>
                          <div className={`mt-0.5 flex items-center gap-1.5 text-xs ${mutedClass}`}>
                            <Users size={11} /> {room.membersCount || 1} studying
                          </div>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-semibold text-indigo-300">
                        Open chat <ArrowLeft size={12} className="rotate-180" />
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-400">
                    No conversations yet. Create a room and it will appear here.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rooms section */}
          {activeSection === 'rooms' && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                <DoorOpen size={16} /> Your rooms
              </div>
              <p className={`mt-1 text-sm ${mutedClass}`}>Open a room to jump back into focus.</p>

              <div className="mt-4 space-y-3">
                {displayRooms.length > 0 ? (
                  displayRooms.slice(0, 6).map((room) => (
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
                        Open <ArrowLeft size={12} className="rotate-180" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-400">
                    No rooms yet. Create one and it will appear here.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
