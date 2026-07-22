export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export interface StudyRoom {
  id: string;
  name: string;
  hostId: string;
  createdAt: number;
  membersCount: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface PomodoroState {
  timeLeft: number; // in seconds
  isRunning: boolean;
  mode: 'work' | 'break';
}