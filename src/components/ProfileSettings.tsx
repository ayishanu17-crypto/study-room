import { LogOut, Settings, UserRound, ShieldCheck } from 'lucide-react';
import type { User } from '../types';

interface ProfileSettingsProps {
  user: User;
  onBack: () => void;
  onSignOut: () => void;
}

export default function ProfileSettings({ user, onBack, onSignOut }: ProfileSettingsProps) {
  const initials = user.displayName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isDark = true;
  const shellClass = 'bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_44%,_#111827)] text-slate-100';
  const panelClass = 'border-white/10 bg-slate-900/75 shadow-black/20';
  const cardClass = 'border-white/10 bg-slate-950/60 text-slate-300';
  const mutedClass = 'text-slate-400';

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${shellClass}`}>
      <div className={`mx-auto max-w-3xl rounded-[32px] border p-6 shadow-2xl backdrop-blur-xl ${panelClass}`}>
        <button
          type="button"
          onClick={onBack}
          className={`rounded-full border px-3 py-2 text-sm transition ${isDark ? 'border-slate-700 bg-slate-950/70 text-slate-300 hover:text-white' : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900'}`}
        >
          ← Back to study rooms
        </button>

        <div className={`mt-6 flex items-center gap-4 rounded-[24px] border p-4 ${cardClass}`}>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-xl font-semibold text-white">
            {initials}
          </div>
          <div>
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.displayName}</h2>
            <p className={`mt-1 text-sm ${mutedClass}`}>{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
              <UserRound size={16} /> Account details
            </div>
            <div className={`mt-4 space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <div className={`rounded-2xl border p-3 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'}`}>Display name: {user.displayName}</div>
              <div className={`rounded-2xl border p-3 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'}`}>Email: {user.email}</div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
              <Settings size={16} /> Settings
            </div>
            <div className={`mt-4 space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <div className={`rounded-2xl border p-3 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'}`}>Theme, notifications, and focus preferences</div>
              <div className={`rounded-2xl border p-3 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'}`}>Privacy controls and account safety</div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
              <ShieldCheck size={16} /> Security
            </div>
            <div className={`mt-4 rounded-2xl border p-3 text-sm ${isDark ? 'border-slate-800 bg-slate-900/80 text-slate-300' : 'border-slate-200 bg-white/90 text-slate-700'}`}>
              Your account is secured for focused study sessions.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className={`mt-6 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20' : 'border-rose-400/30 bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </div>
  );
}
