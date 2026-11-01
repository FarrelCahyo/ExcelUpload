import React, { useState } from 'react';
import { ParsedScheduleData, ViewMode } from './types/schedule';
import { Header } from './components/Header';
import { AssistantSelector } from './components/AssistantSelector';
import { DateTabs } from './components/DateTabs';
import { PersonalScheduleView } from './components/PersonalScheduleView';
import { DailyOverview } from './components/DailyOverview';
import { DoctorSearch } from './components/DoctorSearch';
import { UploadModal } from './components/UploadModal';
import { ShareScheduleModal } from './components/ShareScheduleModal';
import { EmptyUploadState } from './components/EmptyUploadState';

const STORAGE_KEY_RAW = 'internis_schedule_raw';
const STORAGE_KEY_NURSE = 'internis_selected_nurse';
const STORAGE_KEY_DATE = 'internis_selected_date';

export const App: React.FC = () => {
  // 1. Schedule Data state from localStorage (null if user hasn't uploaded yet)
  const [scheduleData, setScheduleData] = useState<ParsedScheduleData | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RAW);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved schedule from localStorage', e);
    }
    return null;
  });

  // 2. Selected Assistant with persistence
  const [selectedAssistant, setSelectedAssistant] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NURSE);
    if (saved && scheduleData && scheduleData.assistantList.includes(saved)) {
      return saved;
    }
    if (scheduleData && scheduleData.assistantList.length > 0) {
      if (scheduleData.assistantList.includes('Afiz')) return 'Afiz';
      return scheduleData.assistantList[0];
    }
    return '';
  });

  // 3. Selected Date with persistence
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

  // 4. View Mode state
  const [viewMode, setViewMode] = useState<ViewMode>('personal');

  // 5. Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Save to localStorage whenever scheduleData changes
  const handleDataLoaded = (newData: ParsedScheduleData) => {
    setScheduleData(newData);
    localStorage.setItem(STORAGE_KEY_RAW, JSON.stringify(newData));

    // Choose default assistant
    const defaultAssistant = newData.assistantList.includes('Afiz')
      ? 'Afiz'
      : newData.assistantList[0] || '';
    setSelectedAssistant(defaultAssistant);
    localStorage.setItem(STORAGE_KEY_NURSE, defaultAssistant);

    // Choose default date (prefer Monday or first date)
    const mon = newData.days.find((d) => d.dayName === 'SENIN');
    const defaultDate = mon ? mon.dateISO : newData.days[0]?.dateISO || 'ALL';
    setSelectedDate(defaultDate);
    localStorage.setItem(STORAGE_KEY_DATE, defaultDate);
  };

  const handleSelectAssistant = (name: string) => {
    setSelectedAssistant(name);
    localStorage.setItem(STORAGE_KEY_NURSE, name);
  };

  const handleSelectDate = (dateISO: string) => {
    setSelectedDate(dateISO);
    localStorage.setItem(STORAGE_KEY_DATE, dateISO);
  };

  const handleClearData = () => {
    localStorage.removeItem(STORAGE_KEY_RAW);
    localStorage.removeItem(STORAGE_KEY_NURSE);
    localStorage.removeItem(STORAGE_KEY_DATE);
    setScheduleData(null);
    setSelectedAssistant('');
    setSelectedDate('');
  };

  // If no file has been uploaded yet, show clean Empty / Onboarding Upload Screen
  if (!scheduleData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="border-b border-slate-200 bg-white py-3 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm">
              Klinik Internis & Bedah
            </span>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
              Manual Upload Mode
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <EmptyUploadState onDataLoaded={handleDataLoaded} />
        </main>

        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
          Aplikasi Jadwal Shift Klinik Internis & Bedah • 100% Client-Side Processing • Tanpa Database
        </footer>
      </div>
    );
  }

  // Current day for daily view
  const currentDayForDaily = scheduleData.days.find((d) => d.dateISO === selectedDate) || scheduleData.days[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16">
      {/* Top Header */}
      <Header
        fileName={scheduleData.fileName}
        periodLabel={scheduleData.periodLabel}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 flex-1">
        {/* Mode 1: Jadwal Saya */}
        {viewMode === 'personal' && (
          <div>
            {/* Assistant Selector */}
            <AssistantSelector
              assistants={scheduleData.assistantList}
              selectedAssistant={selectedAssistant}
              onSelectAssistant={handleSelectAssistant}
            />

            {/* Date Tabs */}
            <DateTabs
              days={scheduleData.days}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              showAllOption={true}
            />

            {/* Personal Schedule View Cards */}
            <PersonalScheduleView
              days={scheduleData.days}
              selectedAssistant={selectedAssistant}
              selectedDate={selectedDate}
            />
          </div>
        )}

        {/* Mode 2: Semua Jadwal Harian */}
        {viewMode === 'daily' && (
          <div>
            {/* Date Tabs (Single day only) */}
            <DateTabs
              days={scheduleData.days}
              selectedDate={selectedDate === 'ALL' ? (scheduleData.days[0]?.dateISO || '') : selectedDate}
              onSelectDate={handleSelectDate}
              showAllOption={false}
            />

            {currentDayForDaily ? (
              <DailyOverview day={currentDayForDaily} />
            ) : (
              <p className="text-center text-slate-400 py-10">Data hari tidak ditemukan.</p>
            )}
          </div>
        )}

        {/* Mode 3: Cari Dokter & Asisten */}
        {viewMode === 'doctors' && (
          <DoctorSearch days={scheduleData.days} />
        )}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleDataLoaded}
        onClearData={handleClearData}
        hasExistingData={true}
      />

      <ShareScheduleModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        days={scheduleData.days}
        selectedAssistant={selectedAssistant}
        selectedDate={selectedDate}
        periodLabel={scheduleData.periodLabel}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-400">
        <p>
          Aplikasi Jadwal Shift Klinik Internis & Bedah • 100% Client-Side Processing • Vercel Static Ready
        </p>
      </footer>
    </div>
  );
};

export default App;
