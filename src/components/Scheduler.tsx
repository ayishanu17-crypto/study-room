import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle2, Circle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function Scheduler() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review algorithm notes', completed: true },
    { id: '2', title: 'Draft schema architecture', completed: false }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: String(Date.now()), title: newTaskTitle, completed: false }]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-80 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-indigo-400" /> Agenda / Goals</span>
        <span>{tasks.filter(t => t.completed).length}/{tasks.length} Done</span>
      </div>

      <div className="space-y-2 max-h-36 overflow-y-auto">
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-slate-700 transition-all text-xs"
          >
            {task.completed ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> : <Circle size={16} className="text-slate-500 shrink-0" />}
            <span className={`truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</span>
          </div>
        ))}
      </div>

      <form onSubmit={addTask} className="flex gap-2">
        <input 
          type="text"
          placeholder="Add session goal..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-colors">
          <Plus size={14} />
        </button>
      </form>
    </div>
  );
}