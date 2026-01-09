import { Timestamp } from 'firebase/firestore';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: any; // Firestore Timestamp or serialized date
  aiEnhanced?: boolean;
}

export interface AIGeneratedContent {
  title: string;
  description: string;
}