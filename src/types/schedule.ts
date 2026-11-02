export type ActiveTab = 'home' | 'calendar' | 'notes' | 'team';

export interface SlotAssignment {
  slotId: number;            // 1 s/d 28
  rowRange: [number, number] | number[]; // [75, 79] (1-based Excel row)
  shiftLabel: string;        // "14.00", "Jam 7", "Jam 8", "j 9", "J.10"
  rawAssignees: string[];    // e.g. ["Afiz"]
  tasks: string[];           // Daftar baris tugas di kolom hari terkait
  timeNote?: string;         // Catatan jam masuk, e.g. "Masuk jam 12 ya!"
  doctors?: string[];        // Daftar dokter konsul/poli di slot ini, e.g. ["dr. Tan Hengky C+D", "dr. Rheza Sp.OT"]
}

export interface DailySchedule {
  dateISO: string;           // "2026-11-02"
  dateLabel: string;         // "Senin, 2 Nov 2026"
  dayName: string;           // "SENIN" | "SELASA" | "RABU" | "KAMIS" | "JUMAT" | "SABTU" | "MINGGU"
  assignments: SlotAssignment[];
  leaveNotes: string[];      // Dari Baris 101-103, contoh: ["Nurul U cuti"]
  dayNumber?: number;        // Tanggal angka, e.g. 2
  dayShort?: string;         // Singkatan hari, e.g. "Sen"
  isAfizLeave?: boolean;     // Apakah Afiz sedang libur / cuti
  afizLeaveNote?: string;    // Keterangan cuti/libur Afiz jika ada
  afizAssignments?: SlotAssignment[]; // Slot tugas khusus Afiz pada hari ini
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
