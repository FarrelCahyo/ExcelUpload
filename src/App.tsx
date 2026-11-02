import React, { useState, useMemo } from 'react';
import { ParsedScheduleData, ActiveTab } from './types/schedule';
import { CuteHeader } from './components/CuteHeader';
import { StrawberryDateTabs } from './components/StrawberryDateTabs';
import { PrincessShiftCard } from './components/PrincessShiftCard';
import { CalendarMonthView } from './components/CalendarMonthView';
import { LoveNotesView } from './components/LoveNotesView';
import { TeamScheduleView } from './components/TeamScheduleView';
import { CuteBottomNav } from './components/CuteBottomNav';
import { KawaiiUploadModal } from './components/KawaiiUploadModal';
import { CuteEmptyState } from './components/CuteEmptyState';
import { SideDrawerMenu } from './components/SideDrawerMenu';
import { ShareScheduleModal } from './components/ShareScheduleModal';
import { getDailyLoveNote } from './data/loveNotes';
import { Heart, Sparkles, ChevronRight } from 'lucide-react';
import { RibbonBow, TwinkleStar } from './components/illustrations';

const STORAGE_KEY_RAW = 'internis_schedule_raw';
const STORAGE_KEY_DATE = 'internis_selected_date';

export const App: React.FC = () => {
  // 1. Schedule Data state from localStorage (null if no file uploaded yet)
  const [scheduleData, setScheduleData] = useState<ParsedScheduleData | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RAW);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Gagal membaca jadwal dari localStorage:', e);
    }
    return null;
  });

  // 2. Selected Date with persistence
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DATE);
    if (saved && scheduleData && (saved === 'ALL' || scheduleData.days.some((d) => d.dateISO === saved))) {
      return saved;
    }
    if (scheduleData && scheduleData.days.length > 0) {
      const mon = scheduleData.days.find((d) => d.dayName === 'SENIN');
      return mon ? mon.dateISO : scheduleData.days[0].dateISO;
    }
    return '';
  });

  // 3. Active Navigation Tab ('home' | 'calendar' | 'notes' | 'team')
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // 4. Modals and Drawer state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Callback when a file is parsed and loaded
  const handleDataLoaded = (newData: ParsedScheduleData) => {
    setScheduleData(newData);
    localStorage.setItem(STORAGE_KEY_RAW, JSON.stringify(newData));

    // Default date preference: Senin (Monday) or first day
    const mon = newData.days.find((d) => d.dayName === 'SENIN');
    const defaultDate = mon ? mon.dateISO : newData.days[0]?.dateISO || '';
    setSelectedDate(defaultDate);
    localStorage.setItem(STORAGE_KEY_DATE, defaultDate);

    // Close upload modal if open
    setIsUploadOpen(false);
  };

  // Callback when user selects a date
  const handleSelectDate = (dateISO: string) => {
    setSelectedDate(dateISO);
    localStorage.setItem(STORAGE_KEY_DATE, dateISO);
  };

  // Callback to clear all stored schedule data
  const handleClearData = () => {
    localStorage.removeItem(STORAGE_KEY_RAW);
    localStorage.removeItem(STORAGE_KEY_DATE);
    localStorage.removeItem('internis_selected_nurse');
    setScheduleData(null);
    setSelectedDate('');
    setIsUploadOpen(false);
    setIsMenuOpen(false);
    setIsShareOpen(false);
    setActiveTab('home');
  };

  // Compute active day for Home view
  const activeDay = useMemo(() => {
    if (!scheduleData || scheduleData.days.length === 0) return null;
    return (
      scheduleData.days.find((d) => d.dateISO === selectedDate) ||
      scheduleData.days[0]
    );
  }, [scheduleData, selectedDate]);

  // Compute love note snippet for Home view
  const homeLoveNote = useMemo(() => {
    return getDailyLoveNote(selectedDate || activeDay?.dateISO);
  }, [selectedDate, activeDay]);

  // ========================================================
  // Case A: Clean-Start / Empty State (No schedule loaded)
  // ========================================================
  if (!scheduleData) {
    return (
      <div className="min-h-screen bg-gingham flex flex-col font-sans select-none">
        <main className="flex-1 flex items-center justify-center p-4">
          <CuteEmptyState
            onOpenUpload={() => setIsUploadOpen(true)}
            onDataLoaded={handleDataLoaded}
          />
        </main>

        <KawaiiUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onDataLoaded={handleDataLoaded}
          hasExistingData={false}
        />
      </div>
    );
  }

  // ========================================================
  // Case B: Schedule Loaded - Full Strawberry Milk Experience
  // ========================================================
  return (
    <div className="min-h-screen bg-gingham flex flex-col font-sans pb-28 text-pink-950">
      {/* 1. Common Top Header */}
      <CuteHeader
        fileName={scheduleData.fileName}
        periodLabel={scheduleData.periodLabel}
        assistantName="Afiz"
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* 2. Main Tab Views */}
      <main className="w-full max-w-md sm:max-w-xl mx-auto px-4 flex-1">
        {/* Tab 1: Beranda (Home - Jadwal Afiz) */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Strawberry Date Horizontal Tabs */}
            <StrawberryDateTabs
              days={scheduleData.days}
              selectedDate={selectedDate || activeDay?.dateISO || ''}
              onSelectDate={handleSelectDate}
            />

            {/* Princess Shift Card for Afiz */}
            {activeDay ? (
              <PrincessShiftCard
                assignments={activeDay.afizAssignments}
                isLeave={activeDay.isAfizLeave}
                leaveNote={activeDay.afizLeaveNote}
                dateLabel={activeDay.dateLabel}
                collectiveTask={activeDay.assignments.find((a) => a.slotId === 28)}
              />
            ) : (
              <div className="lace-card p-6 text-center text-sm font-semibold text-[#8C5E68]">
                Data jadwal tanggal terpilih tidak ditemukan 🌸
              </div>
            )}

            {/* Floating Sweet Love Note Snippet Capsule */}
            <div
              onClick={() => setActiveTab('notes')}
              className="lace-card p-4 sm:p-5 relative overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-pink-200/70 transition-all duration-200 active:scale-99 group"
              role="button"
              tabIndex={0}
              aria-label="Buka Pesan Cinta Lengkap"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveTab('notes');
                }
              }}
            >
              {/* Corner Ribbon accent */}
              <div className="absolute -top-2.5 -right-2.5 pointer-events-none drop-shadow-2xs rotate-12">
                <RibbonBow size={28} color="#FF6B8B" secondaryColor="#D63447" />
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0 text-pink-600 mt-0.5 group-hover:scale-110 transition-transform">
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C2185B]">
                      Pesan Cinta Hari Ini
                    </span>
                    <Sparkles className="w-3 h-3 text-pink-400" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#4A2E35] italic leading-relaxed line-clamp-2">
                    "{homeLoveNote.message}"
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-black text-pink-600 group-hover:text-pink-700">
                    <span>Buka Pesan Cinta Lengkap</span>
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Kalender (Monthly Grid View) */}
        {activeTab === 'calendar' && (
          <div className="animate-in fade-in duration-200">
            <CalendarMonthView
              days={scheduleData.days}
              selectedDate={selectedDate}
              onSelectDate={(iso) => {
                handleSelectDate(iso);
                setActiveTab('home');
              }}
              onNavigateHome={() => setActiveTab('home')}
            />
          </div>
        )}

        {/* Tab 3: Pesan Cinta (Love Notes Drawer / View) */}
        {activeTab === 'notes' && (
          <div className="animate-in fade-in duration-200">
            <LoveNotesView
              todayISO={selectedDate || activeDay?.dateISO || new Date().toISOString().split('T')[0]}
            />
          </div>
        )}

        {/* Tab 4: Jadwal Teman (Roster Rekan & Pencarian Dokter) */}
        {activeTab === 'team' && (
          <div className="animate-in fade-in duration-200">
            <TeamScheduleView
              days={scheduleData.days}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          </div>
        )}
      </main>

      {/* 3. Bottom Sticky Kawaii Navigation */}
      <CuteBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. Side Drawer Menu */}
      <SideDrawerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fileName={scheduleData.fileName}
        periodLabel={scheduleData.periodLabel}
        totalDays={scheduleData.days.length}
        onOpenUpload={() => {
          setIsMenuOpen(false);
          setIsUploadOpen(true);
        }}
        onClearData={handleClearData}
        onOpenShare={() => {
          setIsMenuOpen(false);
          setIsShareOpen(true);
        }}
      />

      {/* 5. Upload Modal */}
      <KawaiiUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleDataLoaded}
        currentFileName={scheduleData.fileName}
        onClearData={handleClearData}
        hasExistingData={true}
      />

      {/* 6. WhatsApp Share Modal */}
      <ShareScheduleModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        days={scheduleData.days}
        selectedAssistant="Afiz"
        selectedDate={selectedDate}
        periodLabel={scheduleData.periodLabel}
      />
    </div>
  );
};

export default App;
