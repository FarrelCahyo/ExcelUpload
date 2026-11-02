import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { DailySchedule } from '../types/schedule';
import { StrawberryPill } from './illustrations';

export interface StrawberryDateTabsProps {
  /** Array of daily schedules */
  days: DailySchedule[];
  /** Selected date (ISO string 'YYYY-MM-DD' or 'ALL') */
  selectedDate: string;
  /** Callback fired when a date tab is selected */
  onSelectDate: (dateISO: string) => void;
  /** Whether to show the 'Semua' (All dates) tab option. Default is false. */
  showAllOption?: boolean;
  /** Additional CSS class names */
  className?: string;
}

export const StrawberryDateTabs: React.FC<StrawberryDateTabsProps> = ({
  days,
  selectedDate,
  onSelectDate,
  showAllOption = false,
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // 1. Divide days into 7-day chunks (weeks) if total days > 7
  const weekChunks = useMemo(() => {
    if (days.length <= 7) return [];
    const chunks: Array<{
      weekIndex: number;
      label: string;
      shortLabel: string;
      days: DailySchedule[];
    }> = [];

    for (let i = 0; i < days.length; i += 7) {
      const slice = days.slice(i, i + 7);
      const startDay = slice[0]?.dayNumber ?? slice[0]?.dateISO.split('-')[2] ?? '1';
      const endDay = slice[slice.length - 1]?.dayNumber ?? slice[slice.length - 1]?.dateISO.split('-')[2] ?? '';
      const month = slice[0]?.dateLabel.split(', ')[1]?.split(' ')[1] || '';
      const weekNum = Math.floor(i / 7) + 1;

      chunks.push({
        weekIndex: weekNum,
        label: `Minggu ${weekNum} (${startDay}–${endDay} ${month})`,
        shortLabel: `Mg ${weekNum} (${startDay}–${endDay})`,
        days: slice,
      });
    }
    return chunks;
  }, [days]);

  const [activeWeekChunk, setActiveWeekChunk] = useState<number | 'ALL'>('ALL');

  // Auto-sync active week chunk when selectedDate changes from an external control
  useEffect(() => {
    if (selectedDate && selectedDate !== 'ALL' && weekChunks.length > 0) {
      const chunk = weekChunks.find((w) => w.days.some((d) => d.dateISO === selectedDate));
      if (chunk && activeWeekChunk !== 'ALL' && activeWeekChunk !== chunk.weekIndex) {
        setActiveWeekChunk(chunk.weekIndex);
      }
    }
  }, [selectedDate, weekChunks, activeWeekChunk]);

  // Displayed days based on active week chunk filter
  const displayedDays = useMemo(() => {
    if (activeWeekChunk === 'ALL' || weekChunks.length === 0) return days;
    const chunk = weekChunks.find((w) => w.weekIndex === activeWeekChunk);
    return chunk ? chunk.days : days;
  }, [days, activeWeekChunk, weekChunks]);

  // Smooth auto-scroll to center the active date tab
  useEffect(() => {
    if (!selectedDate) return;
    const targetEl = tabRefs.current.get(selectedDate);
    const container = scrollContainerRef.current;
    if (targetEl && container) {
      const scrollLeft =
        targetEl.offsetLeft - container.clientWidth / 2 + targetEl.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
    }
  }, [selectedDate, displayedDays]);

  // Desktop smooth scroll buttons
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`w-full max-w-md sm:max-w-xl mx-auto space-y-2 select-none ${className}`}>
      {/* 1. Week Jumper Pills (Visible when days > 7) */}
      {weekChunks.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
          <span className="text-[10px] font-extrabold text-[#9B5160] uppercase tracking-wider mr-0.5 shrink-0 flex items-center gap-1">
            <CalendarDays className="w-3 h-3 text-[#FF6B8B]" />
            <span>Minggu:</span>
          </span>
          <button
            type="button"
            onClick={() => setActiveWeekChunk('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-black whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${
              activeWeekChunk === 'ALL'
                ? 'bg-[#D63447] text-white shadow-xs'
                : 'bg-white/85 hover:bg-pink-100 text-[#4A2E35] border border-pink-200/80'
            }`}
          >
            Semua ({days.length} Hari)
          </button>
          {weekChunks.map((w) => (
            <button
              key={w.weekIndex}
              type="button"
              onClick={() => {
                setActiveWeekChunk(w.weekIndex);
                // If current selected date is not in this week, pick first day of week
                const isInWeek = w.days.some((d) => d.dateISO === selectedDate);
                if (!isInWeek && w.days[0]) {
                  onSelectDate(w.days[0].dateISO);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${
                activeWeekChunk === w.weekIndex
                  ? 'bg-[#FF6B8B] text-white shadow-xs'
                  : 'bg-white/85 hover:bg-pink-100 text-[#4A2E35] border border-pink-200/80'
              }`}
            >
              {w.shortLabel}
            </button>
          ))}
        </div>
      )}

      {/* 2. Strawberry Date Pills Container */}
      <div className="relative group">
        {/* Left Scroll Button (Desktop hover) */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 shadow-md border border-pink-200 items-center justify-center text-[#FF6B8B] hover:text-[#D63447] hover:bg-pink-50 active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Horizontal Strawberry Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-2 px-1"
        >
          {/* Optional 'Semua' (All Dates) Tab */}
          {showAllOption && (
            <button
              ref={(el) => {
                if (el) tabRefs.current.set('ALL', el);
                else tabRefs.current.delete('ALL');
              }}
              type="button"
              onClick={() => onSelectDate('ALL')}
              aria-label={`Tampilkan semua ${days.length} hari jadwal`}
              aria-pressed={selectedDate === 'ALL'}
              className={`relative shrink-0 flex flex-col items-center justify-center min-w-[64px] h-[76px] px-2 rounded-3xl transition-all duration-200 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-pink-400 select-none ${
                selectedDate === 'ALL'
                  ? 'bg-gradient-to-b from-[#FF6B8B] to-[#D63447] text-white shadow-md shadow-pink-300/60 ring-2 ring-pink-400 scale-105 strawberry-glow z-10'
                  : 'bg-white/90 hover:bg-pink-50/80 text-[#4A2E35] border-2 border-dashed border-pink-200/90 hover:border-pink-300 z-0'
              }`}
            >
              <span className="text-xl leading-none">🍓</span>
              <span className="text-xs font-black tracking-tight mt-1">Semua</span>
              <span
                className={`text-[9px] font-bold tracking-tight ${
                  selectedDate === 'ALL' ? 'text-white/90' : 'text-[#8C5E68]'
                }`}
              >
                {days.length} Hari
              </span>
            </button>
          )}

          {/* Daily Strawberry Tabs */}
          {displayedDays.map((day) => {
            const isSelected = selectedDate === day.dateISO;
            const parts = day.dateLabel ? day.dateLabel.split(', ') : ['', ''];
            const dayShort =
              day.dayShort || (parts[0] ? parts[0].slice(0, 3) : day.dayName.slice(0, 3));
            const dayNumber =
              day.dayNumber ??
              parseInt(parts[1]?.split(' ')[0] || day.dateISO.split('-')[2] || '1', 10);
            const monthStr = parts[1]?.split(' ')[1] || 'Nov';
            const isSunday = day.dayName === 'MINGGU';

            return (
              <button
                key={day.dateISO}
                ref={(el) => {
                  if (el) {
                    tabRefs.current.set(day.dateISO, el);
                  } else {
                    tabRefs.current.delete(day.dateISO);
                  }
                }}
                type="button"
                onClick={() => onSelectDate(day.dateISO)}
                aria-label={`${day.dateLabel} (${day.dayName})`}
                aria-pressed={isSelected}
                className={`relative shrink-0 flex flex-col items-center justify-center p-0 bg-transparent border-0 cursor-pointer rounded-2xl transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-pink-400 ${
                  isSelected
                    ? 'scale-105 strawberry-glow z-10'
                    : 'hover:scale-102 hover:opacity-95 z-0'
                }`}
              >
                <StrawberryPill active={isSelected} size={64}>
                  <div className="flex flex-col items-center justify-center leading-none select-none pointer-events-none">
                    {/* Day Name (e.g. SEN, SEL, MIN) */}
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider ${
                        isSelected
                          ? 'text-white/95 drop-shadow-2xs'
                          : isSunday
                          ? 'text-[#E63956] font-black'
                          : 'text-[#9B5160] font-extrabold'
                      }`}
                    >
                      {dayShort}
                    </span>

                    {/* Date Number (e.g. 1, 2, 31) */}
                    <span
                      className={`text-sm sm:text-base font-black leading-tight mt-0.5 ${
                        isSelected ? 'text-white drop-shadow-2xs' : 'text-[#4A2E35]'
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {/* Month (e.g. Nov, Des) */}
                    <span
                      className={`text-[9px] font-bold tracking-tight -mt-0.5 ${
                        isSelected ? 'text-white/90' : 'text-[#8C5E68]'
                      }`}
                    >
                      {monthStr}
                    </span>
                  </div>
                </StrawberryPill>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button (Desktop hover) */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 shadow-md border border-pink-200 items-center justify-center text-[#FF6B8B] hover:text-[#D63447] hover:bg-pink-50 active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StrawberryDateTabs;
