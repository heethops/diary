
import React, { useState, useMemo } from 'react';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onUpdateTodos: (todos: Todo[]) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onUpdateTodos }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0].replace(/-/g, '.'));

  const activeTodos = useMemo(() => todos.filter(t => !t.completed), [todos]);
  const completedTodos = useMemo(() => 
    todos.filter(t => t.completed).sort((a, b) => (b.completedDate || '').localeCompare(a.completedDate || '')), 
    [todos]
  );

  const filteredHistory = useMemo(() => 
    completedTodos.filter(t => t.title.toLowerCase().includes(historySearch.toLowerCase())),
    [completedTodos, historySearch]
  );

  const calculateDDay = (dueDate: string) => {
    const target = new Date(dueDate.replace(/\./g, '-'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'D-Day';
    return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  };

  const handleAddOrUpdate = () => {
    if (!newTitle.trim()) return;

    if (editTodo) {
      onUpdateTodos(todos.map(t => t.id === editTodo.id ? { ...t, title: newTitle, dueDate: newDate } : t));
    } else {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: newTitle,
        dueDate: newDate,
        completed: false
      };
      onUpdateTodos([...todos, newTodo]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditTodo(null);
    setNewTitle('');
    setNewDate(new Date().toISOString().split('T')[0].replace(/-/g, '.'));
  };

  const toggleComplete = (id: string) => {
    onUpdateTodos(todos.map(t => t.id === id ? { ...t, completed: true, completedDate: new Date().toISOString() } : t));
  };

  const deleteTodo = (id: string) => {
    onUpdateTodos(todos.filter(t => t.id !== id));
  };

  const openEdit = (todo: Todo) => {
    setEditTodo(todo);
    setNewTitle(todo.title);
    setNewDate(todo.dueDate);
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Todo</h3>
        <div className="flex space-x-2">
          <button onClick={() => setIsAddModalOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all text-gray-500">
            <i className="fa-solid fa-plus"></i>
          </button>
          <button onClick={() => setIsHistoryModalOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all text-gray-500">
            <i className="fa-solid fa-check-double"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {activeTodos.map(todo => (
          <div 
            key={todo.id} 
            className="group flex items-start justify-between p-3 border border-gray-100 rounded-xl hover:shadow-sm transition-all relative cursor-default"
            onContextMenu={(e) => {
              e.preventDefault();
              if (confirm('수정하시겠습니까?')) openEdit(todo);
              else if (confirm('삭제하시겠습니까?')) deleteTodo(todo.id);
            }}
          >
            <div className="flex items-start flex-1 min-w-0 pr-2">
              <input 
                type="checkbox" 
                className="mt-1 mr-3 w-4 h-4 rounded border-gray-300 focus:ring-black cursor-pointer accent-black"
                onChange={() => toggleComplete(todo.id)}
              />
              <span className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-snug">{todo.title}</span>
            </div>
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap pt-0.5">{calculateDDay(todo.dueDate)}</span>
          </div>
        ))}
        {activeTodos.length === 0 && (
          <div className="text-center text-sm text-gray-400 mt-10">할 일이 없습니다.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h4 className="text-lg font-semibold mb-4">{editTodo ? '할 일 수정' : '할 일 추가'}</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">제목</label>
                <textarea 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-black resize-none h-24"
                  placeholder="할 일을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">날짜 (YYYY.MM.DD)</label>
                <input 
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-black"
                  placeholder="2024.01.01"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={closeModal} className="flex-1 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-all">취소</button>
                <button onClick={handleAddOrUpdate} className="flex-1 py-3 text-sm font-medium bg-black text-white rounded-xl hover:bg-gray-800 transition-all">저장</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">완료된 목록</h4>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-gray-400 hover:text-black">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="mb-4">
              <input 
                type="text"
                placeholder="검색..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-black"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {filteredHistory.map(todo => (
                <div key={todo.id} className="p-3 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-start opacity-75">
                  <div className="flex-1 pr-2">
                    <div className="text-sm text-gray-600 line-through mb-1">{todo.title}</div>
                    <div className="text-[10px] text-gray-400 italic">완료: {todo.completedDate?.split('T')[0]}</div>
                  </div>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              ))}
              {filteredHistory.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-10">완료된 내역이 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
