import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { enhanceTaskContent } from '../services/geminiService';
import { Plus, Sparkles, Loader2 } from 'lucide-react';

export const TodoForm: React.FC = () => {
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !db) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'todos'), {
        title: input,
        description: description,
        completed: false,
        createdAt: serverTimestamp(),
        aiEnhanced: false
      });
      setInput('');
      setDescription('');
    } catch (err) {
      console.error("Error adding document: ", err);
      alert("Error adding task. Is Firestore enabled?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIEnhance = async () => {
    if (!input.trim()) return;
    
    setIsEnhancing(true);
    const enhanced = await enhanceTaskContent(input);
    
    if (enhanced) {
      setInput(enhanced.title);
      setDescription(enhanced.description);
      
      // Auto-save the enhanced task if DB is ready
      if (db) {
         try {
            await addDoc(collection(db, 'todos'), {
                title: enhanced.title,
                description: enhanced.description,
                completed: false,
                createdAt: serverTimestamp(),
                aiEnhanced: true
            });
            setInput('');
            setDescription('');
         } catch(e) {
             console.error("Error saving enhanced task", e);
         }
      }
    } else {
        alert("AI enhancement failed. Check API Key or try again.");
    }
    setIsEnhancing(false);
  };

  const isDbReady = !!db;

  return (
    <form onSubmit={handleSubmit} className="relative">
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow space-y-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white"
                        disabled={isSubmitting || isEnhancing || !isDbReady}
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Details (optional)"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white resize-none h-20 text-sm"
                        disabled={isSubmitting || isEnhancing || !isDbReady}
                    />
                </div>
                
                <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                        type="submit"
                        disabled={!input.trim() || isSubmitting || isEnhancing || !isDbReady}
                        className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline">Add</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleAIEnhance}
                        disabled={!input.trim() || isSubmitting || isEnhancing}
                        className="flex-1 flex items-center justify-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Enhance with Gemini AI"
                    >
                        {isEnhancing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                <span className="hidden sm:inline">AI</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
        {!isDbReady && (
            <p className="absolute -bottom-6 left-1 text-xs text-red-500">
                DB not connected.
            </p>
        )}
    </form>
  );
};