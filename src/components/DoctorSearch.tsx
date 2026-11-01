import React, { useState, useMemo } from 'react';
import { DailySchedule } from '../types/schedule';
import { Stethoscope, Search, Calendar, User, Clock, ChevronRight } from 'lucide-react';

interface DoctorSearchProps {
  days: DailySchedule[];
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({ days }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all distinct doctors mentioned in tasks
  const allDoctors = useMemo(() => {
    const doctorSet = new Set<string>();
    days.forEach((day) => {
      day.assignments.forEach((assignment) => {
        assignment.tasks.forEach((task) => {
          if (/dr\.|prof\./i.test(task)) {
            // Normalize doctor name
            const cleaned = task.replace(/\s+/g, ' ').trim();
            doctorSet.add(cleaned);
          }
        });
      });
    });
    return Array.from(doctorSet).sort((a, b) => a.localeCompare(b, 'id'));
  }, [days]);

  // Find all schedule matches for the searched doctor
  const matches = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();

    const results: Array<{
      dateISO: string;
      dateLabel: string;
      dayName: string;
      slotId: number;
      shiftLabel: string;
      rawAssignees: string[];
      matchingTask: string;
      allTasks: string[];
    }> = [];

    days.forEach((day) => {
      day.assignments.forEach((assignment) => {
        const matchingTasks = assignment.tasks.filter((t) => t.toLowerCase().includes(q));
        if (matchingTasks.length > 0) {
          results.push({
            dateISO: day.dateISO,
            dateLabel: day.dateLabel,
            dayName: day.dayName,
            slotId: assignment.slotId,
            shiftLabel: assignment.shiftLabel,
            rawAssignees: assignment.rawAssignees,
            matchingTask: matchingTasks[0],
            allTasks: assignment.tasks,
          });
        }
      });
    });

    return results;
  }, [days, searchTerm]);

  return (
    <div className="space-y-5">
      {/* Search Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Cari Jadwal Dokter & Asisten</h3>
            <p className="text-xs text-slate-500">
              Ketik nama dokter untuk mengetahui jadwal praktek dan asisten yang mendampingi.
            </p>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Ketik nama dokter (misal: dr. Rheza, Tan Hengky, Darmono, Dicky)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
            autoFocus
          />
        </div>

        {/* Quick Click Doctors */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Dokter Terdaftar ({allDoctors.length}):
          </span>
          <div className="flex items-center gap-1.5 flex-wrap max-h-36 overflow-y-auto pt-1 no-scrollbar">
            {allDoctors.slice(0, 16).map((doc) => (
              <button
                key={doc}
                onClick={() => setSearchTerm(doc.split(' ')[0] + ' ' + (doc.split(' ')[1] || ''))}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 transition-colors"
              >
                {doc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {searchTerm.trim() === '' ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400">
          <Stethoscope className="w-8 h-8 mx-auto mb-2 text-teal-400" />
          <p className="text-sm font-semibold text-slate-700">Silakan pilih atau ketik nama dokter di atas.</p>
          <p className="text-xs text-slate-400 mt-1">
            Sistem akan mencari seluruh jadwal dokter tersebut selama sepekan penuh.
          </p>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400">
          <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">Tidak ada jadwal dokter untuk kata kunci "{searchTerm}".</p>
          <p className="text-xs text-slate-400 mt-1">Coba gunakan nama belakang atau nama poliklinik.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">
              Ditemukan {matches.length} Jadwal untuk "{searchTerm}"
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {matches.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      <Clock className="w-3 h-3 text-teal-600" />
                      Shift {item.shiftLabel}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.dateLabel}
                    </span>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 mb-2.5 text-xs font-bold text-emerald-950 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item.matchingTask}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 mb-3 space-y-0.5">
                    <span className="font-semibold block text-slate-400">Tugas lain di slot ini:</span>
                    {item.allTasks
                      .filter((t) => t !== item.matchingTask)
                      .slice(0, 3)
                      .map((t, i) => (
                        <div key={i} className="flex items-center gap-1.5 truncate">
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{t}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <User className="w-3 h-3 text-teal-600" /> Asisten:
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {item.rawAssignees.length === 0 ? (
                      <span className="text-slate-400 italic">Belum terisi</span>
                    ) : (
                      item.rawAssignees.map((name, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-bold text-xs"
                        >
                          {name}
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
  );
};

