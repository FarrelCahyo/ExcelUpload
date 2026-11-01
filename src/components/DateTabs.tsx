import React, { useState, useRef, useMemo } from 'react';
import { CalendarDays, Layers, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { DailySchedule } from '../types/schedule';

interface DateTabsProps {
  days: DailySchedule[];
  selectedDate: string; // ISO date string or 'ALL'
  onSelectDate: (dateISO: string) => void;
  showAllOption?: boolean;
}

export const DateTabs: React.FC<DateTabsProps> = ({
  days,
  selectedDate,
  onSelectDate,
  showAllOption = true,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeWeekChunk, setActiveWeekChunk] = useState<number | 'ALL'>('ALL');

  // Divide days into chunks of 7 days (weeks) if total days > 7
  const weekChunks = useMemo(() => {
    if (days.length <= 7) return [];
    const chunks: Array<{ weekIndex: number; label: string; days: DailySchedule[] }> = [];
    for (let i = 0; i < days.length; i += 7) {
      const slice = days.slice(i, i + 7);
      const startStr = slice[0]?.dateLabel.split(', ')[1]?.split(' ').slice(0, 2).join(' ') || '';
      const endStr = slice[slice.length - 1]?.dateLabel.split(', ')[1]?.split(' ').slice(0, 2).join(' ') || '';
      chunks.push({
        weekIndex: Math.floor(i / 7) + 1,
        label: `Minggu ${Math.floor(i / 7) + 1} (${startStr} – ${endStr})`,
        days: slice,
      });
    }
    return chunks;
  }, [days]);

  // Days to display based on active week chunk
  const displayedDays = useMemo(() => {
    if (activeWeekChunk === 'ALL' || weekChunks.length === 0) return days;
    const chunk = weekChunks.find((w) => w.weekIndex === activeWeekChunk);
    return chunk ? chunk.days : days;
  }, [days, activeWeekChunk, weekChunks]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const allLabel = days.length <= 7 ? 'Sepekan Penuh' : `Seluruh Periode (${days.length} Hari)`;

  return (
    <div className="space-y-2 mb-4">
      {/* Top Bar for Long Periods (> 7 days): Week Chunks & Direct Dropdown Jump */}
      {weekChunks.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/70 p-2 rounded-xl border border-slate-200/80 text-xs">
          {/* Week chunk tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              Periode:
            </span>
            <button
              onClick={() => setActiveWeekChunk('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeWeekChunk === 'ALL'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Semua ({days.length} Hari)
            </button>
            {weekChunks.map((w) => (
              <button
                key={w.weekIndex}
                onClick={() => setActiveWeekChunk(w.weekIndex)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeWeekChunk === w.weekIndex
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>

          {/* Quick Dropdown Selector */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={selectedDate}
              onChange={(e) => onSelectDate(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1 focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
            >
              {showAllOption && <option value="ALL">📋 {allLabel}</option>}
              {days.map((d) => (
                <option key={d.dateISO} value={d.dateISO}>
                  {d.dateLabel} ({d.dayName})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Date Pills Slider */}
      <div className="relative group">
        {/* Left Scroll Button (desktop) */}
        <button
          onClick={() => handleScroll('left')}
          className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md border border-slate-200 items-center justify-center text-slate-600 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-0.5"
        >
          {showAllOption && (
            <button
              onClick={() => onSelectDate('ALL')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                selectedDate === 'ALL'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/25 ring-2 ring-teal-600/30'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{allLabel}</span>
            </button>
          )}

          {displayedDays.map((day) => {
            const isSelected = selectedDate === day.dateISO;
            const parts = day.dateLabel.split(', ');
            const dayShort = parts[0].slice(0, 3);
            const dateMonth = parts[1] ? parts[1].split(' ').slice(0, 2).join(' ') : day.dateISO;
            const isSunday = day.dayName === 'MINGGU';

            return (
              <button
                key={day.dateISO}
                onClick={() => onSelectDate(day.dateISO)}
                className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[85px] px-3 py-1.5 rounded-xl text-center transition-all shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/25 ring-2 ring-teal-600/30'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected ? 'text-teal-100' : isSunday ? 'text-rose-500 font-extrabold' : 'text-slate-400'
                  }`}
                >
                  {dayShort}
                </span>
                <span className="text-xs font-bold leading-tight mt-0.5">
                  {dateMonth}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button (desktop) */}
        <button
          onClick={() => handleScroll('right')}
          className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md border border-slate-200 items-center justify-center text-slate-600 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
