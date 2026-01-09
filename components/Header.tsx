import React from 'react';
import { Flame, CheckSquare } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between pb-2 border-b border-transparent">
      <div className="flex items-center space-x-3 mb-4 sm:mb-0">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2.5 rounded-xl shadow-lg shadow-orange-500/30">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">FireTask AI</h1>
          <p className="text-sm text-slate-500 font-medium">Supercharged with Gemini</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
        <div className="flex -space-x-2">
           <img className="w-6 h-6 rounded-full border-2 border-white" src="https://picsum.photos/32/32?random=1" alt="User" />
           <img className="w-6 h-6 rounded-full border-2 border-white" src="https://picsum.photos/32/32?random=2" alt="User" />
        </div>
        <span className="text-xs font-semibold text-slate-600 pl-1">Team Workspace</span>
      </div>
    </header>
  );
};