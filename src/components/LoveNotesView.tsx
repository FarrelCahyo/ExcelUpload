import React, { useState, useMemo } from 'react';
import { getDailyLoveNote, getRandomLoveNote, LOVE_NOTES, LoveNote } from '../data/loveNotes';
import { RibbonBow, TwinkleStar, FluffyCloud } from './illustrations';
import { Sparkles, Heart, RefreshCw, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export interface LoveNotesViewProps {
  /** Current date ISO ('YYYY-MM-DD') for deterministic daily note */
  todayISO?: string;
  /** Additional CSS class names */
  className?: string;
}

export const LoveNotesView: React.FC<LoveNotesViewProps> = ({
  todayISO,
  className = '',
}) => {
  // 1. Initial daily deterministic note
  const dailyNote = useMemo(() => getDailyLoveNote(todayISO), [todayISO]);

  // 2. Currently displayed note state
  const [currentNote, setCurrentNote] = useState<LoveNote>(dailyNote);

  // 3. Animation / drawing state
  const [isDrawing, setIsDrawing] = useState(false);

  // 4. Track if user is on today's note or a randomized one
  const isTodayNote = currentNote.id === dailyNote.id;

  // 5. Expandable full catalog drawer
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');

  // 6. Favorites persisted in state
  const [likedNoteIds, setLikedNoteIds] = useState<number[]>([]);

  const isCurrentLiked = likedNoteIds.includes(currentNote.id);

  const toggleCurrentLike = () => {
    setLikedNoteIds((prev) =>
      prev.includes(currentNote.id)
        ? prev.filter((id) => id !== currentNote.id)
        : [...prev, currentNote.id]
    );
  };

  // Draw another sweet note
  const handleDrawRandom = () => {
    setIsDrawing(true);
    setTimeout(() => {
      const nextNote = getRandomLoveNote(currentNote.id);
      setCurrentNote(nextNote);
      setIsDrawing(false);
    }, 250);
  };

  // Reset to today's deterministic note
  const handleResetToToday = () => {
    setIsDrawing(true);
    setTimeout(() => {
      setCurrentNote(dailyNote);
      setIsDrawing(false);
    }, 200);
  };

  // Filter catalog if searching
  const filteredCatalog = useMemo(() => {
    if (!catalogSearch.trim()) {
      return LOVE_NOTES.map((msg, idx) => ({ id: idx + 1, message: msg }));
    }
    const q = catalogSearch.toLowerCase().trim();
    return LOVE_NOTES.map((msg, idx) => ({ id: idx + 1, message: msg })).filter(
      (n) => n.message.toLowerCase().includes(q) || String(n.id).includes(q)
    );
  }, [catalogSearch]);

  return (
    <div className={`w-full max-w-md sm:max-w-xl mx-auto space-y-5 select-none pb-24 ${className}`}>
      {/* 1. Page Header */}
      <div className="text-center relative pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/90 border border-pink-200/90 text-[#D63447] text-xs font-black shadow-2xs mb-2">
          <span>💌</span>
          <span>Pesan Harian Khusus Afiz</span>
          <span className="text-sm">🍓</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#C2185B] tracking-tight leading-tight font-display drop-shadow-2xs">
          Surat Cinta Untuk Cantikku 💌🍓
        </h1>

        <p className="text-xs sm:text-sm font-semibold text-[#8C5E68] max-w-sm mx-auto mt-1.5 leading-relaxed">
          Catatan kasih sayang dan pelukan hangat dari jauh, ditulis tulus untuk menemani setiap langkah dan lelahmu di klinik.
        </p>
      </div>

      {/* 2. Big Romantic Scalloped Love Card */}
      <div
        className={`lace-card p-6 sm:p-8 relative overflow-visible shadow-lg shadow-pink-200/70 transition-all duration-300 ${
          isDrawing ? 'scale-98 opacity-70 blur-[0.5px]' : 'scale-100 opacity-100'
        }`}
        role="region"
        aria-label="Kartu Pesan Cinta"
      >
        {/* Ribbon Bows on Corners */}
        <div className="absolute -top-3.5 -left-3.5 z-10 pointer-events-none drop-shadow-sm -rotate-12 transition-transform hover:scale-110">
          <RibbonBow size={38} color="#FF6B8B" secondaryColor="#D63447" />
        </div>
        <div className="absolute -bottom-3.5 -right-3.5 z-10 pointer-events-none drop-shadow-sm rotate-12 transition-transform hover:scale-110">
          <RibbonBow size={38} color="#FF6B8B" secondaryColor="#D63447" />
        </div>

        {/* Decorative corner stars */}
        <div className="absolute top-2.5 right-3.5 pointer-events-none">
          <TwinkleStar size={16} color="#FFD166" glow />
        </div>
        <div className="absolute bottom-2.5 left-3.5 pointer-events-none">
          <TwinkleStar size={14} color="#FFA4B4" />
        </div>

        {/* Card Header & Status Badges */}
        <div className="flex items-center justify-between gap-2 border-b border-pink-100 pb-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-base select-none">💌</span>
            <span className="text-xs font-black text-[#C2185B] uppercase tracking-wider">
              Untuk Afiz Kesayanganku
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isTodayNote ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-100 text-[#D63447] text-[10px] font-black border border-pink-200 shadow-2xs">
                <span>📅</span>
                <span>Pesan Hari Ini</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-[#C2185B] text-[10px] font-black border border-rose-200 shadow-2xs">
                <span>✨</span>
                <span>Pesan Kejutan</span>
              </span>
            )}

            {/* Like / Heart Button */}
            <button
              type="button"
              onClick={toggleCurrentLike}
              aria-label={isCurrentLiked ? 'Hapus dari favorit' : 'Simpan ke favorit'}
              title={isCurrentLiked ? 'Disukai ❤️' : 'Suka pesan ini'}
              className={`p-1 rounded-full transition-all cursor-pointer ${
                isCurrentLiked
                  ? 'text-rose-500 bg-rose-50 hover:scale-110'
                  : 'text-pink-300 hover:text-rose-400 hover:bg-pink-50'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isCurrentLiked ? 'fill-rose-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Cute Mascot Centerpiece */}
        <div className="flex justify-center mb-3">
          <div className="relative inline-block animate-float">
            <FluffyCloud size={76} variant="pink" withFace={true} withSparkles={true} />
          </div>
        </div>

        {/* Note Body Text */}
        <div className="my-3 sm:my-5 px-1 sm:px-3 text-center">
          <span className="text-2xl text-pink-300 font-serif leading-none block -mb-1 select-none">
            “
          </span>
          <p
            className="text-base sm:text-lg font-bold leading-relaxed tracking-tight px-1"
            style={{ color: '#4A2E35' }}
          >
            {currentNote.message}
          </p>
          <span className="text-2xl text-pink-300 font-serif leading-none block -mt-1 select-none">
            ”
          </span>
        </div>

        {/* Catalog Counter Badge */}
        <div className="text-center mt-3 pt-3 border-t border-pink-100">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-[11px] font-black text-[#9B5160] border border-pink-200/70">
            <span>🍓</span>
            <span>Pesan #{currentNote.id} dari 50 Pesan Cinta</span>
          </span>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex flex-col items-center gap-2.5 px-2">
        {/* Draw Random Love Note Button */}
        <button
          type="button"
          onClick={handleDrawRandom}
          disabled={isDrawing}
          aria-label="Buka Pesan Manis Lainnya"
          className="w-full sm:w-auto min-w-[280px] px-6 py-3.5 rounded-full bg-gradient-to-r from-[#FF6B8B] to-[#D63447] hover:from-[#FF4D6D] hover:to-[#C2185B] text-white text-sm sm:text-base font-black shadow-md shadow-pink-300/60 hover:shadow-lg hover:shadow-pink-400/70 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-2 border-white/80 group"
        >
          <Sparkles className="w-5 h-5 text-amber-200 animate-spin group-hover:rotate-180 transition-transform duration-500" />
          <span>Buka Pesan Manis Lainnya 🍓✨</span>
        </button>

        {/* Return to Today's Note Button (if looking at a randomized note) */}
        {!isTodayNote && (
          <button
            type="button"
            onClick={handleResetToToday}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 hover:bg-pink-50 text-[#8C5E68] hover:text-[#D63447] text-xs font-bold border border-pink-200/90 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FF6B8B]" />
            <span>Kembali ke Pesan Hari Ini 📅</span>
          </button>
        )}
      </div>

      {/* 4. Sweet Affirmation Pill */}
      <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-200/80 text-center shadow-2xs">
        <p className="text-xs font-black text-[#C2185B] flex items-center justify-center gap-1.5">
          <span>💖</span>
          <span>Afiz hebat, Afiz tangguh, dan Afiz selalu jadi kesayangan aku!</span>
          <span>🌸</span>
        </p>
      </div>

      {/* 5. Expandable Full 50 Love Notes Catalog Browser */}
      <div className="bg-white/90 backdrop-blur-xs rounded-3xl border border-pink-200/90 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowCatalog(!showCatalog)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-pink-50/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#FF6B8B]" />
            <span className="text-xs sm:text-sm font-black text-[#4A2E35]">
              Koleksi Lengkap 50 Pesan Kasih Sayang
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#FF6B8B]">
            <span>{showCatalog ? 'Tutup' : 'Lihat Semua'}</span>
            {showCatalog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showCatalog && (
          <div className="p-4 pt-1 border-t border-pink-100 space-y-3">
            {/* Search within catalog */}
            <input
              type="text"
              placeholder="Cari pesan (misal: minum air, istirahat, bangga)..."
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-pink-50/60 rounded-xl border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-pink-400 font-medium placeholder:text-[#9B5160]/50"
            />

            {/* List of notes */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {filteredCatalog.map((note) => {
                const isSelected = currentNote.id === note.id;
                const isLiked = likedNoteIds.includes(note.id);

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setCurrentNote(note);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 shadow-2xs ring-1 ring-rose-300'
                        : 'bg-white hover:bg-pink-50/60 border-pink-100/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-[#FF6B8B]">
                        Pesan #{note.id}
                      </span>
                      {isLiked && <span className="text-xs">❤️</span>}
                    </div>
                    <p className="font-semibold text-[#4A2E35] leading-relaxed">
                      {note.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoveNotesView;
