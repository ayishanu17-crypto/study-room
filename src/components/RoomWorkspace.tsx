import React, { useState, useEffect, useRef } from 'react';
import { type StudyRoom, type User, type ChatMessage } from '../types';
import { sendMessage, subscribeToMessages } from '../services/studyService';
import { Send, ArrowLeft, MessageSquare, Shield, Users } from 'lucide-react';
import Whiteboard from './Whiteboard';
import PomodoroTimer from './PomodoroTimer';

interface Props {
  room: StudyRoom;
  user: User;
  onLeave: () => void;
}

export default function RoomWorkspace({ room, user, onLeave }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(room.id, (fetchedMessages) => {
      setMessages(fetchedMessages);
    });
    return () => unsubscribe();
  }, [room.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');
    try {
      await sendMessage(room.id, user.uid, user.displayName, textToSend);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onLeave}
            className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-300 transition-colors"
            title="Leave Room"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-semibold text-sm md:text-base flex items-center gap-2">
              {room.name}
              {room.hostId === user.uid && (
                <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                  <Shield size={12} /> Host
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400">ID: {room.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Users size={14} /> <span>Active Session</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Canvas / Whiteboard Area */}
        <div className="flex-1 bg-slate-950 relative flex flex-col overflow-hidden border-r border-slate-800">
          <Whiteboard />
          
          {/* Floating Pomodoro Widget */}
          <div className="absolute bottom-6 left-6 z-20">
            <PomodoroTimer />
          </div>
        </div>

        {/* Right Sidebar: Real-Time Chat */}
        <div className="w-80 md:w-96 bg-slate-900 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2 font-medium text-sm">
            <MessageSquare size={16} className="text-indigo-400" /> Room Chat
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isMe = msg.userId === user.uid;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-500 mb-1 px-1">{msg.userName}</span>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-xs' : 'bg-slate-800 text-slate-200 rounded-bl-xs'}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900 flex gap-2">
            <input 
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100"
            />
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-colors flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}