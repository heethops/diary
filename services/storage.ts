
import { DiaryEntry, Todo } from '../types';

const STORAGE_KEYS = {
  ENTRIES: 'minimal_diary_entries',
  TODOS: 'minimal_diary_todos'
};

export const loadEntries = (): Record<string, DiaryEntry> => {
  const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
  return data ? JSON.parse(data) : {};
};

export const saveEntries = (entries: Record<string, DiaryEntry>) => {
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
};

export const loadTodos = (): Todo[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TODOS);
  return data ? JSON.parse(data) : [];
};

export const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
};
