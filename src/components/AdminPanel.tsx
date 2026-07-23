import React, { useState } from 'react';
import { ShieldAlert, Lock, Unlock, Megaphone } from 'lucide-react';

interface Props {
  isHost: boolean;
  onBroadcast: (message: string) => void;
}

export default function AdminPanel({ isHost, onBroadcast }: Props) {
  const [isLocked, setIsLocked] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  if (!isHost) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-80 shadow-xl flex flex-col gap-3 text-center">
        <ShieldAlert size={24} className="text-slate-500 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-300">Host Controls Restricted</h3>
        <p className="text-xs text-slate-500">Only the creator of this study room has access to admin moderation tools.</p>
      </div>
    );
  }

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    onBroadcast(announcement);
    setAnnouncement('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-80 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5"><ShieldAlert size={14} className="text-indigo-400" /> Host Admin Panel</span>
        <span className="text-indigo-400 font-semibold">Active</span>
      </div>

      <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs">
        <span className="text-slate-300">Whiteboard Access</span>
        <button 
          onClick={() => setIsLocked(!isLocked)}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${isLocked ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'}`}
        >
          {isLocked ? <><Lock size={12} /> Locked</> : <><Unlock size={12} /> Open</>}
        </button>
      </div>

      <form onSubmit={handleBroadcastSubmit} className="space-y-2">
        <span className="text-xs text-slate-400 flex items-center gap-1"><Megaphone size={12} /> Broadcast Announcement</span>
        <div className="flex gap-2">
          <input 
            type="text"
            placeholder="Type notice..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-medium transition-colors">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}