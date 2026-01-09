import React from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';
import { ClipboardList } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
}

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <ClipboardList className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-slate-900 font-medium text-lg">No tasks yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          Add a task above to get started, or use the <span className="text-indigo-600 font-semibold">AI button</span> to generate ideas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};