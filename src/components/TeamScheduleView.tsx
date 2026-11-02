import React, { useState, useMemo } from 'react';
import { DailySchedule, SlotAssignment } from '../types/schedule';
import { Search, X, Users, Stethoscope, Clock, Filter, CalendarDays, Palmtree, UserCheck } from 'lucide-react';
import { getDoctorBadgeInfo } from './PrincessShiftCard';
import { TwinkleStar, RibbonBow } from './illustrations';

export interface TeamScheduleViewProps {
  /** Array of daily schedules from uploaded file */
  days: DailySchedule[];
  /** Currently selected date ISO ('YYYY-MM-DD') */
  selectedDate?: string;
  /** Callback fired when a date is selected */
  onSelectDate?: (dateISO: string) => void;
  /** Additional CSS class names */
  className?: string;
}

type TeamSubTab = 'daily' | 'search';

export const TeamScheduleView: React.FC<TeamScheduleViewProps> = ({
  days,
  selectedDate,
  onSelectDate,
  className = '',
}) => {
  // Sub-tab selection: 'daily' (Jadwal Harian) or 'search' (Cari Dokter & Asisten)
  const [subTab, setSubTab] = useState<TeamSubTab>('daily');

  // Currently active date for the daily roster
  const [internalSelectedDate, setInternalSelectedDate] = useState<string>(() => {
    if (selectedDate && selectedDate !== 'ALL' && days.some((d) => d.dateISO === selectedDate)) {
      return selectedDate;
    }
    return days[0]?.dateISO || '';
  });

  const activeDate = selectedDate && selectedDate !== 'ALL' ? selectedDate : internalSelectedDate;

  const handleDateChange = (dateISO: string) => {
    setInternalSelectedDate(dateISO);
    if (onSelectDate) {
      onSelectDate(dateISO);
    }
  };

  // Active day object for 'daily' view
  const currentDay = useMemo(() => {
    return days.find((d) => d.dateISO === activeDate) || days[0];
  }, [days, activeDate]);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('ALL');

  // All unique doctors across all days
  const allDoctors = useMemo(() => {
    const docSet = new Set<string>();
    days.forEach((day) => {
      day.assignments.forEach((assignment) => {
        // Use parsed doctors if present
        if (assignment.doctors && assignment.doctors.length > 0) {
          assignment.doctors.forEach((doc) => docSet.add(doc.trim()));
        } else {
          // Fallback to searching tasks
          assignment.tasks.forEach((task) => {
            if (/dr\.|prof\./i.test(task)) {
              docSet.add(task.trim());
            }
          });
        }
      });
    });
    return Array.from(docSet).sort((a, b) => a.localeCompare(b, 'id'));
  }, [days]);

  // All unique assistants across all days
  const allAssistants = useMemo(() => {
    const astSet = new Set<string>();
    days.forEach((day) => {
      day.assignments.forEach((assignment) => {
        assignment.rawAssignees.forEach((name) => {
          if (!/^(semua|mcu)$/i.test(name.trim())) {
            astSet.add(name.trim());
          }
        });
      });
      day.leaveNotes.forEach((note) => {
        const parts = note.split(/\s+(cuti|lp)/i);
        if (parts[0] && parts[0].trim().length > 1) {
          astSet.add(parts[0].trim());
        }
      });
    });
    return Array.from(astSet).sort((a, b) => a.localeCompare(b, 'id'));
  }, [days]);

  // Search results across ALL days
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();

    const results: Array<{
      dateISO: string;
      dateLabel: string;
      dayName: string;
      slotId: number;
      shiftLabel: string;
      doctors: string[];
      rawAssignees: string[];
      matchingTasks: string[];
      allTasks: string[];
      isAfizDuty: boolean;
    }> = [];

    days.forEach((day) => {
      day.assignments.forEach((assignment) => {
        const matchesAssignee = assignment.rawAssignees.some((name) =>
          name.toLowerCase().includes(q)
        );
        const matchesDoctor = (assignment.doctors || []).some((doc) =>
          doc.toLowerCase().includes(q)
        );
        const matchesTask = assignment.tasks.some((t) => t.toLowerCase().includes(q));
        const matchesShift = assignment.shiftLabel.toLowerCase().includes(q);

        if (matchesAssignee || matchesDoctor || matchesTask || matchesShift) {
          const matchingTasks = assignment.tasks.filter((t) => t.toLowerCase().includes(q));
          results.push({
            dateISO: day.dateISO,
            dateLabel: day.dateLabel,
            dayName: day.dayName,
            slotId: assignment.slotId,
            shiftLabel: assignment.shiftLabel,
            doctors: assignment.doctors || [],
            rawAssignees: assignment.rawAssignees,
            matchingTasks,
            allTasks: assignment.tasks,
            isAfizDuty: assignment.rawAssignees.some((name) => /afiz/i.test(name)),
          });
        }
      });
    });

    return results;
  }, [days, searchTerm]);

  // Filtered assignments for the selected day in 'daily' mode
  const dailyFilteredAssignments = useMemo(() => {
    if (!currentDay) return [];
    let list = currentDay.assignments.filter((a) => a.slotId !== 28); // Exclude collective BPJS row for regular slots

    if (selectedShiftFilter !== 'ALL') {
      list = list.filter((a) => a.shiftLabel === selectedShiftFilter);
    }

    if (searchTerm.trim() && subTab === 'daily') {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((a) => {
        const matchesAssignee = a.rawAssignees.some((name) => name.toLowerCase().includes(q));
        const matchesDoc = (a.doctors || []).some((d) => d.toLowerCase().includes(q));
        const matchesTask = a.tasks.some((t) => t.toLowerCase().includes(q));
        return matchesAssignee || matchesDoc || matchesTask;
      });
    }

    return list;
  }, [currentDay, selectedShiftFilter, searchTerm, subTab]);

  // Distinct shift labels available on current day
  const availableShifts = useMemo(() => {
    if (!currentDay) return [];
    const set = new Set<string>();
    currentDay.assignments.forEach((a) => {
      if (a.slotId !== 28) set.add(a.shiftLabel);
    });
    return Array.from(set);
  }, [currentDay]);

  // Collective BPJS task assignment on current day if any
  const collectiveTask = useMemo(() => {
    return currentDay?.assignments.find((a) => a.slotId === 28);
  }, [currentDay]);

  return (
    <div className={`w-full max-w-md sm:max-w-2xl mx-auto space-y-4 select-none pb-24 ${className}`}>
      {/* 1. Header Banner */}
      <div className="bg-white/90 backdrop-blur-xs p-4 sm:p-5 rounded-3xl border border-pink-200/90 shadow-xs relative overflow-visible">
        <div className="absolute -top-1.5 -left-1.5 pointer-events-none">
          <TwinkleStar size={14} color="#FF6B8B" />
        </div>

        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#D63447] text-lg shadow-2xs">
              👥
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#4A2E35] tracking-tight">
                Jadwal Teman & Dokter Poli 🩺
              </h2>
              <p className="text-[11px] font-semibold text-[#8C5E68]">
                Pantau rekan dinas dan cari dokter untuk koordinasi atau tukar shift.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tab Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-pink-50/80 rounded-2xl border border-pink-200/70 mt-3">
          <button
            type="button"
            onClick={() => setSubTab('daily')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'daily'
                ? 'bg-white text-[#D63447] shadow-xs'
                : 'text-[#8C5E68] hover:text-[#D63447]'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#FF6B8B]" />
            <span>Jadwal Harian Tim</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('search')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'search'
                ? 'bg-white text-[#D63447] shadow-xs'
                : 'text-[#8C5E68] hover:text-[#D63447]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#FF6B8B]" />
            <span>Cari Dokter & Asisten</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW MODE 1: JADWAL HARIAN TIM */}
      {/* ======================================================== */}
      {subTab === 'daily' && currentDay && (
        <div className="space-y-4">
          {/* Day Selector (Horizontal Date Tabs) */}
          <div className="bg-white/90 backdrop-blur-xs p-3 rounded-3xl border border-pink-200/90 shadow-xs">
            <span className="text-[10px] font-extrabold text-[#9B5160] uppercase tracking-wider block mb-2 px-1">
              Pilih Hari:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5">
              {days.map((day) => {
                const isSelected = activeDate === day.dateISO;
                const parts = day.dateLabel.split(', ');
                const dayShort = day.dayShort || parts[0]?.slice(0, 3) || day.dayName.slice(0, 3);
                const dayNum = day.dayNumber || day.dateISO.split('-')[2];

                return (
                  <button
                    key={day.dateISO}
                    type="button"
                    onClick={() => handleDateChange(day.dateISO)}
                    className={`shrink-0 px-3 py-1.5 rounded-2xl flex flex-col items-center min-w-[56px] transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#D63447] text-white border-[#D63447] shadow-xs scale-105'
                        : 'bg-pink-50/70 hover:bg-pink-100/80 text-[#4A2E35] border-pink-200/80'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      {dayShort}
                    </span>
                    <span className="text-sm font-black leading-none mt-0.5">
                      {dayNum}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Search & Shift Filter */}
          <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-3xl border border-pink-200/90 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-[#FF6B8B] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter asisten (misal: Nurul, Afiz) atau dokter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-pink-50/60 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400 font-semibold text-[#4A2E35] placeholder:text-[#9B5160]/60"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 p-0.5 rounded-full text-pink-400 hover:text-pink-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Shift pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs pt-0.5">
              <span className="text-[10px] font-black text-[#9B5160] uppercase mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#FF6B8B]" /> Shift:
              </span>
              <button
                type="button"
                onClick={() => setSelectedShiftFilter('ALL')}
                className={`px-2.5 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-colors cursor-pointer ${
                  selectedShiftFilter === 'ALL'
                    ? 'bg-[#FF6B8B] text-white shadow-2xs'
                    : 'bg-pink-50 hover:bg-pink-100 text-[#4A2E35] border border-pink-200/80'
                }`}
              >
                Semua
              </button>
              {availableShifts.map((shift) => (
                <button
                  key={shift}
                  type="button"
                  onClick={() => setSelectedShiftFilter(shift)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-colors cursor-pointer ${
                    selectedShiftFilter === shift
                      ? 'bg-[#FF6B8B] text-white shadow-2xs'
                      : 'bg-pink-50 hover:bg-pink-100 text-[#4A2E35] border border-pink-200/80'
                  }`}
                >
                  {shift}
                </button>
              ))}
            </div>
          </div>

          {/* Leave & LP Notice for Today */}
          {currentDay.leaveNotes && currentDay.leaveNotes.length > 0 && (
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-3xl p-3.5 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wider">
                <Palmtree className="w-4 h-4 text-amber-600" />
                <span>Rekan Cuti / Libur Pengganti ({currentDay.leaveNotes.length} Orang)</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {currentDay.leaveNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-amber-900 border border-amber-200 shadow-2xs"
                  >
                    <span>☁️</span>
                    <span>{note}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Slots List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-[#4A2E35]">
                {currentDay.dateLabel} ({dailyFilteredAssignments.length} Slot)
              </span>
            </div>

            {dailyFilteredAssignments.length === 0 ? (
              <div className="bg-white/80 rounded-3xl p-6 text-center border border-pink-200/80 text-[#8C5E68]">
                <p className="text-xs font-bold">Tidak ada penugasan yang cocok dengan pencarian.</p>
              </div>
            ) : (
              dailyFilteredAssignments.map((slot) => {
                const isAfizHere = slot.rawAssignees.some((name) => /afiz/i.test(name));

                return (
                  <div
                    key={slot.slotId}
                    className={`p-4 rounded-3xl border transition-all ${
                      isAfizHere
                        ? 'bg-rose-50/80 border-rose-300 shadow-xs ring-1 ring-rose-200'
                        : 'bg-white/95 border-pink-200/90 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    {/* Slot Header */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-pink-100 text-[#C2185B] border border-pink-200">
                          <Clock className="w-3 h-3 text-[#FF6B8B]" />
                          Shift {slot.shiftLabel}
                        </span>
                        <span className="text-[10px] font-bold text-pink-400">
                          Slot #{slot.slotId}
                        </span>
                      </div>

                      {isAfizHere && (
                        <span className="px-2 py-0.5 rounded-full bg-[#D63447] text-white text-[10px] font-black shadow-2xs animate-pulse">
                          Afiz Bertugas 🍓
                        </span>
                      )}
                    </div>

                    {/* Doctors List */}
                    {slot.doctors && slot.doctors.length > 0 ? (
                      <div className="space-y-1.5 mb-3">
                        {slot.doctors.map((doc, dIdx) => {
                          const badge = getDoctorBadgeInfo(doc);
                          return (
                            <div
                              key={dIdx}
                              className="flex items-center gap-2 p-2 rounded-xl bg-pink-50/50 border border-pink-100 text-xs font-extrabold text-[#4A2E35]"
                            >
                              <span className="text-sm select-none">{badge.icon}</span>
                              <span className="truncate flex-1">{doc}</span>
                              <span className="text-[10px] text-pink-500 font-bold shrink-0">
                                {badge.typeLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mb-2">
                        {slot.tasks.slice(0, 2).map((task, tIdx) => (
                          <p key={tIdx} className="text-xs font-semibold text-[#8C5E68] italic">
                            • {task}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Assigned Assistants Footer */}
                    <div className="pt-2 border-t border-pink-100 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[11px] font-extrabold text-[#9B5160] flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#FF6B8B]" /> Asisten:
                      </span>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {slot.rawAssignees.length === 0 ? (
                          <span className="text-xs text-pink-300 italic font-semibold">
                            Belum terisi
                          </span>
                        ) : (
                          slot.rawAssignees.map((name, aIdx) => {
                            const isAfiz = /afiz/i.test(name);
                            return (
                              <span
                                key={aIdx}
                                className={`px-2.5 py-0.5 rounded-full text-xs font-black shadow-2xs ${
                                  isAfiz
                                    ? 'bg-[#D63447] text-white'
                                    : 'bg-pink-100 text-[#C2185B]'
                                }`}
                              >
                                {isAfiz ? 'Afiz 💖' : name}
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Collective BPJS Task if present */}
            {collectiveTask && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-pink-50 border border-amber-200 text-xs font-bold text-amber-900 shadow-2xs flex items-center gap-2">
                <span className="text-base">📋</span>
                <div className="flex-1">
                  <span className="font-black text-[#D63447] block text-[10px] uppercase">
                    Tugas Bersama (Semua Shift):
                  </span>
                  <span>{collectiveTask.tasks.join(' • ')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW MODE 2: CARI DOKTER & ASISTEN */}
      {/* ======================================================== */}
      {subTab === 'search' && (
        <div className="space-y-4">
          {/* Search Card */}
          <div className="bg-white/90 backdrop-blur-xs p-4 sm:p-5 rounded-3xl border border-pink-200/90 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#FF6B8B] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Ketik nama dokter (misal: dr. Rheza) atau asisten (misal: Dwi Ulfa)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-pink-50/70 rounded-2xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400 font-bold text-[#4A2E35] placeholder:text-[#9B5160]/60"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 p-0.5 rounded-full text-pink-400 hover:text-pink-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Click Doctors */}
            <div>
              <span className="text-[10px] font-black text-[#9B5160] uppercase tracking-wider block mb-1.5 px-0.5">
                🩺 Dokter Terdaftar ({allDoctors.length}):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap max-h-28 overflow-y-auto pt-0.5 no-scrollbar">
                {allDoctors.slice(0, 14).map((doc) => {
                  const shortName = doc.replace(/^dr\.\s*/i, '').split(' ')[0];
                  return (
                    <button
                      key={doc}
                      type="button"
                      onClick={() => setSearchTerm(shortName)}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-pink-50/80 hover:bg-pink-100 text-[#C2185B] border border-pink-200/70 transition-colors cursor-pointer"
                    >
                      {doc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Click Colleagues */}
            <div className="pt-2 border-t border-pink-100">
              <span className="text-[10px] font-black text-[#9B5160] uppercase tracking-wider block mb-1.5 px-0.5">
                👩‍⚕️ Rekan Asisten ({allAssistants.length}):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap max-h-24 overflow-y-auto pt-0.5 no-scrollbar">
                {allAssistants.slice(0, 12).map((asst) => (
                  <button
                    key={asst}
                    type="button"
                    onClick={() => setSearchTerm(asst)}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50/60 hover:bg-rose-100 text-[#4A2E35] border border-pink-200/70 transition-colors cursor-pointer"
                  >
                    {asst === 'Afiz' ? 'Afiz 💖' : asst}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {searchTerm.trim() === '' ? (
            <div className="bg-white/80 rounded-3xl p-8 text-center border border-pink-200/80 text-[#8C5E68]">
              <Stethoscope className="w-8 h-8 mx-auto mb-2 text-[#FF6B8B]" />
              <p className="text-sm font-bold text-[#4A2E35]">
                Pilih atau ketik nama dokter / asisten di atas.
              </p>
              <p className="text-xs text-[#8C5E68] mt-1">
                Sistem akan mencari seluruh jadwal dokter atau asisten tersebut selama periode aktif.
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="bg-white/80 rounded-3xl p-8 text-center border border-pink-200/80 text-[#8C5E68]">
              <Search className="w-8 h-8 mx-auto mb-2 text-pink-300" />
              <p className="text-sm font-bold text-[#4A2E35]">
                Tidak ada jadwal untuk kata kunci "{searchTerm}".
              </p>
              <p className="text-xs text-[#8C5E68] mt-1">
                Coba gunakan nama depan atau singkatan dokter/asisten.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-[#4A2E35]">
                  Ditemukan {searchResults.length} Jadwal untuk "{searchTerm}"
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-4 border border-pink-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Date & Shift Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-pink-100 text-[#C2185B] border border-pink-200">
                          <Clock className="w-3 h-3 text-[#FF6B8B]" />
                          Shift {item.shiftLabel}
                        </span>
                        <span className="text-xs font-extrabold text-[#4A2E35] bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-100">
                          {item.dateLabel}
                        </span>
                      </div>

                      {/* Doctor or matching task */}
                      {item.doctors.length > 0 ? (
                        <div className="space-y-1 mb-2">
                          {item.doctors.map((d, dIdx) => (
                            <div
                              key={dIdx}
                              className="p-2 rounded-xl bg-pink-50/60 border border-pink-100 text-xs font-extrabold text-[#4A2E35] flex items-center gap-1.5"
                            >
                              <span>🩺</span>
                              <span className="truncate">{d}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-pink-50/60 border border-pink-100 text-xs font-bold text-[#4A2E35] mb-2">
                          {item.matchingTasks[0] || item.allTasks[0]}
                        </div>
                      )}
                    </div>

                    {/* Assistants on duty */}
                    <div className="pt-2.5 border-t border-pink-100 flex items-center justify-between text-xs">
                      <span className="text-[#8C5E68] font-bold flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#FF6B8B]" /> Asisten:
                      </span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {item.rawAssignees.length === 0 ? (
                          <span className="text-pink-300 italic">Belum terisi</span>
                        ) : (
                          item.rawAssignees.map((name, aIdx) => (
                            <span
                              key={aIdx}
                              className={`px-2 py-0.5 rounded-full font-black text-xs ${
                                /afiz/i.test(name)
                                  ? 'bg-[#D63447] text-white'
                                  : 'bg-pink-100 text-[#C2185B]'
                              }`}
                            >
                              {/afiz/i.test(name) ? 'Afiz 💖' : name}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamScheduleView;
