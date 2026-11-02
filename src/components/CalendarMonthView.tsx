import React, { useMemo, useState } from 'react';
import { DailySchedule } from '../types/schedule';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { RibbonBow, TwinkleStar } from './illustrations';

export interface CalendarMonthViewProps {
  /** Array of parsed daily schedules */
  days: DailySchedule[];
  /** Currently selected date ISO ('YYYY-MM-DD') */
  selectedDate?: string;
  /** Callback fired when a date in the calendar is clicked */
  onSelectDate: (dateISO: string) => void;
  /** Optional callback to navigate directly to 'home' tab upon tapping a date */
  onNavigateHome?: () => void;
  /** Additional CSS class names */
  className?: string;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const WEEKDAY_HEADERS = [
  { label: 'Min', full: 'Minggu', isWeekend: true },
  { label: 'Sen', full: 'Senin', isWeekend: false },
  { label: 'Sel', full: 'Selasa', isWeekend: false },
  { label: 'Rab', full: 'Rabu', isWeekend: false },
  { label: 'Kam', full: 'Kamis', isWeekend: false },
  { label: 'Jum', full: 'Jumat', isWeekend: false },
  { label: 'Sab', full: 'Sabtu', isWeekend: false },
];

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  days,
  selectedDate,
  onSelectDate,
  onNavigateHome,
  className = '',
}) => {
  // Map of dateISO -> DailySchedule for instant lookup
  const daysMap = useMemo(() => {
    const map = new Map<string, DailySchedule>();
    days.forEach((day) => map.set(day.dateISO, day));
    return map;
  }, [days]);

  // Extract distinct Year-Month combinations present in schedule (e.g. ['2026-11'])
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    days.forEach((d) => {
      const parts = d.dateISO.split('-');
      if (parts.length >= 2) {
        set.add(`${parts[0]}-${parts[1]}`);
      }
    });
    return Array.from(set).sort();
  }, [days]);

  // Selected active month (default to month of selectedDate or first available month)
  const [activeMonthKey, setActiveMonthKey] = useState<string>(() => {
    if (selectedDate && selectedDate !== 'ALL') {
      const ym = selectedDate.slice(0, 7);
      if (availableMonths.includes(ym)) return ym;
    }
    return availableMonths[0] || '2026-11';
  });

  // Safe fallback if dataset switches months (e.g. from Nov to Oct)
  const effectiveMonthKey = availableMonths.includes(activeMonthKey)
    ? activeMonthKey
    : (availableMonths[0] || '2026-11');

  // Calculate year and month numbers
  const { year, monthIndex } = useMemo(() => {
    const parts = effectiveMonthKey.split('-');
    const y = parseInt(parts[0], 10) || 2026;
    const m = (parseInt(parts[1], 10) || 1) - 1;
    return { year: y, monthIndex: m };
  }, [effectiveMonthKey]);

  // Days in this month grid (including padding for weekday alignment)
  const { calendarCells, currentMonthStats } = useMemo(() => {
    const firstDay = new Date(Date.UTC(year, monthIndex, 1));
    const firstDayOfWeek = firstDay.getUTCDay(); // 0 = Min, 1 = Sen, ..., 6 = Sab
    const totalDaysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

    interface CalendarCell {
      dayNumber: number;
      dateISO: string;
      isCurrentMonth: boolean;
      scheduleDay?: DailySchedule;
      isAfizDuty: boolean;
      isAfizLeave: boolean;
      isAfizOff: boolean;
      shiftLabels: string[];
    }

    const cells: CalendarCell[] = [];

    // Padding empty cells before day 1
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({
        dayNumber: 0,
        dateISO: '',
        isCurrentMonth: false,
        isAfizDuty: false,
        isAfizLeave: false,
        isAfizOff: false,
        shiftLabels: [],
      });
    }

    // Days 1 to totalDaysInMonth
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const mStr = String(monthIndex + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const iso = `${year}-${mStr}-${dStr}`;

      const scheduleDay = daysMap.get(iso);
      let isAfizDuty = false;
      let isAfizLeave = false;
      let isAfizOff = false;
      const shiftLabels: string[] = [];

      if (scheduleDay) {
        if (scheduleDay.isAfizLeave) {
          isAfizLeave = true;
        } else if (scheduleDay.afizAssignments && scheduleDay.afizAssignments.length > 0) {
          isAfizDuty = true;
          scheduleDay.afizAssignments.forEach((a) => {
            if (!shiftLabels.includes(a.shiftLabel)) {
              shiftLabels.push(a.shiftLabel);
            }
          });
        } else {
          isAfizOff = true;
        }
      }

      cells.push({
        dayNumber: d,
        dateISO: iso,
        isCurrentMonth: true,
        scheduleDay,
        isAfizDuty,
        isAfizLeave,
        isAfizOff,
        shiftLabels,
      });
    }

    // Monthly summary stats for Afiz
    let totalDutyDays = 0;
    let totalShiftsCount = 0;
    let totalLeaveDays = 0;
    let totalOffDays = 0;

    days.forEach((day) => {
      // Check if day belongs to current month
      if (day.dateISO.startsWith(activeMonthKey)) {
        if (day.isAfizLeave) {
          totalLeaveDays++;
        } else if (day.afizAssignments && day.afizAssignments.length > 0) {
          totalDutyDays++;
          totalShiftsCount += day.afizAssignments.length;
        } else {
          totalOffDays++;
        }
      }
    });

    return {
      calendarCells: cells,
      currentMonthStats: {
        totalDutyDays,
        totalShiftsCount,
        totalLeaveDays,
        totalOffDays,
      },
    };
  }, [year, monthIndex, daysMap, days, activeMonthKey]);

  // Month navigation handlers
  const currentMonthIdx = availableMonths.indexOf(activeMonthKey);
  const hasPrevMonth = currentMonthIdx > 0;
  const hasNextMonth = currentMonthIdx < availableMonths.length - 1;

  const handlePrevMonth = () => {
    if (hasPrevMonth) {
      setActiveMonthKey(availableMonths[currentMonthIdx - 1]);
    }
  };

  const handleNextMonth = () => {
    if (hasNextMonth) {
      setActiveMonthKey(availableMonths[currentMonthIdx + 1]);
    }
  };

  const handleCellClick = (dateISO: string) => {
    if (!dateISO) return;
    onSelectDate(dateISO);
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <div className={`w-full max-w-md sm:max-w-2xl mx-auto space-y-4 select-none pb-20 ${className}`}>
      {/* 1. Header & Month Switcher */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-xs p-3.5 sm:p-4 rounded-3xl border border-pink-200/90 shadow-xs relative overflow-visible">
        {/* Sparkle top corner */}
        <div className="absolute -top-1.5 -left-1.5 pointer-events-none">
          <TwinkleStar size={14} color="#FF6B8B" />
        </div>

        {/* Previous Month Button */}
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={!hasPrevMonth}
          aria-label="Bulan sebelumnya"
          className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
            hasPrevMonth
              ? 'bg-pink-50 hover:bg-pink-100 text-[#D63447] border border-pink-200 cursor-pointer active:scale-95'
              : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed opacity-50'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Month & Year Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-100/70 border border-pink-200/80 mb-0.5">
            <span className="text-xs">📅</span>
            <span className="text-[10px] font-black text-[#D63447] uppercase tracking-wider">
              Kalender Shift Afiz
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#4A2E35] tracking-tight">
            {MONTH_NAMES[monthIndex]} {year}
          </h2>
        </div>

        {/* Next Month Button */}
        <button
          type="button"
          onClick={handleNextMonth}
          disabled={!hasNextMonth}
          aria-label="Bulan berikutnya"
          className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
            hasNextMonth
              ? 'bg-pink-50 hover:bg-pink-100 text-[#D63447] border border-pink-200 cursor-pointer active:scale-95'
              : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed opacity-50'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Monthly Summary Card */}
      <div className="lace-card p-4 sm:p-5 relative overflow-visible shadow-sm">
        {/* Corner bows */}
        <div className="absolute -top-3 -left-3 pointer-events-none">
          <RibbonBow size={28} color="#FF6B8B" secondaryColor="#D63447" />
        </div>
        <div className="absolute -bottom-3 -right-3 pointer-events-none">
          <RibbonBow size={28} color="#FF6B8B" secondaryColor="#D63447" />
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🍓</span>
            <span className="text-xs font-black text-[#C2185B] uppercase tracking-wider">
              Ringkasan Jadwal Bulan Ini
            </span>
          </div>
          <span className="text-[10px] font-bold text-pink-500 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
            {days.filter((d) => d.dateISO.startsWith(activeMonthKey)).length} Hari Terdata
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          {/* Dinas Card */}
          <div className="p-2.5 rounded-2xl bg-rose-50/80 border border-rose-200/90 shadow-2xs">
            <span className="text-base sm:text-lg block leading-none mb-1">🍓</span>
            <span className="text-base sm:text-lg font-black text-[#D63447] block leading-none">
              {currentMonthStats.totalDutyDays} Hari
            </span>
            <span className="text-[10px] font-extrabold text-[#9B5160] mt-0.5 block">
              {currentMonthStats.totalShiftsCount} Shift Dinas
            </span>
          </div>

          {/* Cuti Card */}
          <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-2xs">
            <span className="text-base sm:text-lg block leading-none mb-1">☁️</span>
            <span className="text-base sm:text-lg font-black text-amber-800 block leading-none">
              {currentMonthStats.totalLeaveDays} Hari
            </span>
            <span className="text-[10px] font-extrabold text-amber-700 mt-0.5 block">
              Cuti / LP
            </span>
          </div>

          {/* Libur Card */}
          <div className="p-2.5 rounded-2xl bg-pink-50/60 border border-pink-200/80 shadow-2xs">
            <span className="text-base sm:text-lg block leading-none mb-1">🌸</span>
            <span className="text-base sm:text-lg font-black text-[#C2185B] block leading-none">
              {currentMonthStats.totalOffDays} Hari
            </span>
            <span className="text-[10px] font-extrabold text-[#8C5E68] mt-0.5 block">
              Libur Dinas
            </span>
          </div>
        </div>
      </div>

      {/* 3. Monthly Calendar Grid */}
      <div className="bg-white/95 backdrop-blur-xs p-3.5 sm:p-5 rounded-3xl border border-pink-200/90 shadow-sm space-y-2">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center pb-2 border-b border-pink-100">
          {WEEKDAY_HEADERS.map((day, idx) => (
            <div
              key={idx}
              className={`text-xs font-black py-1 select-none ${
                day.isWeekend ? 'text-[#E63956]' : 'text-[#8C5E68]'
              }`}
            >
              {day.label}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarCells.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[64px] sm:min-h-[76px] rounded-2xl bg-pink-50/20 border border-dashed border-pink-100/40 opacity-40 pointer-events-none"
                />
              );
            }

            const isSelected = selectedDate === cell.dateISO;
            const hasSchedule = Boolean(cell.scheduleDay);

            return (
              <button
                key={cell.dateISO}
                type="button"
                onClick={() => hasSchedule && handleCellClick(cell.dateISO)}
                disabled={!hasSchedule}
                aria-label={`Tanggal ${cell.dayNumber} ${MONTH_NAMES[monthIndex]}${
                  cell.isAfizDuty
                    ? `, Dinas shift ${cell.shiftLabels.join(', ')}`
                    : cell.isAfizLeave
                    ? ', Cuti'
                    : hasSchedule
                    ? ', Libur'
                    : ', Tidak terdata'
                }`}
                className={`relative min-h-[64px] sm:min-h-[76px] p-1 sm:p-1.5 rounded-2xl flex flex-col justify-between items-center transition-all duration-150 text-center select-none ${
                  !hasSchedule
                    ? 'bg-slate-50/60 border border-slate-100 opacity-40 cursor-default'
                    : isSelected
                    ? 'bg-gradient-to-b from-pink-50 to-pink-100 border-2 border-[#D63447] shadow-sm shadow-pink-300/50 scale-102 z-10 cursor-pointer'
                    : cell.isAfizDuty
                    ? 'bg-rose-50/90 hover:bg-rose-100/90 border border-rose-200/90 shadow-2xs hover:scale-102 cursor-pointer'
                    : cell.isAfizLeave
                    ? 'bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/90 shadow-2xs hover:scale-102 cursor-pointer'
                    : 'bg-white hover:bg-pink-50/60 border border-pink-100 shadow-2xs hover:scale-102 cursor-pointer'
                }`}
              >
                {/* Top: Day number + Selection badge */}
                <div className="w-full flex items-center justify-between px-0.5">
                  <span
                    className={`text-xs sm:text-sm font-black leading-none ${
                      isSelected
                        ? 'text-[#D63447] font-black scale-110'
                        : cell.isAfizDuty
                        ? 'text-[#C2185B]'
                        : cell.isAfizLeave
                        ? 'text-amber-900'
                        : 'text-[#4A2E35]'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {/* Tiny status icon */}
                  {cell.isAfizDuty && (
                    <span className="text-[11px] leading-none select-none">🍓</span>
                  )}
                  {cell.isAfizLeave && (
                    <span className="text-[11px] leading-none select-none">☁️</span>
                  )}
                </div>

                {/* Center / Bottom: Shift badge pill */}
                <div className="w-full mt-1 flex flex-col items-center gap-0.5">
                  {cell.isAfizDuty ? (
                    cell.shiftLabels.slice(0, 2).map((shift, sIdx) => (
                      <span
                        key={sIdx}
                        className="w-full px-1 py-0.5 rounded-md bg-[#D63447] text-white font-extrabold text-[9px] sm:text-[10px] leading-tight truncate shadow-2xs"
                      >
                        {shift}
                      </span>
                    ))
                  ) : cell.isAfizLeave ? (
                    <span className="w-full px-1 py-0.5 rounded-md bg-amber-200 text-amber-900 font-bold text-[9px] leading-tight truncate">
                      Cuti
                    </span>
                  ) : hasSchedule ? (
                    <span className="text-[9px] font-semibold text-[#8C5E68]/70 leading-tight">
                      Libur
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Calendar Legend & Tap Hint */}
        <div className="pt-3 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          {/* Legend */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 font-bold text-[#D63447]">
              <span>🍓</span>
              <span>Dinas</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-amber-800">
              <span>☁️</span>
              <span>Cuti / LP</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-[#8C5E68]">
              <span>🌸</span>
              <span>Libur</span>
            </div>
          </div>

          {/* Tap Hint */}
          <span className="text-[11px] font-bold text-[#FF6B8B] flex items-center gap-1">
            <span>✨</span>
            <span>Tap tanggal untuk buka di Beranda</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalendarMonthView;
