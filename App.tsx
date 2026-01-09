import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { Todo } from './types';
import { Header } from './components/Header';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Basic check to see if Firebase config is likely missing
    if (!db) {
      setError("Firebase is not initialized. Please configure your keys in 'firebase.ts'.");
      setLoading(false);
      return;
    }

    try {
      const todosCollection = collection(db, 'todos');
      const q = query(todosCollection, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const todosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Todo[];
        setTodos(todosData);
        setLoading(false);
        setError(null); // Clear error on successful sync
      }, (err: any) => {
        console.error("Firestore Error:", err);
        
        // More specific error handling
        if (err.code === 'permission-denied') {
          setError("Permission Denied: Please go to Firebase Console > Firestore > Rules and set 'allow read, write: if true;' for testing.");
        } else if (err.code === 'unavailable') {
          setError("Network Error: Could not reach Firebase. Please check your internet connection.");
        } else {
          setError(`Firebase Sync Error: ${err.message || "Unknown error"}`);
        }
        
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Initialization Error:", err);
      setError("An unexpected error occurred initializing Firebase.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Header />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start animate-pulse">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">Connection Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="p-6 sm:p-8 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Create New Task</h2>
              <TodoForm />
            </section>

            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
                <span>Your Tasks</span>
                <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {todos.length}
                </span>
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <TodoList todos={todos} />
              )}
            </div>
          </div>
        </div>
        
        <footer className="text-center text-slate-400 text-sm">
          <p>Powered by React, Firebase & Gemini AI</p>
        </footer>
      </div>
    </div>
  );
};

export default App;