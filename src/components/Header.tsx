import React from 'react';
import { 
  Building2, 
  FileSpreadsheet, 
  UploadCloud, 
  Share2, 
  Calendar, 
  User, 
  Stethoscope, 
  CheckCircle2 
} from 'lucide-react';
import { ViewMode } from '../types/schedule';

interface HeaderProps {
  fileName: string;
  periodLabel?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenUpload: () => void;
  onOpenShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fileName,
  periodLabel,
  viewMode,
  onViewModeChange,
  onOpenUpload,
  onOpenShare,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar: Brand & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Jadwal Shift Klinik Internis & Bedah
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  <CheckCircle2 className="w-3 h-3 text-teal-600" /> Client-Side
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 font-medium text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {fileName}
                </span>
                {periodLabel && (
                  <>
                    <span>•</span>
                    <span className="text-teal-700 font-semibold">{periodLabel}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onOpenShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              title="Bagikan format WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Share WA</span>
            </button>
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all shadow-sm shadow-teal-600/20"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Ganti File Excel</span>
            </button>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onViewModeChange('personal')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              viewMode === 'personal'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Jadwal Saya</span>
          </button>
          <button
            onClick={() => onViewModeChange('daily')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              viewMode === 'daily'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Semua Jadwal Harian</span>
          </button>
          <button
            onClick={() => onViewModeChange('doctors')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              viewMode === 'doctors'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Cari Dokter & Asisten</span>
          </button>
        </div>
      </div>
    </header>
  );
};

