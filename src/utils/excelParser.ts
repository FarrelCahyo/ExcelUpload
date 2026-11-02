import * as XLSX from 'xlsx';
import { ParsedScheduleData, DailySchedule, SlotAssignment } from '../types/schedule';

export const SLOT_DEFINITIONS: Array<{ slotId: number; range: [number, number]; shift: string }> = [
  { slotId: 1, range: [4, 5], shift: 'Jam 7' },
  { slotId: 2, range: [6, 6], shift: 'Jam 7' },
  { slotId: 3, range: [7, 8], shift: 'Jam 7' },
  { slotId: 4, range: [9, 10], shift: 'Jam 8' },
  { slotId: 5, range: [11, 12], shift: 'Jam 8' },
  { slotId: 6, range: [13, 16], shift: 'Jam 8' },
  { slotId: 7, range: [17, 22], shift: 'j 9' },
  { slotId: 8, range: [23, 27], shift: 'j 9' },
  { slotId: 9, range: [28, 32], shift: 'j 9' },
  { slotId: 10, range: [33, 38], shift: 'j 9' },
  { slotId: 11, range: [39, 43], shift: 'J.10' },
  { slotId: 12, range: [44, 48], shift: 'J.10' },
  { slotId: 13, range: [49, 49], shift: 'J.10' },
  { slotId: 14, range: [50, 54], shift: '14.00' },
  { slotId: 15, range: [55, 58], shift: '14.00' },
  { slotId: 16, range: [59, 62], shift: '14.00' },
  { slotId: 17, range: [63, 67], shift: '14.00' },
  { slotId: 18, range: [68, 70], shift: '14.00' },
  { slotId: 19, range: [71, 74], shift: '14.00' },
  { slotId: 20, range: [75, 79], shift: '14.00' },
  { slotId: 21, range: [80, 83], shift: '14.00' },
  { slotId: 22, range: [84, 87], shift: '14.00' },
  { slotId: 23, range: [88, 91], shift: '14.00' },
  { slotId: 24, range: [92, 96], shift: '14.00' },
  { slotId: 25, range: [97, 97], shift: '14.00' },
  { slotId: 26, range: [98, 98], shift: '07.14' },
  { slotId: 27, range: [99, 99], shift: '14.21' },
  { slotId: 28, range: [100, 100], shift: 'Semua Shift' }
];

export function cleanAssistantName(rawName: string): string | null {
  let name = String(rawName).trim();
  if (!name || /^(mcu|cfd|semua asisten)$/i.test(name)) return null;

  name = name.replace(/\s+(cuti|lp|cfd|dl|bpjs\s*dl|dr\.[a-zA-Z]+|j\.\d+)$/i, '');
  name = name.replace(/\s+(cuti|lp)$/i, '');
  
  if (name.toLowerCase() === 'rin a') name = 'Rina A';
  if (name.toLowerCase() === 'ulfa') name = 'Dwi Ulfa';

  name = name.trim();
  return name.length > 1 ? name : null;
}

export function splitTasks(text: string | null | undefined): string[] {
  if (!text) return [];
  const rawParts = String(text)
    .split(/\r?\n/)
    .flatMap(line => line.split(/\s{3,}/))
    .map(p => p.trim())
    .filter(Boolean);

  const cleanParts: string[] = [];
  for (let i = 0; i < rawParts.length; i++) {
    const p = rawParts[i];
    // If text starts with (C+D) or other bracketed details, append to previous
    if (p.startsWith('(') && cleanParts.length > 0) {
      cleanParts[cleanParts.length - 1] += ' ' + p;
    } else {
      cleanParts.push(p);
    }
  }
  return cleanParts;
}

export function parseDateCell(val: unknown): Date | null {
  if (val === null || val === undefined || val === '') return null;

  if (typeof val === 'number') {
    // Excel serial dates: 30000 (1982) to 70000 (2091)
    if (val > 30000 && val < 70000) {
      return new Date(Math.round((val - 25569) * 86400 * 1000));
    }
    return null;
  }

  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }

  if (typeof val === 'string') {
    const s = val.trim();
    const parsed = Date.parse(s);
    if (!isNaN(parsed)) return new Date(parsed);

    // Format DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      let year = parseInt(dmyMatch[3], 10);
      if (year < 100) year += 2000;
      return new Date(Date.UTC(year, month, day));
    }
  }

  return null;
}

