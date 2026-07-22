import { 
  collection, 
  addDoc, 
  getDocs, 
  orderBy, 
  query, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { type StudyRoom, type ChatMessage } from '../types';

export const createRoom = async (roomName: string, hostId: string): Promise<string> => {
  const docRef = await addDoc(collection(db, 'rooms'), {
    name: roomName,
    hostId,
    createdAt: Date.now(),
    membersCount: 1
  });
  return docRef.id;
};

export const fetchRooms = async (): Promise<StudyRoom[]> => {
  const querySnapshot = await getDocs(collection(db, 'rooms'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyRoom));
};

export const sendMessage = async (roomId: string, userId: string, userName: string, text: string) => {
  await addDoc(collection(db, `rooms/${roomId}/messages`), {
    roomId,
    userId,
    userName,
    text,
    timestamp: serverTimestamp()
  });
};

export const subscribeToMessages = (roomId: string, callback: (messages: ChatMessage[]) => void) => {
  const q = query(collection(db, `rooms/${roomId}/messages`), orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
    callback(messages);
  });
};