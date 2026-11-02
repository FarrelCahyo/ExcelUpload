import React from 'react';
import { TwinkleStar } from './illustrations';
import { SlotAssignment } from '../types/schedule';

export interface PrincessCollectiveTaskBannerProps {
  /** Custom task title text. Default: 'Evaluasi BPJS & Print Resume' */
  taskText?: string;
  /** Optional slot assignment from row 100 / Slot #28 to extract task text from */
  slot?: SlotAssignment;
  /** Optional CSS class name */
  className?: string;
  /** Optional click handler (e.g. to open task details) */
  onClick?: () => void;
}

/**
 * Cleans and normalizes collective duty task names from Excel row 100.
 */
export function cleanCollectiveTaskTitle(text: string): string {
  let cleaned = text.trim();

  // If text contains "EVALUASI BPJS dan Print resume"
  if (/evaluasi\s+bpjs\s+dan\s+print\s+resume/i.test(cleaned)) {
    return 'Evaluasi BPJS & Print Resume';
  }

  // Remove trailing piket notes if any
  cleaned = cleaned.replace(/\s*PIKET\s*5R1P/i, '').trim();
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

  return cleaned || 'Evaluasi BPJS & Print Resume';
}

/**
 * PrincessCollectiveTaskBanner
 * 
 * Reusable banner matching the reference mockup bottom pill:
 * "📋 Evaluasi BPJS & Print Resume ✨"
 * Displays collective duties (Slot #28 / Row 100) with soft pink background,
 * border, and kawaii twinkle stars.
 */
export const PrincessCollectiveTaskBanner: React.FC<PrincessCollectiveTaskBannerProps> = ({
  taskText = 'Evaluasi BPJS & Print Resume',
  slot,
  className = '',
  onClick,
}) => {
  const rawText = slot?.tasks?.[0] || taskText;
  const cleanedTitle = cleanCollectiveTaskTitle(rawText);

  // Ensure prefix 📋 and suffix ✨
  const titleWithoutPrefix = cleanedTitle.replace(/^📋\s*/, '').replace(/\s*✨$/, '').trim();
  const finalTitle = `📋 ${titleWithoutPrefix} ✨`;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden bg-pink-50/95 hover:bg-pink-100/80 border border-pink-200/80 rounded-2xl px-4 py-3 sm:py-3.5 shadow-xs transition-all flex items-center justify-center gap-2.5 select-none text-center ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      } ${className}`}
      role="note"
      aria-label={finalTitle}
    >
      {/* Sparkles decoration */}
      <TwinkleStar
        size={18}
        color="#FF8DA1"
        className="shrink-0 transition-transform group-hover:rotate-45 group-hover:scale-110"
      />

      <span
        className="text-xs sm:text-sm font-extrabold tracking-wide drop-shadow-2xs leading-snug"
        style={{ color: '#C2185B' }}
      >
        {finalTitle}
      </span>

      <TwinkleStar
        size={18}
        color="#FFD166"
        className="shrink-0 transition-transform group-hover:-rotate-45 group-hover:scale-110"
      />
    </div>
  );
};
