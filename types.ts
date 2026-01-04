
export type SectionKey = 'diary' | 'music' | 'place' | 'food' | 'word' | 'gratitude';

export interface Media {
  type: 'image' | 'youtube';
  url: string;
  width?: number;
  height?: number;
}

export interface DiarySection {
  text: string;
  media?: Media;
}

export interface DiaryEntry {
  date: string; // YYYY-MM-DD
  sections: Record<SectionKey, DiarySection>;
}

export interface Todo {
  id: string;
  title: string;
  dueDate: string; // YYYY.MM.DD
  completed: boolean;
  completedDate?: string;
}

export type ViewType = 'main' | 'diary' | 'category';

export interface AppState {
  view: ViewType;
  selectedDate: string;
  selectedCategory?: SectionKey;
  searchQuery: string;
}