export function matchesAssistant(selectedNurse: string, cellText: string): boolean {
  if (!selectedNurse || !cellText) return false;
  const target = selectedNurse.toLowerCase().trim();
  const raw = cellText.toLowerCase().trim();

  if (raw === target) return true;

  // Specific aliases
  if (target === 'dwi ulfa' && /\bulfa\b/i.test(raw)) return true;
  if (target === 'rina a' && /rin(\s*a|a\s*a)/i.test(raw)) return true;
  if (target === 'suci p' && /\bsuci(\s*p)?\b/i.test(raw)) return true;

  // Word boundary matching to avoid partial substring collisions (e.g. "rina" matching "ina")
  const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordBoundaryRegex = new RegExp(`(^|[^a-zA-Z0-9])${escapedTarget}([^a-zA-Z0-9]|$)`, 'i');
  if (wordBoundaryRegex.test(raw)) return true;

  // Multi-word boundary matching
  const targetWords = target.split(/\s+/).filter(w => w.length > 1);
  if (targetWords.length > 1) {
    return targetWords.every(word => {
      const escWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(^|[^a-zA-Z0-9])${escWord}([^a-zA-Z0-9]|$)`, 'i').test(raw);
    });
  }

  return false;
}

export function extractTimeNote(tasks: string[]): string | undefined {
  const timeRegex = /(?:masuk|msk)\s*(?:jam|ajm|j\.)?\s*(\d{1,2})/i;
  for (const t of tasks) {
    const match = t.match(timeRegex);
    if (match) {
      const hour = parseInt(match[1], 10);
      return `Masuk jam ${hour} ya! ✨`;
    }
  }
  return undefined;
}

export function extractDoctors(tasks: string[]): string[] {
  const doctorRegex = /\b(?:drr?|dr|drg|prof)[\.,]|\bsp\./i;
  const dutyFilterRegex = /^(?:piket\s*bhp|5r1p|suhu\s*kulkas|ttv\s*emr|duta\s*cs|bpjs)\b/i;
  const doctors: string[] = [];

  for (const task of tasks) {
    if (!task) continue;
    const splitParts = task
      .split(/\r?\n/)
      .flatMap(line => line.split(/\s{2,}|\s*,\s*(?=(?:drr?|dr|drg|prof)[\.,]|\bsp\.)/i))
      .map(s => s.trim())
      .filter(Boolean);

    const rawParts: string[] = [];
    for (const p of splitParts) {
      if (p.startsWith('(') && rawParts.length > 0) {
        rawParts[rawParts.length - 1] += ' ' + p;
      } else {
        rawParts.push(p);
      }
    }

    for (let part of rawParts) {
      if (!part) continue;
      if (dutyFilterRegex.test(part)) continue;
      if (!doctorRegex.test(part)) continue;

      part = part.replace(/(?:masuk|msk)\s*(?:jam|j\.)?\s*\d+/gi, '').trim();
      part = part.replace(/\s*\/\s*5r1p\b/gi, '').trim();
      part = part.replace(/\b(?:5r1p|piket\s*bhp|piket\s*stock|suhu\s*kulkas|ttv\s*emr|duta\s*cs|bpjs|ttv\s*anamnesa|ceklist\s*suhu(?:\s*inter)?|rekap\s*edukasi)\b/gi, '').trim();
      part = part.replace(/^(?:siapkan|lanjutkan)\s+/gi, '').trim();
      part = part.replace(/^[,;/\-\s]+|[,;/\-\s]+$/g, '').trim();

      part = part.replace(/^(?:drr?|dr)[,\.]\s*/i, 'dr. ');
      part = part.replace(/^prof[\.,]\s*/i, 'Prof. ');
      part = part.replace(/^drg[\.,]\s*/i, 'drg. ');

      part = part.replace(/\b(?:drr?|dr)[,\.]\s*/gi, 'dr. ');
      part = part.replace(/\bprof[\.,]\s*/gi, 'Prof. ');
      part = part.replace(/\bdrg[\.,]\s*/gi, 'drg. ');

      part = part.replace(/\bsp\.([a-zA-Z]+)\b/gi, (_, spec) => `Sp.${spec.toUpperCase()}`);

      part = part.replace(/\s{2,}/g, ' ').trim();

      if (part.length > 3 && !doctors.includes(part)) {
        doctors.push(part);
      }
    }
  }

  return doctors;
}

export function parseExcelWorkbook(workbook: XLSX.WorkBook, fileName: string, targetSheetName?: string): ParsedScheduleData {
  let sheetName = targetSheetName;
  if (!sheetName) {
    sheetName = workbook.SheetNames.find(n => /internis/i.test(n)) || workbook.SheetNames[0];
  }

  const ws = workbook.Sheets[sheetName];
  if (!ws) {
    throw new Error(`Sheet "${sheetName}" tidak ditemukan di file Excel ini.`);
  }

  function getCell(r: number, c: number) {
    const addr = XLSX.utils.encode_cell({ r: r - 1, c });
    const cell = ws[addr];
    return cell && cell.v !== undefined ? cell.v : null;
  }

  const range = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']) : { s: { c: 0, r: 0 }, e: { c: 50, r: 160 } };

  // 1. Detect start column of dates (first column in row 3 that contains a valid date)
  let startCol = -1;
  for (let c = 1; c <= 15; c++) {
    if (parseDateCell(getCell(3, c))) {
      startCol = c;
      break;
    }
  }
  if (startCol === -1) startCol = 7; // Default to Column H (index 7)

  // 2. Map template day of week (Senin to Sabtu) dynamically
  const dayColumnMap: { [dayOfWeek: number]: number } = {
    1: 1, // Senin default B
    2: 2, // Selasa default C
    3: 3, // Rabu default D
    4: 4, // Kamis default E
    5: 5, // Jumat default F
    6: 6, // Sabtu default G
  };

  for (let c = 0; c < startCol; c++) {
    const val = String(getCell(3, c) || '').toUpperCase().trim();
    if (val.includes('SENIN')) dayColumnMap[1] = c;
    else if (val.includes('SELASA')) dayColumnMap[2] = c;
    else if (val.includes('RABU')) dayColumnMap[3] = c;
    else if (val.includes('KAMIS')) dayColumnMap[4] = c;
    else if (val.includes('JUMAT')) dayColumnMap[5] = c;
    else if (val.includes('SABTU')) dayColumnMap[6] = c;
  }

  // 3. Scan all date columns flexibly (supports 1 day up to 45+ days)
  const maxScanCol = Math.max(range.e.c + 5, 50);
  const detectedCols: Array<{ col: number; date: Date }> = [];
  let consecutiveEmpty = 0;

  for (let c = startCol; c <= maxScanCol; c++) {
    const val = getCell(3, c);
    const parsedDate = parseDateCell(val);
    if (parsedDate) {
      detectedCols.push({ col: c, date: parsedDate });
      consecutiveEmpty = 0;
    } else {
      consecutiveEmpty++;
      // Stop if 4 consecutive empty cells and past recorded sheet boundary
      if (consecutiveEmpty >= 4 && (c > range.e.c || detectedCols.length > 0)) {
        break;
      }
    }
  }

  // Fallback if no dates detected
  if (detectedCols.length === 0) {
    for (let c = 7; c <= 14; c++) {
      const val = getCell(3, c);
      const parsedDate = parseDateCell(val);
      if (parsedDate) detectedCols.push({ col: c, date: parsedDate });
    }
  }

  // Sort chronologically by date
  detectedCols.sort((a, b) => a.date.getTime() - b.date.getTime());

  const assistantsSet = new Set<string>();
  const days: DailySchedule[] = [];

  for (const { col: c, date } of detectedCols) {
    const dayOfWeek = date.getUTCDay(); // 0 = Minggu, 1 = Senin, ...
    const dayNames = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
    const dayName = dayNames[dayOfWeek] || 'SENIN';
    const dateISO = date.toISOString().split('T')[0];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dateLabel = `${dayName.charAt(0) + dayName.slice(1).toLowerCase()}, ${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;

    // Template column in B-G
    const templateCol = dayOfWeek >= 1 && dayOfWeek <= 6 ? (dayColumnMap[dayOfWeek] ?? dayOfWeek) : -1;

    // Read Leave Notes (Row 101 to 104)
    const leaveNotes: string[] = [];
    for (let r = 101; r <= 104; r++) {
      const lVal = getCell(r, c);
      if (lVal && String(lVal).trim()) {
        const cleanNote = String(lVal).trim();
        // Ignore generic headers like 'semua asisten' or 'MCU'
        if (!/^(semua asisten|mcu)$/i.test(cleanNote)) {
          leaveNotes.push(cleanNote);
          const cleanAss = cleanAssistantName(cleanNote);
          if (cleanAss) assistantsSet.add(cleanAss);
        }
      }
    }

    // Read slot assignments (1 to 28)
    const assignments: SlotAssignment[] = [];
    for (const slot of SLOT_DEFINITIONS) {
      const rawAssignees: string[] = [];
      for (let r = slot.range[0]; r <= slot.range[1]; r++) {
        const aVal = getCell(r, c);
        if (aVal && String(aVal).trim()) {
          const cleanVal = String(aVal).trim();
          if (!rawAssignees.includes(cleanVal)) {
            rawAssignees.push(cleanVal);
          }
          const cleanAss = cleanAssistantName(cleanVal);
          if (cleanAss) assistantsSet.add(cleanAss);
        }
      }

      const tasks: string[] = [];
      if (templateCol !== -1) {
        for (let r = slot.range[0]; r <= slot.range[1]; r++) {
          const tVal = getCell(r, templateCol);
          if (tVal) {
            tasks.push(...splitTasks(String(tVal)));
          }
        }
      } else {
        // For Sunday or special non-template days
        for (let r = slot.range[0]; r <= slot.range[1]; r++) {
          const aVal = getCell(r, c);
          if (aVal && String(aVal).trim()) {
            tasks.push(String(aVal).trim());
          }
        }
      }

      const timeNote = extractTimeNote(tasks);
      const doctors = extractDoctors(tasks);

      assignments.push({
        slotId: slot.slotId,
        rowRange: slot.range,
        shiftLabel: slot.shift,
        rawAssignees,
        tasks,
        ...(timeNote ? { timeNote } : {}),
        ...(doctors.length > 0 ? { doctors } : {})
      });
    }

    const shortDayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const dayShort = shortDayNames[dayOfWeek] || 'Sen';
    const dayNumber = date.getUTCDate();

    const matchingLeave = leaveNotes.find(note => matchesAssistant('Afiz', note));
    const isAfizLeave = Boolean(matchingLeave);
    const afizLeaveNote = matchingLeave;

    const afizAssignments = assignments.filter(
      a => a.slotId !== 28 && a.rawAssignees.some(assignee => matchesAssistant('Afiz', assignee))
    );

    days.push({
      dateISO,
      dateLabel,
      dayName,
      leaveNotes,
      dayNumber,
      dayShort,
      isAfizLeave,
      afizLeaveNote,
      afizAssignments,
      assignments
    });
  }

  // Determine period label
  let periodLabel = '';
  if (days.length > 0) {
    const first = days[0];
    const last = days[days.length - 1];
    periodLabel = `${first.dateLabel.split(', ')[1]} – ${last.dateLabel.split(', ')[1]} (${days.length} Hari)`;
  }

  return {
    fileName,
    sheetName,
    uploadedAt: new Date().toISOString(),
    periodLabel,
    assistantList: Array.from(assistantsSet).sort((a, b) => a.localeCompare(b, 'id')),
    days
  };
}

export function parseExcelFile(file: File): Promise<ParsedScheduleData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: false });
        const parsed = parseExcelWorkbook(workbook, file.name);
        resolve(parsed);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Gagal memproses file Excel. Pastikan format template sesuai.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file dari penyimpanan lokal.'));
    };

    reader.readAsArrayBuffer(file);
  });
}
