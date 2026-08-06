import { 
  collection, 
  addDoc, 
  getDocs, 
  orderBy, 
  query, 
  where, 
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

export const fetchRoomsByHost = async (hostId: string): Promise<StudyRoom[]> => {
  const q = query(collection(db, 'rooms'), where('hostId', '==', hostId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyRoom));
};

export const subscribeToRoomsByHost = (hostId: string, callback: (rooms: StudyRoom[]) => void) => {
  const q = query(collection(db, 'rooms'), where('hostId', '==', hostId));
  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyRoom));
    callback(rooms);
  });
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