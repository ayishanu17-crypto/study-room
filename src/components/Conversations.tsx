import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { ChatMessage, StudyRoom, User } from '../types';
import { sendMessage, subscribeToMessages } from '../services/studyService';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Users,
  Video
} from 'lucide-react';

interface ConversationsProps {
  user: User;
  rooms: StudyRoom[];
  onBack: () => void;
}

interface ConversationPreview {
  roomId: string;
  roomName: string;
  lastMessage: string;
  lastTimestamp: number;
  unread: number;
}

const avatarGradients = [
  'from-indigo-500 to-violet-500',
  'from-cyan-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-violet-400 to-purple-500'
];

function formatTime(timestamp: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatPreviewTime(timestamp: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return formatTime(timestamp);
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function Conversations({ user, rooms, onBack }: ConversationsProps) {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, ChatMessage[]>>({});
  const [draftMessage, setDraftMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeRoom = rooms.find((room) => room.id === activeRoomId) || null;
  const activeMessages = activeRoomId ? messagesByRoom[activeRoomId] || [] : [];

  // Initial default selection
  useEffect(() => {
    if (!activeRoomId && rooms.length > 0) {
      setActiveRoomId(rooms[0].id);
    }
  }, [rooms, activeRoomId]);

  // Subscribe to messages for all rooms
  useEffect(() => {
    const unsubscribers = rooms.map((room) =>
      subscribeToMessages(room.id, (nextMessages) => {
        setMessagesByRoom((prev) => ({ ...prev, [room.id]: nextMessages }));
      })
    );
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [rooms]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeMessages.length, activeRoomId]);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeRoom || !draftMessage.trim()) return;
    await sendMessage(activeRoom.id, user.uid, user.displayName, draftMessage.trim());
    setDraftMessage('');
  };

  const previews: ConversationPreview[] = useMemo(() => {
    return rooms
      .map((room) => {
        const msgs = messagesByRoom[room.id] || [];
        const last = msgs[msgs.length - 1];
        return {
          roomId: room.id,
          roomName: room.name,
          lastMessage: last ? last.text : 'No messages yet. Say hello!',
          lastTimestamp: last ? last.timestamp : 0,
          unread: 0
        };
      })
      .sort((a, b) => (b.lastTimestamp || 0) - (a.lastTimestamp || 0));
  }, [rooms, messagesByRoom]);

  const filteredPreviews = searchQuery.trim()
    ? previews.filter((p) => p.roomName.toLowerCase().includes(searchQuery.toLowerCase()))
    : previews;

  const gradientFor = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) % 100000;
    }
    return avatarGradients[hash % avatarGradients.length];
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_44%,_#111827)] p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl flex-col">
        {/* Page header */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={15} /> Back to study hub
          </button>
          <div className="text-left sm:text-right">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
              <MessageSquare size={15} /> Group conversations
            </p>
            <p className="mt-1 text-sm text-slate-400">Chat with your study circles in real time.</p>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/75 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {/* Sidebar: conversation list */}
          <aside className="flex w-full flex-col border-slate-800 md:w-80 md:shrink-0 md:border-r">
            <div className="border-b border-slate-800 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-100">Conversations</h2>
                <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
                  {previews.length}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                <Search size={14} className="shrink-0 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredPreviews.length > 0 ? (
                filteredPreviews.map((preview) => {
                  const isActive = preview.roomId === activeRoomId;
                  return (
                    <button
                      key={preview.roomId}
                      type="button"
                      onClick={() => setActiveRoomId(preview.roomId)}
                      className={`flex w-full items-center gap-3 border-b border-slate-800/60 px-4 py-3.5 text-left transition ${
                        isActive ? 'bg-indigo-500/10' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientFor(preview.roomId)} text-sm font-bold text-white`}>
                        {preview.roomName.charAt(0)}
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`truncate text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                            {preview.roomName}
                          </span>
                          {preview.lastTimestamp ? (
                            <span className="shrink-0 text-[10px] text-slate-500">{formatPreviewTime(preview.lastTimestamp)}</span>
                          ) : null}
                        </div>
                        <div className="mt-0.5 flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-slate-400">{preview.lastMessage}</span>
                          {preview.unread > 0 ? (
                            <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white">
                              {preview.unread}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 text-slate-500">
                    <MessageSquare size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-300">No conversations yet</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Create a study room and it will appear here so you can chat with your group.
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Main chat area */}
          <main className="hidden flex-1 flex-col md:flex">
            {activeRoom ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientFor(activeRoom.id)} text-sm font-bold text-white`}>
                      {activeRoom.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        {activeRoom.name}
                        <Bell size={13} className="text-slate-500" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {activeRoom.membersCount || 1} members active
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" title="Voice call">
                      <Phone size={16} />
                    </button>
                    <button type="button" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" title="Video call">
                      <Video size={16} />
                    </button>
                    <button type="button" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" title="More">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                  {activeMessages.length > 0 ? (
                    activeMessages.map((message, index) => {
                      const isMine = message.userId === user.uid;
                      const prev = activeMessages[index - 1];
                      const showHeader = !prev || prev.userId !== message.userId;
                      return (
                        <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex max-w-[75%] gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                            {!isMine && showHeader && (
                              <div className={`mt-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradientFor(message.userId)} text-xs font-bold text-white`}>
                                {message.userName.charAt(0)}
                              </div>
                            )}
                            {isMine && showHeader && (
                              <div className="mt-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                                {user.displayName.charAt(0)}
                              </div>
                            )}
                            <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                              {showHeader && (
                                <span className="mb-1 px-1 text-[11px] font-semibold text-slate-400">
                                  {isMine ? 'You' : message.userName}
                                </span>
                              )}
                              <div
                                className={`rounded-2xl px-3.5 py-2 text-sm leading-6 shadow-sm ${
                                  isMine
                                    ? 'rounded-br-md bg-indigo-600 text-white'
                                    : 'rounded-bl-md border border-slate-800 bg-slate-800/80 text-slate-100'
                                }`}
                              >
                                {message.text}
                              </div>
                              <span className="mt-1 flex items-center gap-1 px-1 text-[10px] text-slate-500">
                                {formatTime(message.timestamp)}
                                {isMine && <CheckCheck size={12} className="text-indigo-400" />}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/60 text-slate-500">
                        <MessageSquare size={24} />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-300">Start the conversation</p>
                      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                        This is the start of <span className="text-slate-300">{activeRoom.name}</span>. Share a milestone or plan your next study session.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Composer */}
                <form onSubmit={handleSend} className="border-t border-slate-800 p-4">
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                    <button type="button" className="rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white" title="Attach">
                      <Paperclip size={17} />
                    </button>
                    <input
                      type="text"
                      value={draftMessage}
                      onChange={(e) => setDraftMessage(e.target.value)}
                      placeholder={`Message ${activeRoom.name}...`}
                      className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
                    />
                    <button type="button" className="rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white" title="Emoji">
                      <Smile size={17} />
                    </button>
                    <button
                      type="submit"
                      disabled={!draftMessage.trim()}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send <Send size={13} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/60 text-slate-500">
                  <Users size={26} />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-300">Select a conversation</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                  Choose a study room from the list on the left to start chatting with your group.
                </p>
              </div>
            )}
          </main>

          {/* Mobile fallback: show active chat below sidebar */}
          <div className="flex-1 flex-col md:hidden">
            {activeRoom ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${gradientFor(activeRoom.id)} text-sm font-bold text-white`}>
                      {activeRoom.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-white">{activeRoom.name}</span>
                  </div>
                  <button type="button" onClick={() => setActiveRoomId(null)} className="rounded-xl px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800">
                    ← Rooms
                  </button>
                </div>
                <div className="max-h-64 space-y-2 overflow-y-auto px-4 py-4">
                  {activeMessages.length > 0 ? (
                    activeMessages.map((message) => {
                      const isMine = message.userId === user.uid;
                      return (
                        <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-5 ${
                            isMine ? 'rounded-br-md bg-indigo-600 text-white' : 'rounded-bl-md border border-slate-800 bg-slate-800/80 text-slate-100'
                          }`}>
                            {message.text}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-8 text-center text-xs text-slate-500">No messages yet.</p>
                  )}
                </div>
                <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-800 p-3">
                  <input
                    type="text"
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
                  />
                  <button type="submit" className="rounded-xl bg-indigo-600 px-3 text-white">
                    <Send size={14} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <p className="text-sm font-semibold text-slate-300">Select a conversation</p>
                <p className="mt-1 text-xs text-slate-500">Tap a room on the left to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
