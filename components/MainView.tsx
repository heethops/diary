
import React, { useState, useMemo } from 'react';
import { DiaryEntry, Todo, DiarySection } from '../types';
import Calendar from './Calendar';
import TodoList from './TodoList';

interface MainViewProps {
  entries: Record<string, DiaryEntry>;
  todos: Todo[];
  onNavigateDiary: (date: string) => void;
  onUpdateTodos: (todos: Todo[]) => void;
}

const MainView: React.FC<MainViewProps> = ({ entries, todos, onNavigateDiary, onUpdateTodos }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    // Fix: Explicitly cast entries to DiaryEntry[] because Object.values can return unknown[]
    const entryList = Object.values(entries) as DiaryEntry[];
    return entryList.filter(entry => {
      // Fix: Explicitly cast sections to DiarySection[] to access the 'text' property
      const sections = Object.values(entry.sections) as DiarySection[];
      return sections.some(section => 
        section.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, searchTerm]);

  return (
    <div className="p-8 h-full flex flex-col space-y-8 max-w-6xl mx-auto">
      {/* Top Search Bar */}
      <div className="relative">
        <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
          <i className="fa-solid fa-search text-gray-400 mr-3"></i>
          <input
            type="text"
            placeholder="일기 내용을 검색하세요..."
            className="w-full outline-none text-sm bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map(entry => (
                <div 
                  key={entry.date}
                  className="p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onNavigateDiary(entry.date)}
                >
                  <div className="text-xs text-gray-400 font-medium mb-1">{entry.date}</div>
                  <div className="text-sm text-gray-700 line-clamp-1">{entry.sections.diary.text || '내용 없음'}</div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-400">검색 결과가 없습니다.</div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* Left: Calendar */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
          <Calendar 
            entries={entries} 
            onSelectDate={onNavigateDiary} 
          />
        </div>

        {/* Right: Todo List */}
        <div className="w-full lg:w-80 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col min-h-[400px]">
          <TodoList todos={todos} onUpdateTodos={onUpdateTodos} />
        </div>
      </div>
    </div>
  );
};

export default MainView;
