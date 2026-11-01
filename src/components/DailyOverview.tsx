import React, { useState, useMemo } from 'react';
import { DailySchedule, SlotAssignment } from '../types/schedule';
import { ScheduleCard } from './ScheduleCard';
import { 
  Search, 
  X, 
  Palmtree, 
  Clock, 
  Users, 
  Filter, 
  CalendarDays,
  Sparkles,
  Stethoscope
} from 'lucide-react';

interface DailyOverviewProps {
  day: DailySchedule;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({ day }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('ALL');

  // Distinct shift labels
  const availableShifts = useMemo(() => {
    const shifts = new Set<string>();
    day.assignments.forEach((a) => shifts.add(a.shiftLabel));
    return Array.from(shifts);
  }, [day]);

  // Filter assignments based on search term and shift filter
  const filteredAssignments = useMemo(() => {
    let result = day.assignments;

    // Filter by shift
    if (selectedShiftFilter !== 'ALL') {
      result = result.filter((a) => a.shiftLabel === selectedShiftFilter);
    }

    // Filter by search query (Assistant name, Doctor name, or Task keyword)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((a) => {
        const matchesAssignee = a.rawAssignees.some((name) => name.toLowerCase().includes(q));
        const matchesTask = a.tasks.some((t) => t.toLowerCase().includes(q));
        const matchesShift = a.shiftLabel.toLowerCase().includes(q);
        return matchesAssignee || matchesTask || matchesShift;
      });
    }

    return result;
  }, [day, searchTerm, selectedShiftFilter]);

  // Group filtered assignments by shift category
  const groupedByShift = useMemo(() => {
    const groups: { [key: string]: SlotAssignment[] } = {};
    filteredAssignments.forEach((a) => {
      if (!groups[a.shiftLabel]) {
        groups[a.shiftLabel] = [];
      }
      groups[a.shiftLabel].push(a);
    });
    return groups;
  }, [filteredAssignments]);

  // Count active assignees for this day
  const totalAssigneesToday = useMemo(() => {
    const set = new Set<string>();
    day.assignments.forEach((a) => {
      if (a.slotId !== 28) {
        a.rawAssignees.forEach((name) => {
          if (!/semua|mcu/i.test(name)) set.add(name);
        });
      }
    });
    return set.size;
  }, [day]);

  return (
    <div className="space-y-5">
      {/* Search & Shift Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari dokter (misal: dr. Rheza), asisten (misal: Afiz), atau tugas (misal: BPJS)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Shift pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Shift:
          </span>
          <button
            onClick={() => setSelectedShiftFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedShiftFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua Shift ({day.assignments.length})
          </button>
          {availableShifts.map((shift) => (
            <button
              key={shift}
              onClick={() => setSelectedShiftFilter(shift)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedShiftFilter === shift
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Shift {shift}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Notes Card if any today */}
      {day.leaveNotes && day.leaveNotes.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
              <Palmtree className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Daftar Cuti & Libur Pengganti (LP) Hari Ini
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                  {day.leaveNotes.length} Orang
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                {day.leaveNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-amber-900 border border-amber-200 shadow-2xs"
                  >
                    <Palmtree className="w-3 h-3 text-amber-600" />
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary counters */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Menampilkan <strong>{filteredAssignments.length}</strong> slot penugasan pada <strong>{day.dateLabel}</strong>
        </span>
        <span className="font-medium text-teal-700">
          ~{totalAssigneesToday} Asisten Bertugas
        </span>
      </div>

      {/* Grouped Cards */}
      {Object.keys(groupedByShift).length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400">
          <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">Tidak ada slot yang cocok dengan pencarian.</p>
          <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci nama asisten atau dokter lain.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByShift).map(([shiftName, slots]) => (
            <div key={shiftName} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Kategori Shift {shiftName}
                </h3>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  {slots.length} Slot
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {slots.map((assignment) => (
                  <ScheduleCard
                    key={assignment.slotId}
                    assignment={assignment}
                    highlightAssistant={searchTerm}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

