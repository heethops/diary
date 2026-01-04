
import { useState, useCallback, useRef } from 'react';
import { DiaryEntry } from '../types';

export default function useDiaryHistory(initialData: DiaryEntry) {
  const [state, setState] = useState<DiaryEntry>(initialData);
  const history = useRef<DiaryEntry[]>([initialData]);
  const pointer = useRef<number>(0);

  const updateState = useCallback((newData: DiaryEntry) => {
    // Only push to history if it's substantially different to avoid bloating
    // Here we just update the current state and manage history logic
    setState(newData);
    
    // Simple debounce/throttle would be better for high frequency events like typing
    // but for this implementation we update history pointers.
    // To keep it simple, we push to history when called, replacing future states.
    const newHistory = history.current.slice(0, pointer.current + 1);
    newHistory.push(newData);
    
    // Limit history size to 50
    if (newHistory.length > 50) newHistory.shift();
    
    history.current = newHistory;
    pointer.current = newHistory.length - 1;
  }, []);

  const undo = useCallback(() => {
    if (pointer.current > 0) {
      pointer.current -= 1;
      setState(history.current[pointer.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (pointer.current < history.current.length - 1) {
      pointer.current += 1;
      setState(history.current[pointer.current]);
    }
  }, []);

  return {
    state,
    updateState,
    undo,
    redo,
    canUndo: pointer.current > 0,
    canRedo: pointer.current < history.current.length - 1
  };
}
