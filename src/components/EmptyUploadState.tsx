import React, { useState, useRef } from 'react';
import { 
  Building2, 
  UploadCloud, 
  FileSpreadsheet, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Smartphone, 
  CalendarRange, 
  Share2 
} from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { ParsedScheduleData } from '../types/schedule';

interface EmptyUploadStateProps {
  onDataLoaded: (data: ParsedScheduleData) => void;
}

export const EmptyUploadState: React.FC<EmptyUploadStateProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Hanya file Excel (.xlsx atau .xls) yang didukung.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsed = await parseExcelFile(file);
      setIsLoading(false);
      onDataLoaded(parsed);
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Gagal membaca file Excel. Pastikan format template sesuai.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4">
      {/* Brand Hero Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Jadwal Shift Klinik Internis & Bedah
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Unggah file Excel jadwal shift klinik Anda untuk melihat jadwal perawat, poliklinik dokter, dan berbagi format WhatsApp.
        </p>
      </div>

      {/* Main Upload Dropzone */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-teal-500 bg-teal-50/60 scale-[1.01]'
              : 'border-slate-300 hover:border-teal-500 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4 shadow-sm border border-teal-100">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-1">
            Pilih atau Seret File Excel (.xlsx) ke Sini
          </h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            Mendukung template jadwal klinik sheet <code className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-700 font-semibold">internis dkk</code>
          </p>

          <button
            type="button"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-md shadow-teal-600/20 transition-all inline-flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Pilih File Excel</span>
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-teal-50 rounded-xl text-xs font-semibold text-teal-700">
            <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
            <span>Sedang memproses dan memvalidasi file Excel...</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2.5 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Gagal Membaca File</p>
              <p className="text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 text-center">
          <ShieldCheck className="w-5 h-5 mx-auto text-teal-600 mb-1" />
          <h4 className="text-[11px] font-bold text-slate-800">100% Client-Side</h4>
          <p className="text-[10px] text-slate-500">Aman di browser Anda</p>
        </div>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 text-center">
          <CalendarRange className="w-5 h-5 mx-auto text-teal-600 mb-1" />
          <h4 className="text-[11px] font-bold text-slate-800">Tanggal Fleksibel</h4>
          <p className="text-[10px] text-slate-500">Harian, mingguan, bulanan</p>
        </div>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 text-center">
          <Smartphone className="w-5 h-5 mx-auto text-teal-600 mb-1" />
          <h4 className="text-[11px] font-bold text-slate-800">Mobile-First</h4>
          <p className="text-[10px] text-slate-500">Nyaman diakses via HP</p>
        </div>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 text-center">
          <Share2 className="w-5 h-5 mx-auto text-teal-600 mb-1" />
          <h4 className="text-[11px] font-bold text-slate-800">Bagikan ke WA</h4>
          <p className="text-[10px] text-slate-500">Format pesan instan</p>
        </div>
      </div>
    </div>
  );
};

