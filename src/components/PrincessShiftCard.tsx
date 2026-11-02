import React from 'react';
import { SlotAssignment } from '../types/schedule';
import { RibbonBow, FluffyCloud, TwinkleStar } from './illustrations';
import { PrincessCollectiveTaskBanner } from './PrincessCollectiveTaskBanner';

// ==========================================
// 1. Doctor Badge Categorization Helper
// ==========================================
export interface DoctorBadgeInfo {
  icon: string;
  typeLabel: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

/**
 * Assigns cute medical icons dynamically based on doctor specialty & keywords:
 * - Sp.OT / Ortho: 🦴 Bone icon
 * - Bedah / Sp.B / Surgery / Urologi: 🩹 Bandage / scalpel icon
 * - General / Internis / Sp.PD / Konsul: 🩺 Stethoscope
 * - Pharmacy / Other specialties: 💊 Pill
 */
export function getDoctorBadgeInfo(doctorName: string): DoctorBadgeInfo {
  const lower = doctorName.toLowerCase();

  // Sp.OT / Orthopedics / Bone
  if (/sp\.?\s*ot|ortho|ortopedi|tulang/i.test(lower)) {
    return {
      icon: '🦴',
      typeLabel: 'Sp.OT / Ortho',
      badgeBg: 'bg-amber-50/80',
      badgeBorder: 'border-amber-200/90',
      badgeText: 'text-amber-900',
    };
  }

  // Bedah / Surgery / Urologi / Onkologi
  if (/sp\.?\s*b|bedah|surgery|urologi|sp\.?\s*u\b|digestif|onkologi|bedah\s*mulut/i.test(lower)) {
    return {
      icon: '🩹',
      typeLabel: 'Sp.B / Bedah',
      badgeBg: 'bg-rose-50/80',
      badgeBorder: 'border-rose-200/90',
      badgeText: 'text-rose-900',
    };
  }

  // General / Internis / Penyakit Dalam / Jantung / Paru
  if (/sp\.?\s*pd|internis|penyakit\s*dalam|tan\s*hengky|jantung|sp\.?\s*jp|paru|sp\.?\s*p\b|umum|general/i.test(lower)) {
    return {
      icon: '🩺',
      typeLabel: 'Internis / Konsul',
      badgeBg: 'bg-pink-50/80',
      badgeBorder: 'border-pink-200/90',
      badgeText: 'text-pink-900',
    };
  }

  // Default / Pharmacy / Other specialists (Sp.A, Sp.M, Sp.THT, drg, etc.)
  return {
    icon: '💊',
    typeLabel: 'Dokter / Poli',
    badgeBg: 'bg-purple-50/80',
    badgeBorder: 'border-purple-200/90',
    badgeText: 'text-purple-900',
  };
}

/**
 * Formats shift title e.g. "14.00" -> "SHIFT 14.00 🍓"
 */
export function formatShiftTitle(label: string): string {
  const trimmed = (label || '').trim();
  if (!trimmed) return 'SHIFT DINAS 🍓';

  const upper = trimmed.toUpperCase();
  if (upper.startsWith('SHIFT')) {
    return `${upper} 🍓`;
  }
  return `SHIFT ${upper} 🍓`;
}

// ==========================================
// 2. PrincessLeaveCard Component
// ==========================================
export interface PrincessLeaveCardProps {
  leaveNote?: string;
  dateLabel?: string;
  className?: string;
}

export const PrincessLeaveCard: React.FC<PrincessLeaveCardProps> = ({
  leaveNote,
  dateLabel,
  className = '',
}) => {
  return (
    <div
      className={`lace-card p-6 sm:p-8 text-center relative overflow-visible shadow-md shadow-pink-200/60 ${className}`}
      role="region"
      aria-label="Status Cuti / Libur"
    >
      {/* Decorative Corner Ribbon Bows */}
      <div className="absolute -top-3.5 -left-3.5 z-10 pointer-events-none drop-shadow-sm -rotate-12 transition-transform hover:scale-110">
        <RibbonBow size={36} color="#FF6B8B" secondaryColor="#D63447" />
      </div>
      <div className="absolute -bottom-3.5 -right-3.5 z-10 pointer-events-none drop-shadow-sm rotate-12 transition-transform hover:scale-110">
        <RibbonBow size={36} color="#FF6B8B" secondaryColor="#D63447" />
      </div>

      {/* Sleeping Cloud Mascot */}
      <div className="flex justify-center mb-4">
        <div className="relative inline-block animate-pulse">
          <FluffyCloud size={100} variant="pink" withFace={true} withSparkles={true} />
        </div>
      </div>

      {/* Affectionate Title */}
      <h3
        className="text-lg sm:text-xl font-black tracking-tight mb-2 leading-snug"
        style={{ color: '#C2185B' }}
      >
        Hari Ini Cantikku Libur / Cuti! ☁️💖
      </h3>

      {/* Loving Message */}
      <p
        className="text-xs sm:text-sm font-semibold max-w-sm mx-auto leading-relaxed"
        style={{ color: '#4A2E35' }}
      >
        Selamat Istirahat ya Sayang, jangan lupa recharge energi dan makan yang enak! 🌸🍰
      </p>

      {/* Leave Note Badge if present */}
      {leaveNote && (
        <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200/90 text-pink-700 text-xs font-black shadow-2xs">
          <span>🎀</span>
          <span>{leaveNote}</span>
        </div>
      )}

      {/* Date indicator if provided */}
      {dateLabel && (
        <div className="mt-3">
          <span className="text-[11px] font-bold text-pink-400 bg-pink-50/80 px-3 py-1 rounded-full border border-pink-100">
            {dateLabel}
          </span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. PrincessOffCard Component (No Shifts)
// ==========================================
export interface PrincessOffCardProps {
  dateLabel?: string;
  className?: string;
}

export const PrincessOffCard: React.FC<PrincessOffCardProps> = ({
  dateLabel,
  className = '',
}) => {
  return (
    <div
      className={`lace-card p-6 sm:p-8 text-center relative overflow-visible shadow-md shadow-pink-200/60 ${className}`}
      role="region"
      aria-label="Tidak Ada Dinas"
    >
      {/* Decorative Corner Ribbon Bows */}
      <div className="absolute -top-3.5 -left-3.5 z-10 pointer-events-none drop-shadow-sm -rotate-12 transition-transform hover:scale-110">
        <RibbonBow size={36} color="#FF6B8B" secondaryColor="#D63447" />
      </div>
      <div className="absolute -bottom-3.5 -right-3.5 z-10 pointer-events-none drop-shadow-sm rotate-12 transition-transform hover:scale-110">
        <RibbonBow size={36} color="#FF6B8B" secondaryColor="#D63447" />
      </div>

      {/* Gentle Smiling Cloud Mascot */}
      <div className="flex justify-center mb-4">
        <FluffyCloud size={92} variant="white" withFace={true} withSparkles={true} />
      </div>

      {/* Sweet Resting Title */}
      <h3
        className="text-lg sm:text-xl font-black tracking-tight mb-2 leading-snug"
        style={{ color: '#D63447' }}
      >
        Tidak Ada Jadwal Dinas Hari Ini 🌸
      </h3>

      {/* Affectionate Message */}
      <p
        className="text-xs sm:text-sm font-semibold max-w-sm mx-auto leading-relaxed"
        style={{ color: '#4A2E35' }}
      >
        Tidak ada jadwal dinas hari ini, nikmati waktu istirahatmu ya sayang! ✨🍰
      </p>

      {/* Date badge */}
      {dateLabel && (
        <div className="mt-4">
          <span className="text-[11px] font-bold text-pink-400 bg-pink-50/80 px-3 py-1 rounded-full border border-pink-100">
            {dateLabel}
          </span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. Single Shift Card Implementation
// ==========================================
export interface PrincessSingleShiftCardProps {
  assignment: SlotAssignment;
  dateLabel?: string;
  showAssignees?: boolean;
  className?: string;
}

export const PrincessSingleShiftCard: React.FC<PrincessSingleShiftCardProps> = ({
  assignment,
  dateLabel,
  showAssignees = false,
  className = '',
}) => {
  const { slotId, rowRange, shiftLabel, tasks, doctors = [], timeNote, rawAssignees = [] } = assignment;

  const shiftTitle = formatShiftTitle(shiftLabel);

  // Filter tasks that are neither time notes nor matching doctor names
  const otherTasks = (tasks || []).filter((task) => {
    if (!task || !task.trim()) return false;
    // Exclude time entry notes
    if (/(?:masuk|msk)\s*(?:jam|ajm|j\.)?\s*\d+/i.test(task)) return false;
    // Exclude if task is essentially one of the doctors
    if (doctors.some((doc) => task.toLowerCase().includes(doc.toLowerCase()) || doc.toLowerCase().includes(task.toLowerCase()))) {
      return false;
    }
    return true;
  });

  // Format time note cleanly
  const cleanTimeNote = timeNote
    ? timeNote.replace(/^⏰\s*/, '').trim()
    : null;

  return (
    <div
      className={`lace-card p-5 sm:p-6 relative overflow-visible shadow-md shadow-pink-200/60 transition-all ${className}`}
      role="article"
      aria-label={`Jadwal ${shiftTitle}`}
    >
      {/* Decorative Ribbon Bows on Top-Left and Bottom-Right Corners */}
      <div className="absolute -top-3.5 -left-3.5 z-10 pointer-events-none drop-shadow-sm -rotate-12 transition-transform hover:scale-110">
        <RibbonBow size={36} color="#FF6B8B" secondaryColor="#D63447" />
      </div>
      <div className="absolute -bottom-3.5 -right-3.5 z-10 pointer-events-none drop-shadow-sm rotate-12 transition-transform hover:scale-110">
        <RibbonBow size={36} color="#FF6B8B" secondaryColor="#D63447" />
      </div>

      {/* Card Header: Title + Subtitle */}
      <div className="text-center mb-4">
        <h3
          className="text-xl sm:text-2xl font-black tracking-tight leading-snug drop-shadow-2xs select-none"
          style={{ color: '#C2185B' }}
        >
          {shiftTitle}
        </h3>

        {/* Small subtitle: Slot number and row range */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-pink-400 mt-1 flex-wrap">
          <span>Slot #{slotId}</span>
          <span className="text-pink-300">•</span>
          <span>Baris {rowRange[0]}–{rowRange[1]}</span>
          {dateLabel && (
            <>
              <span className="text-pink-300">•</span>
              <span className="text-pink-600 font-extrabold">{dateLabel}</span>
            </>
          )}
        </div>
      </div>

      {/* Time Highlight Badge (e.g. ⏰ Masuk jam 12 ya! ✨) */}
      {cleanTimeNote && (
        <div className="flex justify-center mb-5">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/90 text-amber-900 font-extrabold text-xs sm:text-sm shadow-2xs select-none animate-pulse"
            role="status"
          >
            <span role="img" aria-label="Jam Masuk" className="text-base">⏰</span>
            <span>{cleanTimeNote.endsWith('✨') ? cleanTimeNote : `${cleanTimeNote} ✨`}</span>
          </div>
        </div>
      )}

      {/* Doctor List with Cute Medical Icons */}
      {doctors.length > 0 && (
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500/90 flex items-center gap-1">
              <span>🩺</span>
              <span>Dokter Poli & Konsul</span>
            </span>
            <span className="text-[10px] font-bold text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
              {doctors.length} Dokter
            </span>
          </div>

          <div className="space-y-2">
            {doctors.map((doctor, idx) => {
              const badge = getDoctorBadgeInfo(doctor);

              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-pink-50/50 hover:bg-pink-50/80 border border-pink-100/90 transition-all shadow-2xs group"
                >
                  {/* Themed Icon Box */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-pink-200/80 flex items-center justify-center text-lg sm:text-xl shadow-2xs shrink-0 select-none transition-transform group-hover:scale-105">
                    <span role="img" aria-label={badge.typeLabel}>
                      {badge.icon}
                    </span>
                  </div>

                  {/* Doctor Name & Specialty */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs sm:text-sm font-extrabold truncate leading-tight tracking-tight"
                      style={{ color: '#4A2E35' }}
                    >
                      {doctor}
                    </p>
                    <span className="inline-flex items-center text-[10px] font-bold text-pink-400 mt-0.5">
                      {badge.typeLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fallback if no doctors registered */}
      {doctors.length === 0 && (
        <div className="p-3 rounded-2xl bg-pink-50/40 border border-pink-100/70 text-center mb-4">
          <p className="text-xs font-semibold text-pink-400 italic">
            Daftar dokter poli belum terdaftar di slot ini.
          </p>
        </div>
      )}

      {/* Other Tasks (if any non-doctor tasks remain) */}
      {otherTasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-pink-100/80 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500/90 flex items-center gap-1 px-1">
            <span>✨</span>
            <span>Tugas Tambahan / Piket</span>
          </span>

          <div className="space-y-1.5">
            {otherTasks.map((task, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 px-3 py-2 rounded-xl bg-pink-50/40 border border-pink-100/70 text-xs font-semibold leading-relaxed"
                style={{ color: '#4A2E35' }}
              >
                <span className="text-pink-400 text-xs shrink-0 mt-0.5 select-none">💖</span>
                <span className="flex-1">{task}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Petugas Dinas / Assignees (optional) */}
      {showAssignees && rawAssignees.length > 0 && (
        <div className="mt-4 pt-3 border-t border-pink-100/80 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-pink-400 flex items-center gap-1">
            <span>👩‍⚕️</span>
            <span>Rekan Dinas:</span>
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {rawAssignees.map((assignee, idx) => {
              const isAfiz = /afiz/i.test(assignee);
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    isAfiz
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-pink-100/80 text-pink-800'
                  }`}
                >
                  {isAfiz ? 'Afiz 💖' : assignee}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. Main PrincessShiftCard Component
// ==========================================
export interface PrincessShiftCardProps {
  /** Single slot assignment to render */
  assignment?: SlotAssignment;
  /** Multiple slot assignments (for multi-shift handling on the same date) */
  assignments?: SlotAssignment[];
  /** Optional date label string (e.g. "Senin, 2 Nov 2026") */
  dateLabel?: string;
  /** Additional CSS class names */
  className?: string;
  /** Whether user is on leave / cuti */
  isLeave?: boolean;
  /** Leave note explanation (e.g. "Afiz cuti") */
  leaveNote?: string;
  /** Whether user has no duties on this date */
  isOff?: boolean;
  /** Whether to show raw assignees footer */
  showAssignees?: boolean;
  /** Optional collective task (string or SlotAssignment from slot 28) */
  collectiveTask?: string | SlotAssignment;
}

/**
 * PrincessShiftCard
 * 
 * Central Strawberry Milk Edition shift card component.
 * Features:
 * - Scalloped lace border (.lace-card)
 * - Corner ribbon bows (RibbonBow)
 * - Bold dark-rose shift title (e.g. "SHIFT 14.00 🍓")
 * - Highlight pill (⏰ Masuk jam 12 ya! ✨)
 * - Categorized doctor badges with cute medical icons (🦴, 🩹, 🩺, 💊)
 * - Additional tasks bulleted with pink hearts 💖
 * - Handles leave & off resting states with FluffyCloud
 * - Handles multiple shifts vertically stacked
 * - Renders bottom collective task banner when provided
 */
export const PrincessShiftCard: React.FC<PrincessShiftCardProps> = ({
  assignment,
  assignments,
  dateLabel,
  className = '',
  isLeave = false,
  leaveNote,
  isOff = false,
  showAssignees = false,
  collectiveTask,
}) => {
  // 1. Leave state takes highest priority
  if (isLeave) {
    return (
      <div className={`space-y-4 ${className}`}>
        <PrincessLeaveCard leaveNote={leaveNote} dateLabel={dateLabel} />
        {collectiveTask && (
          <PrincessCollectiveTaskBanner
            taskText={typeof collectiveTask === 'string' ? collectiveTask : undefined}
            slot={typeof collectiveTask !== 'string' ? collectiveTask : undefined}
          />
        )}
      </div>
    );
  }

  // 2. Normalize list of assignments
  const activeAssignments: SlotAssignment[] = [];
  if (assignment) {
    activeAssignments.push(assignment);
  } else if (assignments && assignments.length > 0) {
    activeAssignments.push(...assignments);
  }

  // 3. Off state: if explicitly marked isOff or no assignments available
  if (isOff || activeAssignments.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <PrincessOffCard dateLabel={dateLabel} />
        {collectiveTask && (
          <PrincessCollectiveTaskBanner
            taskText={typeof collectiveTask === 'string' ? collectiveTask : undefined}
            slot={typeof collectiveTask !== 'string' ? collectiveTask : undefined}
          />
        )}
      </div>
    );
  }

  // 4. Single Shift
  if (activeAssignments.length === 1) {
    return (
      <div className={`space-y-4 ${className}`}>
        <PrincessSingleShiftCard
          assignment={activeAssignments[0]}
          dateLabel={dateLabel}
          showAssignees={showAssignees}
        />
        {collectiveTask && (
          <PrincessCollectiveTaskBanner
            taskText={typeof collectiveTask === 'string' ? collectiveTask : undefined}
            slot={typeof collectiveTask !== 'string' ? collectiveTask : undefined}
          />
        )}
      </div>
    );
  }

  // 5. Multi-Shift handling: stack cards vertically
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Multi-shift indicator badge */}
      <div className="flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/90 border border-pink-200 text-pink-700 text-xs font-black shadow-2xs">
          <span>🍓</span>
          <span>{activeAssignments.length} Shift Bertugas Hari Ini</span>
        </span>
      </div>

      {activeAssignments.map((shift, idx) => (
        <PrincessSingleShiftCard
          key={shift.slotId || idx}
          assignment={shift}
          dateLabel={dateLabel}
          showAssignees={showAssignees}
        />
      ))}

      {collectiveTask && (
        <PrincessCollectiveTaskBanner
          taskText={typeof collectiveTask === 'string' ? collectiveTask : undefined}
          slot={typeof collectiveTask !== 'string' ? collectiveTask : undefined}
        />
      )}
    </div>
  );
};

// Re-export collective task banner for convenience
export { PrincessCollectiveTaskBanner } from './PrincessCollectiveTaskBanner';
export type { PrincessCollectiveTaskBannerProps } from './PrincessCollectiveTaskBanner';
