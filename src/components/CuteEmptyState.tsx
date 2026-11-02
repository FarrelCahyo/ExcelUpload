import React, { useState, useRef } from 'react';
import { Sparkles, AlertCircle, CheckCircle2, ShieldCheck, Heart, Stethoscope, Share2 } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { ParsedScheduleData } from '../types/schedule';
import {
  BunnyNurseAvatar,
  StrawberryMilkBox,
  FluffyCloud,
  TwinkleStar,
} from './illustrations';

export interface CuteEmptyStateProps {
  /** Triggered when user clicks the upload button (e.g. to open KawaiiUploadModal) */
  onOpenUpload?: () => void;
  /** Direct callback when a file is processed directly in this empty state */
  onDataLoaded?: (data: ParsedScheduleData) => void;
  /** Additional CSS class names */
  className?: string;
}

export const CuteEmptyState: React.FC<CuteEmptyStateProps> = ({
  onOpenUpload,
  onDataLoaded,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef<number>(0);

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
      setSuccessMsg(`Yey! Berhasil memuat "${file.name}" 🎉🍓`);
      setTimeout(() => {
        setIsLoading(false);
        if (onDataLoaded) {
          onDataLoaded(parsed);
        }
      }, 500);
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
      if (onDataLoaded) {
        handleProcessFile(e.dataTransfer.files[0]);
      } else if (onOpenUpload) {
        onOpenUpload();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (onOpenUpload) {
      onOpenUpload();
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`w-full max-w-xl mx-auto py-6 sm:py-10 px-4 select-none relative ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Scalloped Card Container with Gingham Checkered Background */}
      <div
        className={`bg-gingham rounded-3xl border-2 border-dashed transition-all duration-300 p-6 sm:p-10 relative overflow-hidden text-center shadow-xl ${
          isDragging
            ? 'border-[#FF6B8B] bg-pink-100/70 scale-[1.01] shadow-pink-300/50'
            : 'border-pink-200/90 shadow-pink-200/40 hover:border-pink-300'
        }`}
      >
        {/* Floating Background Clouds */}
        <div className="absolute -top-6 -left-8 pointer-events-none opacity-80 animate-float">
          <FluffyCloud size={110} variant="white" />
        </div>
        <div
          className="absolute -top-4 -right-8 pointer-events-none opacity-85 animate-float"
          style={{ animationDelay: '1.5s' }}
        >
          <FluffyCloud size={105} variant="pink" withSparkles />
        </div>
        <div className="absolute top-1/2 -left-10 pointer-events-none opacity-60 hidden sm:block">
          <FluffyCloud size={85} variant="white" />
        </div>
        <div className="absolute top-1/3 -right-6 pointer-events-none opacity-60 hidden sm:block">
          <FluffyCloud size={80} variant="pink" />
        </div>

        {/* Floating Twinkle Sparkles */}
        <div className="absolute top-12 left-10 pointer-events-none animate-pulse">
          <TwinkleStar size={20} color="#FFD166" glow />
        </div>
        <div
          className="absolute top-16 right-12 pointer-events-none animate-pulse"
          style={{ animationDelay: '700ms' }}
        >
          <TwinkleStar size={18} color="#FF8DA1" glow />
        </div>
        <div
          className="absolute bottom-14 left-12 pointer-events-none animate-pulse"
          style={{ animationDelay: '1.2s' }}
        >
          <TwinkleStar size={16} color="#FFD166" />
        </div>
        <div
          className="absolute bottom-16 right-10 pointer-events-none animate-pulse"
          style={{ animationDelay: '1.8s' }}
        >
          <TwinkleStar size={22} color="#FFA4B4" glow />
        </div>

        {/* Mascot Centerpiece: Bunny Nurse & 3D Strawberry Milk Box resting on Cloud */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-2 mb-4">
          {/* Cloud Base */}
          <div className="relative flex items-center justify-center">
            {/* Soft pink fluffy cloud beneath the mascots */}
            <FluffyCloud size={220} variant="pink" withSparkles className="drop-shadow-sm" />

            {/* Bunny Nurse & Strawberry Milk Box placed on the cloud */}
            <div className="absolute bottom-4 flex items-end justify-center gap-1 sm:gap-2">
              {/* Bunny Nurse Avatar */}
              <div className="relative hover:scale-105 transition-transform duration-200">
                <BunnyNurseAvatar
                  size={120}
                  showSparkles={true}
                  showBorder={true}
                />
              </div>

              {/* 3D Strawberry Milk Carton sitting cutely next to Bunny Nurse */}
              <div
                className="relative -mb-1 animate-float hover:scale-105 transition-transform duration-200"
                style={{ animationDelay: '1s' }}
              >
                <StrawberryMilkBox size={80} showExcelBadge={true} />
              </div>
            </div>
          </div>

          {/* Sweet Welcome Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 text-[#C2185B] text-[11px] font-extrabold border border-pink-200/80 shadow-2xs mt-1">
            <span>🌸</span>
            <span>Strawberry Milk Edition</span>
            <span>🌸</span>
          </div>
        </div>

        {/* Personal Greeting & Welcoming Text */}
        <div className="relative z-10 max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-[#9D174D] font-display tracking-tight leading-tight drop-shadow-2xs">
            Halo Cantikku! 🍓✨
          </h1>
          <p className="text-xs sm:text-sm text-[#8C5E68] font-semibold mt-2.5 leading-relaxed">
            Yuk unggah file jadwal dinas klinik kamu biar jadwal dokter dan shift kamu langsung tampil rapi di sini 💕
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="relative z-10 mt-6 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isLoading}
            className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-black text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 border-2 border-white/80 strawberry-glow inline-flex items-center gap-2.5 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #FF4D6D 0%, #FF6B8B 50%, #FF8DA1 100%)',
            }}
          >
            <span>Upload Jadwal Sekarang</span>
            <span className="text-lg">🍓🥛</span>
          </button>

          <p className="text-[11px] text-[#A06D76] font-medium mt-2.5">
            {isDragging
              ? 'Lepaskan file Excel sekarang! 🌸'
              : 'Atau cukup seret & lepas file Excel (.xlsx) ke area ini'}
          </p>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 mt-5 p-4 rounded-2xl bg-white/90 border border-pink-200 text-center animate-in fade-in duration-150">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shadow-xs animate-bounce">
                <span className="text-xl">🍓</span>
              </div>
              <div className="absolute -top-1 -right-1 animate-spin">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <p className="text-xs font-black text-[#C2185B]">Sedang membaca jadwal dinas sayang... 🍓✨</p>
          </div>
        )}

        {/* Error Indicator */}
        {error && (
          <div className="relative z-10 flex items-start gap-2.5 mt-5 p-3.5 rounded-2xl bg-rose-50/95 border border-rose-200 text-xs text-left animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-[#D63447] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-[#D63447]">Aww, gagal membaca file Excel 🥺🌸</p>
              <p className="text-[#8C5E68] mt-0.5 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Success Indicator */}
        {successMsg && (
          <div className="relative z-10 flex items-center justify-center gap-2 mt-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        {/* Four Cute Feature Highlight Pills */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-8 pt-6 border-t border-pink-200/60">
          <div className="bg-white/85 backdrop-blur-xs p-3 rounded-2xl border border-pink-100/90 shadow-2xs text-center flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform">
            <div className="w-7 h-7 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF6B8B] mb-1.5 shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#FF6B8B]" />
            </div>
            <span className="text-[11px] font-black text-[#9D174D]">Khusus Afiz</span>
            <span className="text-[10px] text-[#8C5E68] font-medium leading-tight mt-0.5">
              Shift otomatis teratur
            </span>
          </div>

          <div className="bg-white/85 backdrop-blur-xs p-3 rounded-2xl border border-pink-100/90 shadow-2xs text-center flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform">
            <div className="w-7 h-7 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF6B8B] mb-1.5 shadow-2xs">
              <Stethoscope className="w-3.5 h-3.5 text-[#C2185B]" />
            </div>
            <span className="text-[11px] font-black text-[#9D174D]">Dokter Lengkap</span>
            <span className="text-[10px] text-[#8C5E68] font-medium leading-tight mt-0.5">
              Internis & bedah
            </span>
          </div>

          <div className="bg-white/85 backdrop-blur-xs p-3 rounded-2xl border border-pink-100/90 shadow-2xs text-center flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform">
            <div className="w-7 h-7 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF6B8B] mb-1.5 shadow-2xs">
              <Share2 className="w-3.5 h-3.5 text-[#C2185B]" />
            </div>
            <span className="text-[11px] font-black text-[#9D174D]">Bisa Share WA</span>
            <span className="text-[10px] text-[#8C5E68] font-medium leading-tight mt-0.5">
              Format rapi sekali klik
            </span>
          </div>

          <div className="bg-white/85 backdrop-blur-xs p-3 rounded-2xl border border-pink-100/90 shadow-2xs text-center flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform">
            <div className="w-7 h-7 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF6B8B] mb-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#52B788]" />
            </div>
            <span className="text-[11px] font-black text-[#9D174D]">100% Client-Side</span>
            <span className="text-[10px] text-[#8C5E68] font-medium leading-tight mt-0.5">
              Aman di browser kamu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuteEmptyState;
