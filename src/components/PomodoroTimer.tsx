import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      const nextMode = mode === 'work' ? 'break' : 'work';
      const nextTime = nextMode === 'work' ? 25 * 60 : 5 * 60;
      setMode(nextMode);
      setTimeLeft(nextTime);
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-3 w-72 shadow-lg">
      <div className="flex items-center justify-between w-full text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5"><TimerIcon size={14} className="text-indigo-400" /> Pomodoro Timer</span>
        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button 
            onClick={() => switchMode('work')}
            className={`px-2.5 py-1 rounded-md text-[10px] transition-colors ${mode === 'work' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Work
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={`px-2.5 py-1 rounded-md text-[10px] transition-colors ${mode === 'break' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Break
          </button>
        </div>
      </div>

      <div className="text-4xl font-extrabold tracking-wider text-slate-100 font-mono my-1">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex items-center gap-2 w-full">
        <button 
          onClick={toggleTimer}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors ${isRunning ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
        >
          {isRunning ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Start</>}
        </button>
        <button 
          onClick={resetTimer}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl transition-colors"
          title="Reset Timer"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}