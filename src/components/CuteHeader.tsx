import React from 'react';
import { BunnyNurseAvatar, StrawberryMilkBox, StrawberryPill, TwinkleStar } from './illustrations';

export interface CuteHeaderProps {
  /** Triggered when the user clicks the floating Strawberry Milk carton */
  onOpenUpload: () => void;
  /** Triggered when the user clicks the pink hamburger menu */
  onOpenMenu: () => void;
  /** Name of the assistant (defaults to 'Afiz') */
  assistantName?: string;
  /** Schedule period label (e.g. 'November Mg 1 2026') */
  periodLabel?: string;
  /** Uploaded file name for subtle metadata reference */
  fileName?: string;
  /** Additional CSS class names */
  className?: string;
}

export const CuteHeader: React.FC<CuteHeaderProps> = ({
  onOpenUpload,
  onOpenMenu,
  assistantName = 'Afiz',
  periodLabel,
  fileName,
  className = '',
}) => {
  return (
    <header className={`w-full max-w-md sm:max-w-xl mx-auto px-4 pt-3 pb-2 select-none ${className}`}>
      {/* 1. Top App Bar */}
      <div className="flex items-center justify-between mb-3">
        {/* Left: Mini Strawberry Icon Button / Logo */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center p-1 rounded-2xl bg-white/90 border border-pink-200/80 shadow-xs hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer">
            <StrawberryPill active size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-[#D63447] tracking-tight bg-pink-50/90 px-2 py-0.5 rounded-full border border-pink-200/70 shadow-2xs">
              Poli Internis & Bedah
            </span>
            {fileName && (
              <span className="text-[9px] font-semibold text-[#8C5E68] truncate max-w-[140px] px-1 mt-0.5">
                {fileName}
              </span>
            )}
          </div>
        </div>

        {/* Right: Cute Pink Hamburger Menu Button */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Buka Menu"
          title="Buka Menu Pengaturan & Jadwal Teman"
          className="w-10 h-10 rounded-2xl bg-white/90 hover:bg-pink-100/90 active:scale-95 transition-all duration-150 flex flex-col items-center justify-center gap-1 border border-pink-200/80 shadow-xs cursor-pointer group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-pink-400"
        >
          <span className="w-5 h-0.5 rounded-full bg-[#FF6B8B] group-hover:bg-[#D63447] transition-colors" />
          <span className="w-5 h-0.5 rounded-full bg-[#FF6B8B] group-hover:bg-[#D63447] transition-colors" />
          <span className="w-5 h-0.5 rounded-full bg-[#FF6B8B] group-hover:bg-[#D63447] transition-colors" />
        </button>
      </div>

      {/* 2. Greeting Banner */}
      <div className="relative mb-3.5">
        <div className="flex items-center gap-1.5">
          <h1 className="text-xl sm:text-2xl font-black text-[#C2185B] tracking-tight font-display leading-tight drop-shadow-2xs">
            Semangat Dinasnya Cantikku! 🍓🍰
          </h1>
          <div className="hidden sm:block shrink-0">
            <TwinkleStar size={14} color="#FFD166" glow />
          </div>
        </div>
        {periodLabel && (
          <p className="text-xs font-extrabold text-[#9B5160] mt-0.5 flex items-center gap-1">
            <span>📅</span>
            <span>{periodLabel}</span>
          </p>
        )}
      </div>

      {/* 3. Persona Section (Avatar + Name Pill on Left/Center, Floating Milk Carton on Right) */}
      <div className="flex items-center justify-between gap-3 bg-white/70 backdrop-blur-xs p-3 sm:p-3.5 rounded-3xl border border-pink-200/80 shadow-xs relative overflow-visible">
        {/* Decorative corner sparkles */}
        <div className="absolute -top-1.5 -left-1.5 pointer-events-none">
          <TwinkleStar size={12} color="#FFA4B4" />
        </div>
        <div className="absolute -bottom-1 -right-1 pointer-events-none">
          <TwinkleStar size={12} color="#FFD166" />
        </div>

        {/* Left/Center: Avatar + Name Pill */}
        <div className="flex items-center gap-3">
          {/* Bunny Nurse Avatar with Gentle Glow */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-pink-300/30 blur-md transform scale-90" />
            <BunnyNurseAvatar size={76} showSparkles={true} showBorder={true} />
          </div>

          {/* Name Pill & Affectionate Subtitle */}
          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 border-2 border-pink-200 shadow-xs">
              <span className="text-sm sm:text-base font-black text-[#4A2E35] tracking-tight">
                {assistantName}
              </span>
              <span className="text-sm select-none animate-pulse">💖</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-[#FF6B8B] tracking-wide px-1">
              Princess On Duty ✨
            </span>
          </div>
        </div>

        {/* Right: Floating Strawberry Milk Carton (.xlsx upload trigger) */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenUpload}
            aria-label="Upload Jadwal"
            title="Klik untuk upload file Excel jadwal baru (.xlsx)"
            className="flex flex-col items-center group cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-pink-400 rounded-2xl p-1 transition-transform"
          >
            <div className="animate-float group-hover:scale-105 active:scale-95 transition-transform duration-200">
              <StrawberryMilkBox size={66} showExcelBadge={true} />
            </div>
            <span className="text-[10px] font-black text-[#C2185B] bg-white/95 px-2.5 py-0.5 rounded-full border border-pink-200/90 shadow-2xs group-hover:bg-pink-50 group-hover:text-[#D63447] transition-all whitespace-nowrap -mt-1">
              Upload Jadwal
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default CuteHeader;
