import React from 'react';
import { DailySchedule, SlotAssignment } from '../types/schedule';
import { matchesAssistant } from '../utils/excelParser';
import { ScheduleCard } from './ScheduleCard';
import { 
  Palmtree, 
  Coffee, 
  Sparkles, 
  CalendarCheck2, 
  Info, 
  ShieldCheck, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface PersonalScheduleViewProps {
  days: DailySchedule[];
  selectedAssistant: string;
  selectedDate: string; // ISO date or 'ALL'
}

export const PersonalScheduleView: React.FC<PersonalScheduleViewProps> = ({
  days,
  selectedAssistant,
  selectedDate,
}) => {
  if (!selectedAssistant) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
        <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Silakan Pilih Nama Asisten</h3>
        <p className="text-xs text-slate-500 mt-1">
          Pilih nama Anda pada selector di atas untuk melihat jadwal shift dan rincian dokter.
        </p>
      </div>
    );
  }

  // Collective task (Slot #28, row 100)
  const collectiveTaskSlot = days[0]?.assignments.find(a => a.slotId === 28);

  // If "Sepekan Penuh"
  if (selectedDate === 'ALL') {
    const weeklyData = days.map((day) => {
      const isLeave = day.leaveNotes.some((note) => matchesAssistant(selectedAssistant, note));
      const leaveNote = day.leaveNotes.find((note) => matchesAssistant(selectedAssistant, note));
      const myAssignments = day.assignments.filter(
        (a) => a.slotId !== 28 && a.rawAssignees.some((name) => matchesAssistant(selectedAssistant, name))
      );

      return {
        day,
        isLeave,
        leaveNote,
        assignments: myAssignments,
      };
    });

    const totalShifts = weeklyData.reduce((acc, curr) => acc + curr.assignments.length, 0);
    const totalLeaveDays = weeklyData.filter((w) => w.isLeave).length;
    const workingDays = weeklyData.filter((w) => w.assignments.length > 0).length;

    return (
      <div className="space-y-6">
        {/* Weekly Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Shift
            </span>
            <span className="text-lg font-black text-teal-600">{totalShifts}</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Hari Dinas
            </span>
            <span className="text-lg font-black text-slate-800">{workingDays}</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Cuti / LP
            </span>
            <span className="text-lg font-black text-amber-600">{totalLeaveDays}</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Rentang Periode
            </span>
            <span className="text-lg font-black text-indigo-600">{days.length} Hari</span>
          </div>
        </div>

        {/* Timeline by Day */}
        <div className="space-y-5">
          {weeklyData.map(({ day, isLeave, leaveNote, assignments }) => {
            const isSunday = day.dayName === 'MINGGU';

            return (
              <div key={day.dateISO} className="bg-white/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isSunday ? 'bg-rose-500' : 'bg-teal-600'}`} />
                    <h3 className="text-sm font-bold text-slate-900">{day.dateLabel}</h3>
                  </div>

                  {isLeave ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      <Palmtree className="w-3.5 h-3.5" />
                      {leaveNote || 'Cuti / LP'}
                    </span>
                  ) : assignments.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                      {assignments.length} Penugasan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-400 bg-slate-100">
                      Off / Libur
                    </span>
                  )}
                </div>

                {isLeave && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex items-center gap-2 mb-3">
                    <Palmtree className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Tercatat status: <strong>{leaveNote}</strong></span>
                  </div>
                )}

                {assignments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {assignments.map((assignment) => (
                      <ScheduleCard
                        key={assignment.slotId}
                        assignment={assignment}
                        highlightAssistant={selectedAssistant}
                      />
                    ))}
                  </div>
                ) : !isLeave ? (
                  <p className="text-xs text-slate-400 italic py-1">Tidak ada jadwal tugas (Off).</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Specific Date Selected
  const activeDay = days.find((d) => d.dateISO === selectedDate) || days[0];
  if (!activeDay) return null;

  // Check if assistant is on leave
  const isLeave = activeDay.leaveNotes.some((note) => matchesAssistant(selectedAssistant, note));
  const leaveNote = activeDay.leaveNotes.find((note) => matchesAssistant(selectedAssistant, note));

  // Find assignments for this assistant (excluding collective slot #28 for separate display)
  const myAssignments = activeDay.assignments.filter(
    (a) => a.slotId !== 28 && a.rawAssignees.some((name) => matchesAssistant(selectedAssistant, name))
  );

  return (
    <div className="space-y-4">
      {/* Date Header Info */}
      <div className="flex items-center justify-between bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4">
        <div>
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
            Jadwal Tanggal Terpilih
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            {activeDay.dateLabel}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-600 block">Asisten:</span>
          <span className="text-sm font-extrabold text-teal-700">{selectedAssistant}</span>
        </div>
      </div>

      {/* Leave Status Notification */}
      {isLeave && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
            <Palmtree className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Sedang Cuti / Libur Pengganti (LP)</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Status Anda pada tanggal ini: <strong className="underline">{leaveNote}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Assigned Slots */}
      {myAssignments.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <CalendarCheck2 className="w-4 h-4 text-teal-600" />
              {myAssignments.length > 1
                ? `Dinas Double Slot (${myAssignments.length} Tugas)`
                : 'Kartu Tugas Shift'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myAssignments.map((assignment) => (
              <ScheduleCard
                key={assignment.slotId}
                assignment={assignment}
                highlightAssistant={selectedAssistant}
              />
            ))}
          </div>
        </div>
      ) : !isLeave ? (
        /* Empty State: Off / Libur */
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Coffee className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Jadwal Tercatat Hari Ini</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Nama <strong>{selectedAssistant}</strong> tidak terdaftar di slot dinas maupun baris cuti pada tanggal{' '}
            <strong>{activeDay.dateLabel}</strong> (Off / Lepas Piket).
          </p>
        </div>
      ) : null}

      {/* Collective Clinic Task Banner (Slot 28 / Row 100) */}
      {collectiveTaskSlot && collectiveTaskSlot.tasks.length > 0 && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-violet-900">
                  Tugas Kolektif Seluruh Shift (Slot #{collectiveTaskSlot.slotId})
                </h4>
                <span className="text-[10px] font-semibold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                  Semua Asisten
                </span>
              </div>
              <ul className="mt-1.5 space-y-1">
                {collectiveTaskSlot.tasks.map((task, idx) => (
                  <li key={idx} className="text-xs text-violet-800 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

