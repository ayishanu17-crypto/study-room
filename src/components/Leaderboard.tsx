import { Crown, Medal, TrendingUp, Trophy, UserRound, Flame, Zap } from 'lucide-react';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  streaks?: number;
}

interface LeaderboardProps {
  roomId?: string;
  currentUserId: string;
  currentUserName: string;
  onBack?: () => void;
}

const medalColors = ['from-amber-400 to-yellow-500', 'from-slate-300 to-slate-400', 'from-amber-600 to-amber-700'];

export default function Leaderboard({ currentUserId, currentUserName, onBack }: LeaderboardProps) {
  const entries: LeaderboardEntry[] = [
    { userId: 'top-1', userName: 'Maya Rodriguez', score: 1320, streaks: 12 },
    { userId: 'top-2', userName: 'Liam Vance', score: 1110, streaks: 10 },
    { userId: currentUserId, userName: currentUserName, score: 980, streaks: 8 },
    { userId: 'top-4', userName: 'Sophia Chen', score: 850, streaks: 7 },
    { userId: 'top-5', userName: 'Ananya Sharma', score: 720, streaks: 6 },
    { userId: 'top-6', userName: 'Lucas Miller', score: 610, streaks: 5 },
    { userId: 'top-7', userName: 'Nina Patel', score: 540, streaks: 4 },
    { userId: 'top-8', userName: 'Diego Torres', score: 430, streaks: 3 }
  ];

  const sorted = [...entries].sort((a, b) => b.score - a.score);
  const topThree = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  // Podium order: 2nd, 1st, 3rd (left to right)
  const podiumOrder = [topThree[1], topThree[0], topThree[2]];

  const currentUserRank = sorted.findIndex((e) => e.userId === currentUserId) + 1;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_44%,_#111827)] p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-300 transition hover:text-white"
          >
            ← Back to study hub
          </button>
          <div className="text-left sm:text-right">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Global ranking</p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold text-white sm:text-3xl">
              <Trophy size={24} className="text-amber-400" /> Leaderboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">Top focus streaks across all study rooms this week.</p>
          </div>
        </div>

        {/* Podium */}
        <div className="mt-8 grid grid-cols-3 items-end gap-3 sm:gap-4">
          {podiumOrder.map((entry, idx) => {
            const rank = sorted.findIndex((e) => e.userId === entry.userId) + 1;
            const isFirst = rank === 1;
            const isMe = entry.userId === currentUserId;
            const height = isFirst ? 'h-40' : idx === 0 ? 'h-28' : 'h-24';
            return (
              <div key={entry.userId} className="flex flex-col items-center">
                <div className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${medalColors[rank - 1]} shadow-lg`}>
                  {isFirst ? (
                    <Crown size={26} className="text-white" />
                  ) : (
                    <span className="text-2xl font-black text-white">{rank}</span>
                  )}
                  {isMe && (
                    <span className="absolute -bottom-1 -right-1 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
                      YOU
                    </span>
                  )}
                </div>
                <div className={`mt-3 w-full rounded-t-2xl border border-b-0 p-4 text-center ${height} ${isFirst ? 'border-amber-400/40 bg-gradient-to-b from-amber-500/15 to-transparent' : 'border-slate-700 bg-slate-900/70'}`}>
                  <div className="truncate text-sm font-semibold text-white">{entry.userName}</div>
                  <div className="mt-1 flex items-center justify-center gap-1 text-xs text-indigo-300">
                    <Flame size={12} className="text-amber-400" /> {entry.streaks} streak
                  </div>
                  <div className="mt-2 font-mono text-lg font-bold text-amber-400">{entry.score.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400">pts</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ranked list */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
              <Medal size={15} /> Full standings
            </span>
            <span className="text-xs text-slate-400">Updated live</span>
          </div>

          <div className="divide-y divide-white/5">
            {sorted.map((entry, index) => {
              const rank = index + 1;
              const isMe = entry.userId === currentUserId;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 px-5 py-3.5 transition ${isMe ? 'bg-indigo-500/10' : 'hover:bg-white/[0.03]'}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold ${
                    rank === 1 ? 'bg-amber-400 text-slate-900'
                    : rank === 2 ? 'bg-slate-300 text-slate-900'
                    : rank === 3 ? 'bg-amber-700 text-white'
                    : 'bg-slate-800 text-slate-400'
                  }`}>
                    {rank}
                  </div>

                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isMe ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {entry.userName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 truncate text-sm font-semibold text-white">
                        <span className="truncate">{entry.userName}</span>
                        {isMe && (
                          <span className="shrink-0 rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-bold text-white">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Flame size={11} className="text-amber-400" /> {entry.streaks} focus streak
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden items-center gap-1 text-xs text-slate-400 sm:flex">
                      <Zap size={11} className="text-indigo-400" /> {entry.score} pts
                    </span>
                    <span className="font-mono text-sm font-bold text-indigo-300 sm:hidden">{entry.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current user summary */}
        <div className="mt-6 flex items-center gap-3 rounded-3xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-white">
            <UserRound size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              You're ranked <span className="text-indigo-300">#{currentUserRank}</span> with {currentUserName}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-300">
              <TrendingUp size={12} className="text-emerald-400" /> Up 2 spots — keep the momentum going!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
