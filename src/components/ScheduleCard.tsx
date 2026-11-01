import React from 'react';
import { Clock, User, Stethoscope, ChevronRight, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { SlotAssignment } from '../types/schedule';

interface ScheduleCardProps {
  assignment: SlotAssignment;
  dateLabel?: string;
  highlightAssistant?: string;
  showAssignees?: boolean;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  assignment,
  dateLabel,
  highlightAssistant,
  showAssignees = true,
}) => {
  const { slotId, rowRange, shiftLabel, rawAssignees, tasks } = assignment;

  // Determine badge color theme based on shiftLabel
  const getShiftTheme = (shift: string) => {
    const s = shift.toLowerCase();
    if (s.includes('jam 7') || s.includes('07')) {
      return {
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
        bar: 'from-emerald-500 to-teal-600',
      };
    }
    if (s.includes('jam 8') || s.includes('08')) {
      return {
        badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        dot: 'bg-cyan-500',
        bar: 'from-cyan-500 to-blue-600',
      };
    }
    if (s.includes('9') || s.includes('10')) {
      return {
        badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        dot: 'bg-indigo-500',
        bar: 'from-indigo-500 to-purple-600',
      };
    }
    if (s.includes('14.00') || s.includes('14')) {
      return {
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        bar: 'from-amber-500 to-orange-600',
      };
    }
    if (s.includes('semua')) {
      return {
        badge: 'bg-violet-50 text-violet-800 border-violet-200',
        dot: 'bg-violet-500',
        bar: 'from-violet-500 to-purple-600',
      };
    }
    return {
      badge: 'bg-slate-100 text-slate-800 border-slate-200',
      dot: 'bg-slate-500',
      bar: 'from-slate-500 to-slate-700',
    };
  };

  const theme = getShiftTheme(shiftLabel);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Top indicator bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${theme.bar}`} />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header: Date + Shift + Slot Badge */}
          <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${theme.badge}`}>
                <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                Shift {shiftLabel}
              </span>

              <span className="text-[11px] font-semibold text-slate-400">
                Slot #{slotId} <span className="text-slate-300">•</span> Baris {rowRange[0]}–{rowRange[1]}
              </span>
            </div>

            {dateLabel && (
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {dateLabel}
              </span>
            )}
          </div>

          {/* Tasks List */}
          <div className="space-y-1.5 mb-4">
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Tidak ada rincian tugas terdaftar di template.</p>
            ) : (
              tasks.map((task, idx) => {
                const isTimeNote = /masuk jam|msk j\.|masuk j\./i.test(task);
                const isDoctor = /dr\.|prof\./i.test(task);

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 text-xs rounded-lg px-2.5 py-1.5 transition-colors ${
                      isTimeNote
                        ? 'bg-amber-50/80 text-amber-900 font-bold border border-amber-200/70'
                        : isDoctor
                        ? 'bg-slate-50/70 text-slate-900 font-semibold'
                        : 'text-slate-700'
                    }`}
                  >
                    {isTimeNote ? (
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    ) : isDoctor ? (
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{task}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer: Assignee names */}
        {showAssignees && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Petugas Dinas:
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {rawAssignees.length === 0 ? (
                <span className="text-xs text-slate-400 italic">Belum terisi</span>
              ) : (
                rawAssignees.map((assignee, idx) => {
                  const isHighlighted = highlightAssistant && 
                    assignee.toLowerCase().includes(highlightAssistant.toLowerCase());

                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isHighlighted
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {assignee}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

