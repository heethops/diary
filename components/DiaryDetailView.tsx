
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DiaryEntry, SectionKey, Media } from '../types';
import useDiaryHistory from '../hooks/useDiaryHistory';

interface DiaryDetailViewProps {
  date: string;
  entry?: DiaryEntry;
  onSave: (entry: DiaryEntry) => void;
  onBack: () => void;
  onDateChange: (date: string) => void;
}

const DiaryDetailView: React.FC<DiaryDetailViewProps> = ({ date, entry, onSave, onBack, onDateChange }) => {
  // Use a local state that's initialized from the current entry
  const initialData = entry || {
    date,
    sections: {
      diary: { text: '' },
      music: { text: '' },
      place: { text: '' },
      food: { text: '' },
      word: { text: '' },
      gratitude: { text: '' },
    }
  };

  const { state, updateState, undo, redo, canUndo, canRedo } = useDiaryHistory(initialData);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mediaModal, setMediaModal] = useState<{ section: SectionKey } | null>(null);

  // Sync state if date prop changes (though history hook usually manages this)
  useEffect(() => {
    // If the date prop changes, we might need to reset history, but usually onDateChange is triggered by us.
  }, [date]);

  // Auto-save logic
  useEffect(() => {
    onSave(state);
  }, [state, onSave]);

  const handleSectionChange = (key: SectionKey, text: string) => {
    updateState({
      ...state,
      sections: {
        ...state.sections,
        [key]: { ...state.sections[key], text }
      }
    });
  };

  const addMedia = (key: SectionKey, type: 'image' | 'youtube', url: string) => {
    updateState({
      ...state,
      sections: {
        ...state.sections,
        [key]: {
          ...state.sections[key],
          media: { type, url, width: 200, height: 150 }
        }
      }
    });
    setMediaModal(null);
  };

  const removeMedia = (key: SectionKey) => {
    updateState({
      ...state,
      sections: {
        ...state.sections,
        [key]: { ...state.sections[key], media: undefined }
      }
    });
  };

  const sections: { key: SectionKey; label: string; placeholder: string; fullWidth?: boolean }[] = [
    { key: 'diary', label: '오늘의 일기', placeholder: '일기를 입력하세요...', fullWidth: true },
    { key: 'music', label: '오늘의 노래', placeholder: '노래를 입력하세요...' },
    { key: 'place', label: '오늘의 장소', placeholder: '장소를 입력하세요...' },
    { key: 'food', label: '오늘의 음식', placeholder: '음식을 입력하세요...' },
    { key: 'word', label: '오늘의 한마디', placeholder: '한마디를 입력하세요...' },
    { key: 'gratitude', label: '오늘의 감사한 일', placeholder: '1.\n2.\n3.', fullWidth: true },
  ];

  const handleTab = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      if (index < sections.length - 1) {
        e.preventDefault();
        const nextId = `section-${sections[index+1].key}`;
        document.getElementById(nextId)?.focus();
      }
    } else if (e.key === 'Tab' && e.shiftKey) {
      if (index > 0) {
        e.preventDefault();
        const prevId = `section-${sections[index-1].key}`;
        document.getElementById(prevId)?.focus();
      }
    }
  };

  return (
    <div className="min-h-full bg-white flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
          >
            main
          </button>
          <div className="relative">
            <div 
              className="text-xl font-bold tracking-tight cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              {date.replace(/-/g, '.')}
            </div>
            {showDatePicker && (
              <div className="absolute top-full left-0 z-50 bg-white border border-gray-100 shadow-xl rounded-xl p-2 mt-2">
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => {
                    onDateChange(e.target.value);
                    setShowDatePicker(false);
                  }}
                  className="outline-none p-1"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          <button 
            disabled={!canUndo} 
            onClick={undo}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${canUndo ? 'hover:bg-gray-100 text-black' : 'text-gray-200'}`}
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button 
            disabled={!canRedo} 
            onClick={redo}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${canRedo ? 'hover:bg-gray-100 text-black' : 'text-gray-200'}`}
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200">
        {sections.map((sec, idx) => (
          <div 
            key={sec.key} 
            className={`p-6 border-b border-r border-gray-200 last:border-b-0 ${sec.fullWidth ? 'md:col-span-2' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{sec.label}</span>
              <button 
                onClick={() => setMediaModal({ section: sec.key })}
                className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-black transition-colors"
              >
                <i className="fa-solid fa-plus text-sm"></i>
              </button>
            </div>
            
            <div className="relative">
              {state.sections[sec.key].media && (
                <div className="mb-4 relative group inline-block max-w-full">
                  <div className="resizable-media border border-gray-100 rounded-lg overflow-hidden relative">
                    {state.sections[sec.key].media?.type === 'image' ? (
                      <img src={state.sections[sec.key].media?.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <iframe 
                        className="w-full h-full"
                        src={getYouTubeEmbedUrl(state.sections[sec.key].media?.url || '')}
                        frameBorder="0"
                        allowFullScreen
                      />
                    )}
                    <button 
                      onClick={() => removeMedia(sec.key)}
                      className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fa-solid fa-xmark text-xs"></i>
                    </button>
                  </div>
                </div>
              )}
              <textarea
                id={`section-${sec.key}`}
                placeholder={sec.placeholder}
                value={state.sections[sec.key].text}
                onChange={(e) => handleSectionChange(sec.key, e.target.value)}
                onKeyDown={(e) => handleTab(e, idx)}
                rows={sec.key === 'diary' ? 8 : (sec.key === 'gratitude' ? 5 : 2)}
                className="w-full outline-none text-sm leading-relaxed text-gray-700 bg-transparent resize-none placeholder-gray-300 overflow-hidden"
                style={{ height: 'auto', minHeight: '3em' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Media Modal */}
      {mediaModal && (
        <MediaModal 
          onClose={() => setMediaModal(null)} 
          onAdd={(type, url) => addMedia(mediaModal.section, type, url)}
        />
      )}
    </div>
  );
};

// Helper for YouTube
function getYouTubeEmbedUrl(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  return id ? `https://www.youtube.com/embed/${id}` : '';
}

interface MediaModalProps {
  onClose: () => void;
  onAdd: (type: 'image' | 'youtube', url: string) => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ onClose, onAdd }) => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'image' | 'youtube'>('image');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAdd('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold">미디어 추가</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex border border-gray-100 rounded-lg overflow-hidden">
            <button 
              onClick={() => setType('image')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${type === 'image' ? 'bg-black text-white' : 'bg-white text-gray-400'}`}
            >
              이미지
            </button>
            <button 
              onClick={() => setType('youtube')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${type === 'youtube' ? 'bg-black text-white' : 'bg-white text-gray-400'}`}
            >
              YouTube
            </button>
          </div>

          {type === 'image' && (
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="이미지 URL 입력..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full border border-gray-100 rounded-lg p-3 text-sm outline-none focus:border-black"
              />
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden" 
                  id="file-upload" 
                />
                <label 
                  htmlFor="file-upload" 
                  className="block w-full text-center border-2 border-dashed border-gray-100 rounded-lg py-4 cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-400"
                >
                  <i className="fa-solid fa-upload mr-2"></i>파일 선택
                </label>
              </div>
            </div>
          )}

          {type === 'youtube' && (
            <input 
              type="text" 
              placeholder="YouTube 영상 링크 입력..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-gray-100 rounded-lg p-3 text-sm outline-none focus:border-black"
            />
          )}

          <button 
            onClick={() => url && onAdd(type, url)}
            disabled={!url && type !== 'image'}
            className="w-full py-3 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-all disabled:opacity-30"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryDetailView;
