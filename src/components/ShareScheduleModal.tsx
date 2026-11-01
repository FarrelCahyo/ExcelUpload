import React, { useState, useMemo } from 'react';
import { X, Share2, Copy, Check, MessageSquare, Calendar, Layers } from 'lucide-react';
import { DailySchedule } from '../types/schedule';
import { matchesAssistant } from '../utils/excelParser';

interface ShareScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: DailySchedule[];
  selectedAssistant: string;
  selectedDate: string; // ISO date or 'ALL'
  periodLabel?: string;
}

export const ShareScheduleModal: React.FC<ShareScheduleModalProps> = ({
  isOpen,
  onClose,
  days,
  selectedAssistant,
  selectedDate,
  periodLabel,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareScope, setShareScope] = useState<'single' | 'all'>(() => {
    return selectedDate === 'ALL' ? 'all' : 'single';
  });

  // Target single day
  const activeDay = useMemo(() => {
    if (selectedDate !== 'ALL') {
      return days.find((d) => d.dateISO === selectedDate) || days[0];
    }
    return days[0];
  }, [days, selectedDate]);

  // Generate WhatsApp formatted text
  const shareText = useMemo(() => {
    if (!selectedAssistant) {
      return 'Silakan pilih nama asisten terlebih dahulu.';
    }

    let text = `🏥 *JADWAL SHIFT KLINIK INTERNIS & BEDAH*\n`;
    text += `👤 *Asisten:* ${selectedAssistant}\n`;
    if (periodLabel) text += `📅 *Periode:* ${periodLabel}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (shareScope === 'all') {
      days.forEach((day) => {
        const isLeave = day.leaveNotes.some((n) => matchesAssistant(selectedAssistant, n));
        const leaveNote = day.leaveNotes.find((n) => matchesAssistant(selectedAssistant, n));
        const assignments = day.assignments.filter(
          (a) => a.slotId !== 28 && a.rawAssignees.some((name) => matchesAssistant(selectedAssistant, name))
        );

        text += `🗓️ *${day.dateLabel}*\n`;
        if (isLeave) {
          text += `🏖️ Status: *${leaveNote || 'Cuti / LP'}*\n\n`;
        } else if (assignments.length > 0) {
          assignments.forEach((a) => {
            text += `⏰ *Shift ${a.shiftLabel} (Slot #${a.slotId})*\n`;
            a.tasks.forEach((t) => {
              text += `  • ${t}\n`;
            });
          });
          text += `\n`;
        } else {
          text += `☕ Status: *Off / Libur*\n\n`;
        }
      });
    } else {
      if (activeDay) {
        text += `🗓️ *Tanggal:* ${activeDay.dateLabel}\n\n`;
        const isLeave = activeDay.leaveNotes.some((n) => matchesAssistant(selectedAssistant, n));
        const leaveNote = activeDay.leaveNotes.find((n) => matchesAssistant(selectedAssistant, n));
        const assignments = activeDay.assignments.filter(
          (a) => a.slotId !== 28 && a.rawAssignees.some((name) => matchesAssistant(selectedAssistant, name))
        );

        if (isLeave) {
          text += `🏖️ Status: *${leaveNote || 'Cuti / LP'}*\n`;
        } else if (assignments.length > 0) {
          assignments.forEach((a) => {
            text += `⏰ *Shift ${a.shiftLabel} (Slot #${a.slotId})*\n`;
            a.tasks.forEach((t) => {
              text += `  • ${t}\n`;
            });
            text += `\n`;
          });
        } else {
          text += `☕ Status: *Off / Lepas Piket*\n\n`;
        }

        // Add collective task
        const collective = activeDay.assignments.find((a) => a.slotId === 28);
        if (collective && collective.tasks.length > 0) {
          text += `📋 *Tugas Kolektif Seluruh Asisten:*\n`;
          collective.tasks.forEach((t) => {
            text += `  • ${t}\n`;
          });
        }
      }
    }

    text += `\n_Dibuat otomatis via Aplikasi Web Jadwal Shift_`;
    return text;
  }, [days, selectedAssistant, shareScope, activeDay, periodLabel]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Salin & Bagikan Jadwal Shift</h2>
            <p className="text-xs text-slate-500">
              Format teks rapi siap kirim ke WhatsApp Tim Klinik
            </p>
          </div>
        </div>

        {/* Scope selector */}
        <div className="flex items-center gap-2 mb-3 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setShareScope('single')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              shareScope === 'single'
                ? 'bg-white text-teal-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="truncate">Hari Terpilih ({activeDay?.dateLabel.split(', ')[1]?.split(' ').slice(0, 2).join(' ') || ''})</span>
          </button>
          <button
            type="button"
            onClick={() => setShareScope('all')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              shareScope === 'all'
                ? 'bg-white text-teal-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua ({days.length} Hari)</span>
          </button>
        </div>

        {/* Text Area Preview */}
        <div className="relative mb-4">
          <textarea
            readOnly
            value={shareText}
            rows={9}
            className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-hidden resize-none leading-relaxed"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={handleCopy}
            className={`w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Teks Ringkasan</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all shadow-sm shadow-emerald-600/30"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Kirim via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
