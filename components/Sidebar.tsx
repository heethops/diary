
import React from 'react';
import { SectionKey, ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigateCategory: (category: SectionKey) => void;
  onNavigateMain: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigateCategory, onNavigateMain }) => {
  const menuItems: { key: SectionKey; label: string }[] = [
    { key: 'diary', label: '일기' },
    { key: 'music', label: '노래' },
    { key: 'place', label: '장소' },
    { key: 'food', label: '음식' },
    { key: 'word', label: '한마디' },
    { key: 'gratitude', label: '감사' },
  ];

  return (
    <aside className="w-48 border-r border-gray-100 flex flex-col p-6 bg-white shrink-0">
      <div 
        className="text-xl font-bold mb-10 cursor-pointer hover:text-gray-500 transition-colors"
        onClick={onNavigateMain}
      >
        DIARY
      </div>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigateCategory(item.key)}
            className={`text-left px-4 py-3 rounded-lg text-sm transition-all border border-transparent
              ${currentView === 'category' ? 'hover:bg-gray-50' : 'hover:bg-gray-50'}
              active:scale-95 border-gray-200
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
