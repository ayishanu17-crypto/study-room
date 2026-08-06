import { useState } from 'react';
import { ArrowRight, Brain, DoorOpen, LogOut, MessageSquare, Plus, Sparkles, Trophy, UserRound, Users } from 'lucide-react';
import type { StudyRoom, User } from '../types';

interface StudyHubDashboardProps {
  user: User;
  rooms: StudyRoom[];
  myRooms: StudyRoom[];
  roomError?: string;
  onClearRoomError?: () => void;
  onSelectRoom: (room: StudyRoom) => void;
  onCreateRoom: (roomName: string) => Promise<void> | void;
  onOpenTool: (tool: 'whiteboard' | 'pomodoro' | 'flashcards' | 'chat') => Promise<void> | void;
  onOpenProfile: () => void;
  onOpenConversations: () => void;
  onOpenLeaderboard: () => void;
  onSignOut: () => void;
}

export default function StudyHubDashboard({ user, rooms: _rooms, myRooms, roomError, onClearRoomError, onSelectRoom, onCreateRoom, onOpenTool, onOpenProfile, onOpenConversations, onOpenLeaderboard, onSignOut }: StudyHubDashboardProps) {
  const initials = user.displayName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const [newRoomName, setNewRoomName] = useState('');
  const isDark = true;
  const shellClass = 'bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_44%,_#111827)] text-slate-100';
  const sidebarClass = 'border-white/10 bg-slate-900/85 shadow-black/20';
  const panelClass = 'border-white/10 bg-slate-900/75 shadow-black/20';
  const cardClass = 'border-white/10 bg-slate-950/60 text-slate-300';
  const mutedClass = 'text-slate-400';
  const iconButtonClass = 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-indigo-500/40 hover:text-white';

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${shellClass}`}>
      <div className="mx-auto flex max-w-7xl gap-4">
        <aside className={`flex w-20 shrink-0 flex-col justify-between rounded-[28px] border p-3 shadow-2xl ${sidebarClass}`}>
          <div className="space-y-3">
            <div className="rounded-2xl bg-indigo-600/90 p-3 text-white shadow-lg shadow-indigo-600/20">
              <Sparkles size={18} />
            </div>
            <button
              type="button"
              onClick={() => document.getElementById('study-rooms')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="flex w-full items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-200 transition hover:bg-indigo-500/20"
              title="Study Rooms"
            >
              <DoorOpen size={16} />
            </button>
            <button
              type="button"
              onClick={onOpenConversations}
              className={`flex w-full items-center justify-center rounded-2xl border p-3 transition ${iconButtonClass}`}
              title="Conversations"
            >
              <MessageSquare size={16} />
            </button>
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className={`flex w-full items-center justify-center rounded-2xl border p-3 transition ${iconButtonClass}`}
              title="Leaderboard"
            >
              <Trophy size={16} />
            </button>
            <button
              type="button"
              onClick={onOpenProfile}
              className={`flex w-full items-center justify-center rounded-2xl border p-3 transition ${iconButtonClass}`}
              title="Profile"
            >
              <UserRound size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className={`rounded-2xl border p-3 transition ${iconButtonClass}`}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </aside>

        <main className={`flex-1 rounded-[32px] border p-6 shadow-2xl backdrop-blur-xl ${panelClass}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Study Room</p>
              <h1 className={`mt-2 text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome back, {user.displayName}</h1>
              <p className={`mt-2 text-sm ${mutedClass}`}>Your focused study rooms and profile tools live here.</p>
            </div>
            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${cardClass}`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-sm font-semibold text-white">
                {initials}
              </div>
              <div>
                <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.displayName}</div>
                <div className={`text-xs ${mutedClass}`}>Ready for your next sprint</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <section id="study-rooms" className={`rounded-[24px] border p-5 ${cardClass}`}>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                <DoorOpen size={16} /> Your rooms
              </div>
<div className="mt-4 space-y-3">
                {myRooms.length > 0 ? myRooms.slice(0, 4).map((room) => (
                  <div key={room.id} className={`flex items-center justify-between rounded-2xl border p-3 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'}`}>
                    <div>
                      <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{room.name}</div>
                      <div className={`mt-1 flex items-center gap-2 text-xs ${mutedClass}`}>
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
                  <div className={`rounded-2xl border border-dashed p-4 text-sm ${mutedClass} ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-300 bg-white/80'}`}>
                    No rooms yet. Create one and it will appear here.
                  </div>
                )}
              </div>
            </section>

            <section className={`rounded-[24px] border p-5 ${cardClass}`}>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                <Brain size={16} /> Focus tools
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { label: 'Pomodoro sessions', tool: 'pomodoro' },
                  { label: 'Whiteboard collaboration', tool: 'whiteboard' },
                  { label: 'Quick flashcards', tool: 'flashcards' },
                  { label: 'Open chat room', tool: 'chat' }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => void onOpenTool(item.tool as 'whiteboard' | 'pomodoro' | 'flashcards' | 'chat')}
                    className={`w-full rounded-2xl border p-3 text-left text-sm transition ${isDark ? 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-indigo-500/40' : 'border-slate-200 bg-white/90 text-slate-700 hover:border-indigo-500/40'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section className={`rounded-[24px] border p-5 ${cardClass}`}>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                <Plus size={16} /> Create a room
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!newRoomName.trim()) return;
                  void onCreateRoom(newRoomName.trim());
                  setNewRoomName('');
                }}
                className="mt-4 space-y-3"
              >
                {roomError ? (
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                    {roomError}
                  </div>
                ) : null}
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(event) => {
                    setNewRoomName(event.target.value);
                    onClearRoomError?.();
                  }}
                  placeholder="e.g. Deep Work Sprint"
                  className={`w-full rounded-2xl border px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400'}`}
                />
                <button type="submit" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
                  <Plus size={14} /> Launch room
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
