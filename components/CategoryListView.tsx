
import React, { useState, useMemo } from 'react';
import { DiaryEntry, SectionKey } from '../types';

interface CategoryListViewProps {
  category: SectionKey;
  entries: DiaryEntry[];
  onNavigateDiary: (date: string) => void;
}

const CategoryListView: React.FC<CategoryListViewProps> = ({ category, entries, onNavigateDiary }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = useMemo(() => {
    return entries
      .filter(entry => {
        const section = entry.sections[category];
        const hasContent = section.text.trim() || section.media;
        if (!hasContent) return false;
        
        if (!searchTerm.trim()) return true;
        return section.text.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, category, searchTerm]);

  const categoryLabels: Record<SectionKey, string> = {
    diary: '일기',
    music: '노래',
    place: '장소',
    food: '음식',
    word: '한마디',
    gratitude: '감사'
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-light mb-6"># {categoryLabels[category]} 모아보기</h2>
        <div className="flex items-center border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-100 transition-all">
          <i className="fa-solid fa-search text-gray-300 mr-3"></i>
          <input 
            type="text" 
            placeholder={`${categoryLabels[category]} 내에서 검색...`}
            className="w-full bg-transparent outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {filteredEntries.map(entry => {
          const section = entry.sections[category];
          return (
            <div 
              key={entry.date}
              onClick={() => onNavigateDiary(entry.date)}
              className="flex items-start space-x-6 p-4 rounded-2xl border border-gray-50 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all bg-white group"
            >
              {/* Thumbnail */}
              <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform">
                {section.media ? (
                  section.media.type === 'image' ? (
                    <img src={section.media.url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                      <i className="fa-brands fa-youtube text-red-600 text-3xl"></i>
                    </div>
                  )
                ) : (
                  <i className="fa-regular fa-note-sticky text-gray-200 text-2xl"></i>
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">{entry.date.replace(/-/g, '.')}</div>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {section.text || (section.media ? '미디어 파일이 첨부되었습니다.' : '내용 없음')}
                </p>
              </div>
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="text-center py-20 text-gray-300">
            <i className="fa-regular fa-folder-open text-4xl mb-4 block"></i>
            <p className="text-sm">저장된 기록이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryListView;
