import { useState } from 'react';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
}

export default function Leaderboard({ roomId: _roomId, currentUserId, currentUserName }: { roomId: string, currentUserId: string, currentUserName: string }) {
  const [scores] = useState<LeaderboardEntry[]>([
    { userId: currentUserId, userName: currentUserName, score: 100 },
    { userId: 'mock-user-2', userName: 'Alex Chen', score: 80 },
    { userId: 'mock-user-3', userName: 'Sarah Jenkins', score: 60 }
  ]);

  // Sort descending by score
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-80 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5"><Trophy size={14} className="text-amber-400" /> Room Leaderboard</span>
        <span>Live</span>
      </div>

      <div className="space-y-2">
        {sortedScores.map((entry, index) => {
          const isMe = entry.userId === currentUserId;
          return (
            <div 
              key={entry.userId}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${isMe ? 'bg-indigo-600/10 border-indigo-500/30 text-white' : 'bg-slate-950 border-slate-800 text-slate-300'}`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`font-mono font-bold w-4 text-center ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {index + 1}
                </span>
                <span className="truncate max-w-[120px]">{entry.userName} {isMe && '(You)'}</span>
              </div>
              <span className="font-mono font-semibold text-indigo-400">{entry.score} pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}