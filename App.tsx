
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MainView from './components/MainView';
import DiaryDetailView from './components/DiaryDetailView';
import CategoryListView from './components/CategoryListView';
import Sidebar from './components/Sidebar';
import { DiaryEntry, Todo, ViewType, SectionKey, AppState } from './types';
import * as storage from './services/storage';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('main');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState<SectionKey | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>(() => storage.loadEntries());
  const [todos, setTodos] = useState<Todo[]>(() => storage.loadTodos());

  // Save data whenever it changes
  useEffect(() => {
    storage.saveEntries(entries);
  }, [entries]);

  useEffect(() => {
    storage.saveTodos(todos);
  }, [todos]);

  const navigateToMain = () => {
    setView('main');
    setSearchQuery('');
  };

  const navigateToDiary = (date: string) => {
    setSelectedDate(date);
    setView('diary');
  };

  const navigateToCategory = (category: SectionKey) => {
    setSelectedCategory(category);
    setView('category');
    setSearchQuery('');
  };

  const updateEntry = (entry: DiaryEntry) => {
    setEntries(prev => ({
      ...prev,
      [entry.date]: entry
    }));
  };

  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Sidebar - Persistent */}
      <Sidebar 
        currentView={view} 
        onNavigateCategory={navigateToCategory} 
        onNavigateMain={navigateToMain} 
      />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        {view === 'main' && (
          <MainView 
            entries={entries} 
            todos={todos} 
            onNavigateDiary={navigateToDiary} 
            onUpdateTodos={updateTodos}
          />
        )}
        
        {view === 'diary' && (
          <DiaryDetailView 
            date={selectedDate} 
            entry={entries[selectedDate]} 
            onSave={updateEntry} 
            onBack={navigateToMain}
            onDateChange={setSelectedDate}
          />
        )}

        {view === 'category' && selectedCategory && (
          <CategoryListView 
            category={selectedCategory} 
            entries={Object.values(entries)} 
            onNavigateDiary={navigateToDiary}
          />
        )}
      </main>
    </div>
  );
};

export default App;
