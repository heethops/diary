
import React, { useState } from 'react';
import { DiaryEntry } from '../types';

interface CalendarProps {
  entries: Record<string, DiaryEntry>;
  onSelectDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ entries, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const formatToISO = (day: number) => {
    const d = new Date(year, month, day);
    return d.toISOString().split('T')[0];
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const hasEntry = (day: number) => {
    return !!entries[formatToISO(day)];
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-light tracking-tight">{monthNames[month]} {year}</h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i className="fa-solid fa-chevron-left text-sm text-gray-500"></i>
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i className="fa-solid fa-chevron-right text-sm text-gray-500"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-300 uppercase tracking-widest">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1">
        {blankDays.map(d => <div key={`blank-${d}`} />)}
        {days.map(day => (
          <div 
            key={day} 
            className="group relative flex flex-col items-center justify-center aspect-square cursor-pointer"
            onClick={() => onSelectDate(formatToISO(day))}
          >
            <div className={`
              w-10 h-10 flex items-center justify-center rounded-full text-sm transition-all
              ${isToday(day) ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'}
            `}>
              {day}
            </div>
            {hasEntry(day) && !isToday(day) && (
              <div className="absolute bottom-1 w-1 h-1 bg-gray-300 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
