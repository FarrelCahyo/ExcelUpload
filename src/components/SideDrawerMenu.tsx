import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types/schedule';
import { X, FileSpreadsheet, Share2, Trash2, Home, CalendarDays, Heart, Users, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BunnyNurseAvatar, TwinkleStar, RibbonBow } from './illustrations';

export interface SideDrawerMenuProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback fired when user closes the drawer */
  onClose: () => void;
  /** Triggered to open upload modal */
  onOpenUpload: () => void;
  /** Optional callback to open share modal / copy share text */
  onOpenShare?: () => void;
  /** Callback to clear cached schedule data */
  onClearData: () => void;
  /** Uploaded file name for metadata display */
  fileName?: string;
  /** Formatted schedule period label */
  periodLabel?: string;
  /** Total count of days in schedule */
  totalDays?: number;
  /** Currently active navigation tab */
  activeTab?: ActiveTab;
  /** Callback to switch navigation tab */
  onTabChange?: (tab: ActiveTab) => void;
  /** Additional CSS class names */
  className?: string;
}

export const SideDrawerMenu: React.FC<SideDrawerMenuProps> = ({
  isOpen,
  onClose,
  onOpenUpload,
  onOpenShare,
  onClearData,
  fileName,
  periodLabel,
  totalDays,
  activeTab,
  onTabChange,
  className = '',
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Reset confirmation state when drawer opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowClearConfirm(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavClick = (tab: ActiveTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    onClose();
  };

  const handleUploadClick = () => {
    onClose();
    onOpenUpload();
  };

  const handleShareClick = () => {
    onClose();
    if (onOpenShare) {
      onOpenShare();
    }
  };

  const handleConfirmClear = () => {
    setShowClearConfirm(false);
    onClearData();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 select-none animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-menu-title"
    >
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-over Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 max-w-xs sm:max-w-sm w-full bg-white/95 backdrop-blur-md shadow-2xl z-50 flex flex-col p-5 overflow-y-auto border-l border-pink-200/90 transition-transform duration-300 ease-out animate-in slide-in-from-right ${className}`}
      >
        {/* Top App Bar & Close Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🍓</span>
            <span className="text-xs font-black text-[#D63447] uppercase tracking-wider">
              Menu & Pengaturan
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Menu"
            className="w-9 h-9 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#FF6B8B] hover:text-[#D63447] flex items-center justify-center border border-pink-200/80 transition-colors cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Persona Header Card */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100/80 p-4 rounded-3xl border border-pink-200/90 shadow-2xs relative overflow-hidden mb-5">
          <div className="absolute -top-1.5 -right-1.5 pointer-events-none">
            <TwinkleStar size={14} color="#FFD166" glow />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <BunnyNurseAvatar size={58} showBorder={true} />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                id="drawer-menu-title"
                className="text-base font-black text-[#4A2E35] tracking-tight leading-snug"
              >
                Jadwal Shift Cantikku 🍓
              </h3>
              <p className="text-[11px] font-bold text-[#FF6B8B]">
                Poli Internis & Bedah ✨
              </p>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-white/90 border border-pink-200 text-[10px] font-extrabold text-[#C2185B]">
                <span>💖</span>
                <span>Afiz Kesayanganku</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active File Status Card */}
        <div className="bg-white p-3.5 rounded-2xl border border-pink-200/80 shadow-2xs space-y-2 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#9B5160] uppercase tracking-wider flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#FF6B8B]" />
              <span>Status File Aktif:</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Aktif
            </span>
          </div>

          <div className="bg-pink-50/60 p-2.5 rounded-xl border border-pink-100 text-xs space-y-1">
            <p className="font-extrabold text-[#4A2E35] truncate" title={fileName}>
              📁 {fileName || 'NOVEMBER MG 1 2026.xlsx'}
            </p>
            {periodLabel && (
              <p className="text-[11px] font-bold text-[#8C5E68]">
                📅 {periodLabel}
              </p>
            )}
            {typeof totalDays === 'number' && (
              <p className="text-[10px] font-semibold text-pink-500">
                ✨ {totalDays} Hari Terdata
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 text-[10px] font-semibold text-[#8C5E68]/80 pt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Tersimpan di browser HP kamu (offline ready)</span>
          </div>
        </div>

        {/* Tab Navigation Shortcuts */}
        {onTabChange && (
          <div className="space-y-1.5 mb-5">
            <span className="text-[10px] font-black text-[#9B5160] uppercase tracking-wider block px-1">
              Navigasi Cepat:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className={`p-2.5 rounded-2xl flex items-center gap-2 text-xs font-black transition-all cursor-pointer border ${
                  activeTab === 'home'
                    ? 'bg-pink-100 text-[#D63447] border-pink-300 shadow-2xs'
                    : 'bg-white hover:bg-pink-50 text-[#4A2E35] border-pink-100'
                }`}
              >
                <span>🏠</span>
                <span>Beranda</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('calendar')}
                className={`p-2.5 rounded-2xl flex items-center gap-2 text-xs font-black transition-all cursor-pointer border ${
                  activeTab === 'calendar'
                    ? 'bg-pink-100 text-[#D63447] border-pink-300 shadow-2xs'
                    : 'bg-white hover:bg-pink-50 text-[#4A2E35] border-pink-100'
                }`}
              >
                <span>📅</span>
                <span>Kalender</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('notes')}
                className={`p-2.5 rounded-2xl flex items-center gap-2 text-xs font-black transition-all cursor-pointer border ${
                  activeTab === 'notes'
                    ? 'bg-pink-100 text-[#D63447] border-pink-300 shadow-2xs'
                    : 'bg-white hover:bg-pink-50 text-[#4A2E35] border-pink-100'
                }`}
              >
                <span>🔔</span>
                <span>Pesan Cinta</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('team')}
                className={`p-2.5 rounded-2xl flex items-center gap-2 text-xs font-black transition-all cursor-pointer border ${
                  activeTab === 'team'
                    ? 'bg-pink-100 text-[#D63447] border-pink-300 shadow-2xs'
                    : 'bg-white hover:bg-pink-50 text-[#4A2E35] border-pink-100'
                }`}
              >
                <span>👥</span>
                <span>Jadwal Teman</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="space-y-2 mt-auto pt-4 border-t border-pink-100">
          <span className="text-[10px] font-black text-[#9B5160] uppercase tracking-wider block px-1">
            Aksi Jadwal:
          </span>

          {/* Ganti File Excel Button */}
          <button
            type="button"
            onClick={handleUploadClick}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 border border-pink-200 text-[#D63447] text-xs font-black flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <span>📁</span>
            <span>Ganti File Excel (.xlsx)</span>
          </button>

          {/* Share Jadwal WhatsApp Button */}
          {onOpenShare && (
            <button
              type="button"
              onClick={handleShareClick}
              className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Share Jadwal WhatsApp 📲</span>
            </button>
          )}

          {/* Hapus Data Cache Button or Confirmation */}
          {!showClearConfirm ? (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="w-full p-3 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Data Cache 🗑️</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 animate-in fade-in">
              <div className="flex items-start gap-1.5 text-xs text-rose-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>Yakin ingin hapus seluruh data jadwal tersimpan?</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-colors cursor-pointer"
                >
                  Ya, Hapus
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Affectionate Footer */}
        <div className="mt-5 text-center pt-3 border-t border-pink-100">
          <p className="text-[11px] font-black text-[#C2185B]">
            Dibuat dengan segenap cinta untuk Suster Afiz 💖🍓
          </p>
          <p className="text-[9px] font-semibold text-[#8C5E68]/70 mt-0.5">
            Strawberry Milk Schedule • Versi Spesial Afiz
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideDrawerMenu;
