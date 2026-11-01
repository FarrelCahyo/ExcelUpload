export interface SlotAssignment {
  slotId: number;            // 1 s/d 28
  rowRange: [number, number] | number[]; // [75, 79] (1-based Excel row)
  shiftLabel: string;        // "14.00", "Jam 7", "Jam 8", "j 9", "J.10"
  rawAssignees: string[];    // e.g. ["Afiz"]
  tasks: string[];           // Daftar baris tugas di kolom hari terkait
}

export interface DailySchedule {
  dateISO: string;           // "2026-11-02"
  dateLabel: string;         // "Senin, 2 Nov 2026"
  dayName: string;           // "SENIN" | "SELASA" | "RABU" | "KAMIS" | "JUMAT" | "SABTU" | "MINGGU"
  assignments: SlotAssignment[];
  leaveNotes: string[];      // Dari Baris 101-103, contoh: ["Nurul U cuti"]
}

export interface ParsedScheduleData {
  fileName: string;
  sheetName: string;
  uploadedAt: string;
  periodLabel?: string;
  assistantList: string[];   // Daftar nama asisten unik
  days: DailySchedule[];     // Array jadwal per kolom tanggal
}

export type ViewMode = 'personal' | 'daily' | 'doctors';
