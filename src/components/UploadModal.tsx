import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileSpreadsheet, AlertCircle, RefreshCw, Check, Trash2 } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { ParsedScheduleData } from '../types/schedule';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (data: ParsedScheduleData) => void;
  onClearData?: () => void;
  hasExistingData?: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  onClearData,
  hasExistingData = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Hanya file Excel (.xlsx atau .xls) yang didukung.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const parsed = await parseExcelFile(file);
      setSuccessMsg(`Berhasil memuat "${file.name}" (${parsed.days.length} hari, ${parsed.assistantList.length} asisten).`);
      setTimeout(() => {
        onDataLoaded(parsed);
        setIsLoading(false);
        onClose();
      }, 500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Upload File Jadwal Excel</h2>
            <p className="text-xs text-slate-500">
              Format template sheet <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-700">internis dkk</code>
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-teal-500 bg-teal-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-3 shadow-2xs">
            <FileSpreadsheet className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-slate-800 mb-1">
            Klik untuk pilih file Excel atau seret file ke sini
          </p>
          <p className="text-xs text-slate-500 mb-3">
            Mendukung file .xlsx (rentang tanggal bebas: harian, mingguan, maupun bulanan)
          </p>

          <span className="inline-block px-3 py-1 rounded-md text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200">
            100% Diproses di Browser Lokal Anda
          </span>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-teal-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Sedang mem-parsing data Excel...</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Gagal Memproses Excel</p>
              <p className="text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Footer info & Clear button */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          {hasExistingData && onClearData ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Yakin ingin menghapus data jadwal yang tersimpan di browser?')) {
                  onClearData();
                  onClose();
                }
              }}
              className="text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Data Tersimpan</span>
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
