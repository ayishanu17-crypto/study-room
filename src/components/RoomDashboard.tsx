import React, { useState, useEffect } from 'react';
import { type StudyRoom, type User } from '../types';
import { createRoom, fetchRooms } from '../services/studyService';
import { Plus, Users, ArrowRight } from 'lucide-react';

interface Props {
  user: User;
  onSelectRoom: (room: StudyRoom) => void;
}

export default function RoomDashboard({ user, onSelectRoom }: Props) {
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    fetchRooms().then(setRooms);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    const roomId = await createRoom(newRoomName, user.uid);
    onSelectRoom({ id: roomId, name: newRoomName, hostId: user.uid, createdAt: Date.now(), membersCount: 1 });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="flex justify-between items-center mb-10 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight">Study Rooms</h1>
        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
          <span className="text-sm font-medium">{user.displayName}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
          <h2 className="text-lg font-semibold mb-4">Create Room</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input 
              type="text"
              placeholder="Room Subject / Name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <Plus size={16} /> Create Room
            </button>
          </form>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Active Sessions</h2>
          <div className="space-y-3">
            {rooms.map(room => (
              <div key={room.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all">
                <div>
                  <h3 className="font-medium text-white">{room.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Users size={14} /> <span>{room.membersCount} active</span>
                  </div>
                </div>
                <button 
                  onClick={() => onSelectRoom(room)}
                  className="bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all"
                >
                  Join <ArrowRight size={14} />
                </button>
              </div>
            ))}
            {rooms.length === 0 && <p className="text-slate-500 text-sm">No active rooms found. Create one to start.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}