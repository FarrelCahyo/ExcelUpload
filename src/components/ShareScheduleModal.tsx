import React, { useState, useMemo } from 'react';
import { X, Copy, Check, MessageSquare, Calendar, Layers, Sparkles, Heart } from 'lucide-react';
import { DailySchedule } from '../types/schedule';
import { matchesAssistant } from '../utils/excelParser';
import { RibbonBow, StrawberryPill, TwinkleStar } from './illustrations';

export interface ShareScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: DailySchedule[];
  selectedAssistant?: string;
  selectedDate?: string; // ISO date or 'ALL'
  periodLabel?: string;
}

export const ShareScheduleModal: React.FC<ShareScheduleModalProps> = ({
  isOpen,
  onClose,
  days,
  selectedAssistant = 'Afiz',
  selectedDate,
  periodLabel,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareScope, setShareScope] = useState<'single' | 'all'>(() => {
    return selectedDate === 'ALL' ? 'all' : 'single';
  });

  const assistantName = selectedAssistant || 'Afiz';

  // Target single day
  const activeDay = useMemo(() => {
    if (selectedDate && selectedDate !== 'ALL') {
      return days.find((d) => d.dateISO === selectedDate) || days[0];
    }
    return days[0];
  }, [days, selectedDate]);

  // Generate WhatsApp formatted text
  const shareText = useMemo(() => {
    let text = `🍓 *JADWAL SHIFT KLINIK INTERNIS & BEDAH* 🌸\n`;
    text += `👩‍⚕️ *Nama:* ${assistantName} ✨\n`;
    if (periodLabel) text += `📅 *Periode:* ${periodLabel}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (shareScope === 'all') {
      days.forEach((day) => {
        const isLeave = day.isAfizLeave !== undefined && assistantName.toLowerCase() === 'afiz'
          ? day.isAfizLeave
          : day.leaveNotes.some((n) => matchesAssistant(assistantName, n));

        const leaveNote = assistantName.toLowerCase() === 'afiz' && day.afizLeaveNote
          ? day.afizLeaveNote
          : day.leaveNotes.find((n) => matchesAssistant(assistantName, n));

        const assignments = (assistantName.toLowerCase() === 'afiz' && day.afizAssignments)
          ? day.afizAssignments
          : day.assignments.filter(
              (a) => a.slotId !== 28 && a.rawAssignees.some((name) => matchesAssistant(assistantName, name))
            );

        text += `🗓️ *${day.dateLabel}*\n`;
        if (isLeave) {
          text += `🏖️ Status: *${leaveNote || 'Cuti / Libur'}* ☁️\n\n`;
        } else if (assignments.length > 0) {
          assignments.forEach((a) => {
            text += `⏰ *Shift ${a.shiftLabel} (Slot #${a.slotId})*\n`;
            if (a.timeNote) {
              text += `   📌 ${a.timeNote}\n`;
            }
            if (a.doctors && a.doctors.length > 0) {
              text += `   🩺 Dokter: ${a.doctors.join(', ')}\n`;
            }
            a.tasks.forEach((t) => {
              text += `   • ${t}\n`;
            });
          });
          text += `\n`;
        } else {
          text += `☕ Status: *Off / Istirahat* 🌸\n\n`;
        }
      });
    } else {
      if (activeDay) {
        text += `🗓️ *Tanggal:* ${activeDay.dateLabel}\n\n`;
        const isLeave = activeDay.isAfizLeave !== undefined && assistantName.toLowerCase() === 'afiz'
          ? activeDay.isAfizLeave
          : activeDay.leaveNotes.some((n) => matchesAssistant(assistantName, n));

        const leaveNote = assistantName.toLowerCase() === 'afiz' && activeDay.afizLeaveNote
          ? activeDay.afizLeaveNote
          : activeDay.leaveNotes.find((n) => matchesAssistant(assistantName, n));

        const assignments = (assistantName.toLowerCase() === 'afiz' && activeDay.afizAssignments)
          ? activeDay.afizAssignments
          : activeDay.assignments.filter(
              (a) => a.slotId !== 28 && a.rawAssignees.some((name) => matchesAssistant(assistantName, name))
            );

        if (isLeave) {
          text += `🏖️ Status: *${leaveNote || 'Cuti / Libur'}* ☁️\n`;
        } else if (assignments.length > 0) {
          assignments.forEach((a) => {
            text += `⏰ *Shift ${a.shiftLabel} (Slot #${a.slotId})*\n`;
            if (a.timeNote) {
              text += `   📌 ${a.timeNote}\n`;
            }
            if (a.doctors && a.doctors.length > 0) {
              text += `   🩺 Dokter: ${a.doctors.join(', ')}\n`;
            }
            a.tasks.forEach((t) => {
              text += `   • ${t}\n`;
            });
            text += `\n`;
          });
        } else {
          text += `☕ Status: *Off / Libur Dinas* 🌸\n\n`;
        }

        // Add collective task
        const collective = activeDay.assignments.find((a) => a.slotId === 28);
        if (collective && collective.tasks.length > 0) {
          text += `📋 *Tugas Kolektif Seluruh Asisten:*\n`;
          collective.tasks.forEach((t) => {
            text += `   • ${t}\n`;
          });
          text += `\n`;
        }
      }
    }

    if (assistantName.toLowerCase() === 'afiz') {
      text += `_Semangat dinasnya ya sayang! Dibuat dengan penuh cinta 💕🍓_\n`;
    } else {
      text += `_Dibuat otomatis via Aplikasi Web Jadwal Shift Strawberry Milk Edition 🍓_\n`;
    }
    return text;
  }, [days, assistantName, shareScope, activeDay, periodLabel]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback if clipboard API is denied
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-pink-200/90 shadow-2xl shadow-pink-300/40 p-5 sm:p-6 overflow-hidden">
        {/* Decorative corner ribbons */}
        <div className="absolute -top-3 -left-3 pointer-events-none drop-shadow-xs -rotate-12">
          <RibbonBow size={32} color="#FF6B8B" secondaryColor="#D63447" />
        </div>
        <div className="absolute -bottom-3 -right-3 pointer-events-none drop-shadow-xs rotate-12">
          <RibbonBow size={32} color="#FF6B8B" secondaryColor="#D63447" />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup dialog bagikan"
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-[#8C5E68] hover:text-[#D63447] active:scale-95 transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-pink-400"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-pink-100/80 border border-pink-200 flex items-center justify-center shadow-2xs shrink-0">
            <StrawberryPill active size={24} />
          </div>
          <div>
            <h2 id="share-modal-title" className="text-base font-extrabold text-[#C2185B] flex items-center gap-1.5">
              <span>Bagikan Jadwal Shift</span>
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            </h2>
            <p className="text-xs font-semibold text-[#8C5E68]">
              Format teks rapi siap kirim ke WhatsApp Tim Klinik atau Pasangan 💌
            </p>
          </div>
        </div>

        {/* Scope selector tabs */}
        <div className="flex items-center gap-2 mb-3 bg-pink-50/80 border border-pink-200/70 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setShareScope('single')}
            className={`flex-1 py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              shareScope === 'single'
                ? 'bg-pink-500 text-white shadow-xs font-black'
                : 'text-[#8C5E68] hover:text-[#D63447] hover:bg-pink-100/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="truncate">
              Hari Ini ({activeDay?.dateLabel.split(', ')[1]?.split(' ').slice(0, 2).join(' ') || ''})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setShareScope('all')}
            className={`flex-1 py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              shareScope === 'all'
                ? 'bg-pink-500 text-white shadow-xs font-black'
                : 'text-[#8C5E68] hover:text-[#D63447] hover:bg-pink-100/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua ({days.length} Hari)</span>
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="relative mb-4">
          <textarea
            readOnly
            value={shareText}
            rows={8}
            className="w-full text-xs font-mono bg-pink-50/40 border border-pink-200/80 rounded-2xl p-3.5 text-pink-950 focus:outline-hidden focus:ring-2 focus:ring-pink-300 resize-none leading-relaxed select-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full sm:flex-1 py-2.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
              copied
                ? 'bg-pink-600 text-white'
                : 'bg-white hover:bg-pink-50 text-pink-700 border border-pink-300 active:scale-98'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Tersalin ke Clipboard! ✨</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-pink-500" />
                <span>Salin Teks Ringkasan 🎀</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 flex items-center justify-center gap-2 transition-all shadow-sm shadow-emerald-500/25 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-100" />
            <span>Kirim via WhatsApp 💬</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareScheduleModal;
