import React, { useState, useRef, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, Sparkles, Trash2 } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { ParsedScheduleData } from '../types/schedule';
import {
  FluffyCloud,
  TwinkleStar,
  StrawberryMilkBox,
  KawaiiFileMascot,
} from './illustrations';

export interface KawaiiUploadModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Callback fired when user closes the modal */
  onClose: () => void;
  /** Callback fired when file is successfully parsed */
  onDataLoaded: (data: ParsedScheduleData) => void;
  /** Currently loaded file name, if any */
  currentFileName?: string;
  /** Callback to clear stored schedule data from browser */
  onClearData?: () => void;
  /** Whether there is existing data in localStorage */
  hasExistingData?: boolean;
}

export const KawaiiUploadModal: React.FC<KawaiiUploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  currentFileName,
  onClearData,
  hasExistingData = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef<number>(0);

  // Reset state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
      setIsLoading(false);
      setIsDragging(false);
      dragCounterRef.current = 0;
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('File harus berformat Excel (.xlsx atau .xls) ya sayang 🌸');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const parsed = await parseExcelFile(file);
      setSuccessMsg(
        `Yey! Berhasil memuat "${file.name}" (${parsed.days.length} hari jadwal, ${parsed.assistantList.length} asisten) 🎉🍓`
      );

      // Brief gentle delay so user sees success confirmation
      setTimeout(() => {
        onDataLoaded(parsed);
        setIsLoading(false);
        onClose();
      }, 550);
    } catch (err) {
      setIsLoading(false);
      const detail = err instanceof Error ? err.message : 'Pastikan format sheet memiliki jadwal internis ya sayang 🌸';
      setError(detail);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kawaii-upload-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      {/* Floating Sparkles in the Backdrop */}
      <div className="absolute top-8 left-8 sm:left-16 pointer-events-none opacity-80 animate-pulse">
        <TwinkleStar size={24} color="#FFE082" glow />
      </div>
      <div
        className="absolute top-16 right-8 sm:right-20 pointer-events-none opacity-75 animate-pulse"
        style={{ animationDelay: '500ms' }}
      >
        <TwinkleStar size={20} color="#FF8DA1" />
      </div>
      <div
        className="absolute bottom-12 left-10 sm:left-24 pointer-events-none opacity-70 animate-pulse"
        style={{ animationDelay: '1000ms' }}
      >
        <TwinkleStar size={18} color="#FFD166" />
      </div>
      <div
        className="absolute bottom-10 right-12 sm:right-28 pointer-events-none opacity-80 animate-pulse"
        style={{ animationDelay: '1500ms' }}
      >
        <TwinkleStar size={22} color="#FFA4B4" glow />
      </div>

      {/* Modal Dialog Container with Top Spacing for Floating Cloud & 3D Milk Carton */}
      <div className="relative w-full max-w-sm sm:max-w-md my-auto pt-16 pb-4">
        {/* Top Cloud & Strawberry Milk Topper */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
          {/* Centered 3D Strawberry Milk Box */}
          <div className="relative animate-float z-10 -mb-7">
            <StrawberryMilkBox size={96} showExcelBadge={false} />
            {/* Twinkle Sparkles around Strawberry Milk Box */}
            <div className="absolute -top-1 -right-2">
              <TwinkleStar size={18} color="#FFD166" glow />
            </div>
            <div className="absolute top-7 -left-3">
              <TwinkleStar size={14} color="#FF8DA1" glow />
            </div>
          </div>

          {/* Large Pastel Fluffy Cloud Cluster */}
          <div className="relative flex items-center justify-center w-[230px]">
            {/* Left cloud puff */}
            <div className="absolute -left-6 bottom-1 opacity-90 scale-75">
              <FluffyCloud size={96} variant="white" />
            </div>
            {/* Main cloud */}
            <div className="relative">
              <FluffyCloud size={170} variant="pink" withSparkles />
            </div>
            {/* Right cloud puff */}
            <div className="absolute -right-6 bottom-1 opacity-90 scale-75">
              <FluffyCloud size={96} variant="white" />
            </div>
          </div>
        </div>

        {/* Modal Card Body */}
        <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-2xl p-5 sm:p-6 pt-11 relative overflow-hidden transition-all duration-300 scale-100 animate-in zoom-in-95">
          {/* Close button in top-right */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Tutup modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 active:scale-95 text-[#FF6B8B] hover:text-[#D63447] flex items-center justify-center transition-all cursor-pointer border border-pink-200/60 z-30 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-pink-300"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Modal Header */}
          <div className="text-center mt-1">
            <h2
              id="kawaii-upload-title"
              className="text-lg sm:text-xl font-black text-[#9D174D] font-display leading-tight tracking-tight"
            >
              Upload Jadwal Excel .xlsx ☁️🍓🥛
            </h2>
            <p className="text-xs text-[#8C5E68] font-medium mt-1">
              Pilih file jadwal dinas klinik (.xlsx)
            </p>

            {/* Current Active File Badge if provided */}
            {currentFileName && (
              <div className="flex items-center justify-center mt-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-pink-50/90 text-[#C2185B] border border-pink-200/80 max-w-[280px] truncate shadow-2xs">
                  <span className="text-xs">📄</span>
                  <span className="truncate">File aktif: {currentFileName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Dropzone Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`mt-4 border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer ${
              isDragging
                ? 'border-[#FF6B8B] bg-pink-100/70 scale-[1.02] shadow-lg shadow-pink-200/50'
                : 'border-pink-300 hover:border-pink-400 bg-pink-50/40 hover:bg-pink-50/80 shadow-2xs'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Kawaii Mascot */}
            <div className="relative mb-2">
              <KawaiiFileMascot
                size={64}
                className="transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            <p className="text-xs sm:text-sm font-bold text-[#754E41] mb-0.5">
              {isDragging ? 'Lepaskan file Excel di sini! 🍓' : 'Seret & lepas file ke sini'}
            </p>
            <p className="text-[11px] text-[#A06D76] mb-3">
              Format sheet otomatis mendeteksi jadwal internis ✨
            </p>

            {/* Ribbon-shaped Button "Pilih File 📁" */}
            <div className="relative inline-flex items-center justify-center my-1 filter drop-shadow-sm">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isLoading) fileInputRef.current?.click();
                }}
                disabled={isLoading}
                className="ribbon-badge cursor-pointer px-5 py-2 text-xs sm:text-sm font-black transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, calc(100% - 8px) 50%, 100% 100%, 0% 100%, 8px 50%)',
                }}
              >
                <span>Pilih File 📁</span>
              </button>
            </div>
          </div>

          {/* Loading & Parsing State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-2 mt-4 p-4 rounded-2xl bg-pink-50/90 border border-pink-200/80 text-center animate-in fade-in duration-150">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs animate-bounce">
                  <span className="text-xl">🍓</span>
                </div>
                <div className="absolute -top-1 -right-1 animate-spin">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-[#C2185B]">
                  Sedang membaca jadwal dinas sayang... 🍓✨
                </p>
                <p className="text-[11px] text-[#8C5E68] mt-0.5">
                  Menyusun jadwal dokter internis & perawat klinik
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-start gap-2.5 mt-4 p-3.5 rounded-2xl bg-rose-50/95 border border-rose-200 text-xs animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-[#D63447] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-[#D63447] flex items-center gap-1">
                  <span>Aww, gagal membaca file Excel</span>
                  <span>🥺🌸</span>
                </p>
                <p className="text-[#8C5E68] mt-0.5 font-medium leading-relaxed">
                  Pastikan format sheet memiliki jadwal internis ya sayang 🌸
                </p>
                <p className="text-[11px] text-rose-500/90 mt-1 font-mono break-all">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {successMsg && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold py-2.5 px-6 rounded-full transition-colors cursor-pointer text-xs sm:text-sm active:scale-95 disabled:opacity-50"
            >
              Batal
            </button>
          </div>

          {/* Optional: Clear Stored Data button if existing data */}
          {hasExistingData && onClearData && (
            <div className="mt-4 pt-3 border-t border-pink-100/90 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      'Yakin ingin menghapus data jadwal yang tersimpan di browser ini ya cantik? 🌸'
                    )
                  ) {
                    onClearData();
                    onClose();
                  }
                }}
                className="text-[#D63447] hover:text-[#9D174D] font-bold text-[11px] inline-flex items-center gap-1 hover:underline cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Data Tersimpan</span>
              </button>
              <span className="text-[10px] text-pink-400 font-medium">100% di browser lokal</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KawaiiUploadModal;
