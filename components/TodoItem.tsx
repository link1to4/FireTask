import React, { useState } from 'react';
import { Todo } from '../types';
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Check, Trash2, Edit2, X, Sparkles, Save } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');

  const toggleComplete = async () => {
    if (!db) return;
    const todoRef = doc(db, 'todos', todo.id);
    await updateDoc(todoRef, {
      completed: !todo.completed
    });
  };

  const handleDelete = async () => {
    if (!db) return;
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteDoc(doc(db, 'todos', todo.id));
    }
  };

  const handleUpdate = async () => {
    if (!db) return;
    await updateDoc(doc(db, 'todos', todo.id), {
      title: editTitle,
      description: editDesc
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-md ring-2 ring-indigo-50 transition-all">
        <div className="space-y-3">
            <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-lg font-semibold text-slate-800 border-b border-indigo-100 pb-1 outline-none focus:border-indigo-500"
                autoFocus
            />
            <textarea 
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full text-sm text-slate-600 outline-none resize-none h-20 bg-slate-50 p-2 rounded-lg"
                placeholder="Description..."
            />
            <div className="flex justify-end space-x-2 pt-2">
                <button 
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                    <X className="w-4 h-4" />
                </button>
                <button 
                    onClick={handleUpdate}
                    className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
      todo.completed 
        ? 'bg-slate-50 border-slate-100 opacity-75' 
        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
    }`}>
      <button 
        onClick={toggleComplete}
        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
          todo.completed 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-slate-300 text-transparent hover:border-green-400'
        }`}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </button>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
            <h3 className={`font-medium text-slate-800 break-words ${todo.completed ? 'line-through text-slate-400' : ''}`}>
            {todo.title}
            </h3>
            {todo.aiEnhanced && !todo.completed && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI
                </span>
            )}
        </div>
        
        {todo.description && (
          <p className={`text-sm mt-1 break-words ${todo.completed ? 'text-slate-300' : 'text-slate-500'}`}>
            {todo.description}
          </p>
        )}
      </div>

      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};