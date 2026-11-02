# Strawberry Milk Edition (Afiz Shift Schedule) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the generic corporate clinic schedule web application into an intimate, pixel-perfect, kawaii "Strawberry Milk" personal shift schedule companion for Afiz, with custom SVG illustrations, strawberry date tabs, scalloped lace shift cards, a 50-love-notes catalog, dynamic 1–31 days Excel parser support, and zero AI slop.

**Architecture:** Client-side React 19 + TypeScript SPA styled with custom Tailwind CSS and bespoke vector SVG components. Data is parsed in-memory using SheetJS (`xlsx`) from clinic Excel workbooks (`internis dkk` sheet) and persisted in browser `localStorage`. Navigation uses a 4-tab bottom bar (Beranda, Kalender, Pesan Cinta, Jadwal Teman) with a floating strawberry milk upload action and slide-over menu drawer.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, SheetJS (`xlsx`).

**Spec:** `docs/superpowers/specs/2026-11-02-strawberry-afiz-schedule-design.md` and `prd_aplikasi_jadwal_shift_internis.md`

## Global Constraints
- 100% static client-side web application (zero external backend/database).
- All personal data stays in browser `localStorage`.
- Zero AI Slop: no boilerplate robotic texts, no generic cookie-cutter templates, no noisy trivial comments.
- Visual theme: Strawberry Milk palette (`#FFF5F7` cream, `#FCE4EC` gingham, `#FF6B8B` rose, `#D63447` deep strawberry red, `#FFE082` warm gold alert).
- Exact persona: Afiz (bunny nurse chibi avatar with nurse cap, bunny ears, strawberry in hand, and blushed cheeks).

## Review Focus
1. **Dynamic Dates Range (1–31 Days)**: Files with 8, 15, or 31 date columns must parse without index overflow or clipping in the horizontal strawberry date selector.
2. **Double/Multiple Shifts on Same Day**: If Afiz has more than one shift on a single date, all assignments must be rendered as stacked Princess Shift Cards without overwriting.
3. **Empty Storage First Run**: When `localStorage` is empty, app presents a warm welcoming empty state with an upload CTA and opens the Kawaii Upload Modal without crashing.
4. **Leave / Cuti Status Detection**: If Afiz appears in rows 101–103 ("cuti" or "LP"), the card must display the sweet restful leave badge instead of empty duty cards.
5. **Search & Filter in Team View**: Fuzzy match for doctors and peer nurses must handle whitespace, suffixes, and clinic abbreviations gracefully.

---

### Task 1: Design Tokens, Gingham Pattern, & Scalloped Lace Styling
**Files:**
- Modify: `src/index.css`
- Modify: `index.html` (title, font imports)

**Interfaces:**
- Consumes: Tailwind CSS v4 base setup
- Produces: CSS utility classes `.bg-gingham`, `.lace-card`, `.ribbon-bow`, `.strawberry-glow`, and warm pastel color variables.

- [ ] **Step 1: Define CSS custom classes and keyframe animations in `src/index.css`**
  Add background gingham SVG pattern, radial scalloped lace border helpers, pulse-glow for active strawberry date, and font styling for cute rounded aesthetic.
- [ ] **Step 2: Update `index.html`**
  Set page title to `Jadwal Shift Cantikku 🍓🍰`, favicon to strawberry SVG, and mobile viewport with theme color `#FFF0F3`.
- [ ] **Step 3: Verify build**
  Run: `npm run build`
  Expected: PASS with 0 build errors.
- [ ] **Step 4: Commit**
  ```bash
  git add src/index.css index.html
  git commit -m "style: add strawberry milk design tokens and gingham lace styles"
  ```

---

### Task 2: Bespoke Kawaii SVG Illustrations & Mascot Components
**Files:**
- Create: `src/components/illustrations/BunnyNurseAvatar.tsx`
- Create: `src/components/illustrations/StrawberryMilkBox.tsx`
- Create: `src/components/illustrations/KawaiiFileMascot.tsx`
- Create: `src/components/illustrations/CuteFloatingDecorations.tsx` (clouds & sparkles)
- Create: `src/components/illustrations/StrawberryPill.tsx`

**Interfaces:**
- Produces:
  - `BunnyNurseAvatar`: Vector illustration of Afiz as a cute nurse with bunny ears, nurse cap, blushing cheeks, and strawberry.
  - `StrawberryMilkBox`: 3D-styled strawberry milk carton with ribbon bow and optional `.xlsx` sheet tag.
  - `KawaiiFileMascot`: Smiling document icon with cute eyes and blush for the dropzone.
  - `CuteFloatingDecorations`: Fluffy clouds and twinkling stars.
  - `StrawberryPill`: Strawberry icon for date tabs (active and inactive states).

- [ ] **Step 1: Implement `BunnyNurseAvatar.tsx`**
  Crisp inline SVG with layered hair, bunny ears, nurse cap with cross, strawberry in hands, pink cheeks, and sparkles.
- [ ] **Step 2: Implement `StrawberryMilkBox.tsx`**
  Cute milk carton isometric/flat 3D SVG with straw, ribbon bow, "Strawberry Milk" label, and `.xlsx` tag.
- [ ] **Step 3: Implement `KawaiiFileMascot.tsx` & `CuteFloatingDecorations.tsx`**
  Mascot paper with smiling kawaii face and decorative floating clouds and stars.
- [ ] **Step 4: Implement `StrawberryPill.tsx`**
  Render strawberry fruit outline/fill with green sepals for date tabs.
- [ ] **Step 5: Verify build**
  Run: `npm run build`
  Expected: PASS
- [ ] **Step 6: Commit**
  ```bash
  git add src/components/illustrations/
  git commit -m "feat: add vector kawaii illustrations (bunny nurse, milk carton, mascots)"
  ```

---

### Task 3: 50 Sweet Daily Love Notes Catalog & Model Updates
**Files:**
- Create: `src/data/loveNotes.ts`
- Modify: `src/types/schedule.ts`

**Interfaces:**
- Produces:
  - `LOVE_NOTES: string[]`: Array of 50 affectionate, nurse-specific encouragement messages.
  - `getDailyLoveNote(dateStr?: string): { id: number; message: string; date: string }`
  - `getRandomLoveNote(): { id: number; message: string }`
  - Extended `schedule.ts` types with parsed helper fields for time notes and doctors list.

- [ ] **Step 1: Update `src/types/schedule.ts`**
  Add helper types `ActiveTab = 'home' | 'calendar' | 'notes' | 'team'`, `timeNote?: string`, and `doctors: string[]`.
- [ ] **Step 2: Create `src/data/loveNotes.ts`**
  Write 50 warm, caring, authentic Indonesian messages for Afiz (drink water, rest tired feet, virtual hugs, affirmations).
- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: PASS with 0 errors.
- [ ] **Step 4: Commit**
  ```bash
  git add src/types/schedule.ts src/data/loveNotes.ts
  git commit -m "feat: add 50 love notes catalog and updated schedule types"
  ```

---

### Task 4: Excel Parser Refinements (Dynamic 1–31 Dates & Task Extraction)
**Files:**
- Modify: `src/utils/excelParser.ts`

**Interfaces:**
- Consumes: SheetJS `XLSX.WorkBook`, Excel files (`NOVEMBER MG 1 2026.xlsx`, `OKTOBER AKHIR 2026.xlsx`)
- Produces: `parseExcelWorkbook(wb, fileName)` with clean doctor list extraction, time note extraction, and dynamic date scanning (1–31+ columns).

- [ ] **Step 1: Enhance task parser in `src/utils/excelParser.ts`**
  Parse tasks to extract `timeNote` (e.g. "masuk jam 12") and clean `doctors` array by separating long whitespace separated strings and removing generic duty notes.
- [ ] **Step 2: Validate date range scanning**
  Ensure scanning handles columns H onwards up to column 45+ to seamlessly support full-month files (1–31).
- [ ] **Step 3: Test parsing with both sample Excel files**
  Execute Node validation script on `NOVEMBER MG 1 2026.xlsx` and `OKTOBER AKHIR 2026.xlsx` to assert clean detection of Afiz assignments on both files.
- [ ] **Step 4: Commit**
  ```bash
  git add src/utils/excelParser.ts
  git commit -m "feat: refine parser for time notes, doctors extraction, and 1-31 dates"
  ```

---

### Task 5: Princess Shift Card Component (Renda, Ribbon & Doctor Badges)
**Files:**
- Create: `src/components/PrincessShiftCard.tsx`
- (Replaces legacy `ScheduleCard.tsx`)

**Interfaces:**
- Consumes: `assignment: SlotAssignment`, `dateLabel: string`, `isLeave?: boolean`, `leaveNote?: string`
- Produces: The kawaii shift card with scalloped frame, ribbon corners, `SHIFT 14.00 🍓`, highlight badge `⏰ Masuk jam 12 ya! ✨`, medical icons (🩺, 🦴, 💊), and bottom `📋 Evaluasi BPJS & Print Resume ✨`.

- [ ] **Step 1: Implement `PrincessShiftCard.tsx`**
  Style the card matching the reference mockup:
  - Header: Shift name with strawberry icon.
  - Highlight pill: Yellow/cream rounded chip for `timeNote` (e.g. `⏰ Masuk jam 12 ya! ✨`).
  - Doctor list: Cute rounded chips with stethoscope 🩺, bone 🦴, and pill 💊 icons.
  - Bottom banner: Task collective BPJS banner with sparkles.
  - Leave state: Cute sleeping cloud illustration with affectionate resting message.
- [ ] **Step 2: Verify component in build**
  Run: `npm run build`
  Expected: PASS
- [ ] **Step 3: Commit**
  ```bash
  git add src/components/PrincessShiftCard.tsx
  git commit -m "feat: implement PrincessShiftCard with scalloped lace and doctor badges"
  ```

---

### Task 6: Header, Strawberry Date Tabs, & Floating Upload Button
**Files:**
- Create: `src/components/CuteHeader.tsx`
- Create: `src/components/StrawberryDateTabs.tsx`
- (Replaces legacy `Header.tsx` and `DateTabs.tsx`)

**Interfaces:**
- Consumes:
  - `CuteHeader`: `onOpenUpload`, `onOpenMenu`
  - `StrawberryDateTabs`: `days: DailySchedule[]`, `selectedDate: string`, `onSelectDate: (iso: string) => void`
- Produces:
  - Header matching screenshot: Mini strawberry on left, hamburger ☰ on right, affectionate title *"Semangat Dinasnya Cantikku! 🍓🍰"*, Bunny Nurse avatar, *"Afiz 💖"* badge, and floating Strawberry Milk `.xlsx` button.
  - Date Tabs: Horizontal row of strawberry buttons with active red fruit and green leaves, smooth swipe, supporting 1–31 dates.

- [ ] **Step 1: Implement `CuteHeader.tsx`**
  Render top bar, title, avatar, name badge, and floating milk carton button with click trigger.
- [ ] **Step 2: Implement `StrawberryDateTabs.tsx`**
  Render strawberry-shaped date selector with horizontal scroll and week jump for periods > 7 days.
- [ ] **Step 3: Verify build**
  Run: `npm run build`
  Expected: PASS
- [ ] **Step 4: Commit**
  ```bash
  git add src/components/CuteHeader.tsx src/components/StrawberryDateTabs.tsx
  git commit -m "feat: implement CuteHeader and StrawberryDateTabs matching mockups"
  ```

---

### Task 7: Kawaii Upload Modal & Empty Welcome State
**Files:**
- Create: `src/components/KawaiiUploadModal.tsx`
- Create: `src/components/CuteEmptyState.tsx`
- (Replaces legacy `UploadModal.tsx` and `EmptyUploadState.tsx`)

**Interfaces:**
- Consumes: `isOpen`, `onClose`, `onDataLoaded: (data: ParsedScheduleData) => void`
- Produces:
  - Modal matching right mockup: Fluffy cloud topper with Strawberry Milk 3D illustration and ribbon bow, title `Upload Jadwal Excel .xlsx ☁️🍓🥛`, dashed dropzone with smiling yellow file mascot `📄😊`, ribbon button `Pilih File 📁`, and `Batal` pill button.
  - Welcoming empty state for first run prompting to upload Afiz's schedule.

- [ ] **Step 1: Implement `KawaiiUploadModal.tsx`**
  Modal with blur backdrop, cloud + milk illustration, file input handler with SheetJS parser integration, error handling, and ribbon buttons.
- [ ] **Step 2: Implement `CuteEmptyState.tsx`**
  First-run screen with gentle strawberry aesthetic inviting user to upload schedule.
- [ ] **Step 3: Verify build**
  Run: `npm run build`
  Expected: PASS
- [ ] **Step 4: Commit**
  ```bash
  git add src/components/KawaiiUploadModal.tsx src/components/CuteEmptyState.tsx
  git commit -m "feat: implement KawaiiUploadModal and CuteEmptyState"
  ```

---

### Task 8: Navigation Tabs: Kalender, Pesan Cinta, & Jadwal Teman
**Files:**
- Create: `src/components/CuteBottomNav.tsx`
- Create: `src/components/CalendarMonthView.tsx`
- Create: `src/components/LoveNotesView.tsx`
- Create: `src/components/TeamScheduleView.tsx`
- Create: `src/components/SideDrawerMenu.tsx`

**Interfaces:**
- Produces:
  - `CuteBottomNav`: 4 bottom items (🏠 Beranda, 📅 Kalender, 🔔 Pesan Cinta, 👥 Jadwal Teman).
  - `CalendarMonthView`: Calendar grid with shift dots & strawberry badges; tapping a date opens Beranda for that date.
  - `LoveNotesView`: Today's love note with cute card and "Ambil Pesan Cinta Acak 🍓" button.
  - `TeamScheduleView`: Doctor search and colleague schedule viewer.
  - `SideDrawerMenu`: Slide-in menu for file info, upload trigger, and clear data.

- [ ] **Step 1: Implement `CuteBottomNav.tsx` and `SideDrawerMenu.tsx`**
  Bottom bar with active indicator and slide-in drawer for auxiliary options.
- [ ] **Step 2: Implement `CalendarMonthView.tsx`**
  Monthly calendar grid showing Afiz's working days, shifts, and leave days.
- [ ] **Step 3: Implement `LoveNotesView.tsx`**
  Cute envelope / note card rendering the 50 love messages.
- [ ] **Step 4: Implement `TeamScheduleView.tsx`**
  Doctor and assistant search in strawberry theme.
- [ ] **Step 5: Verify build**
  Run: `npm run build`
  Expected: PASS
- [ ] **Step 6: Commit**
  ```bash
  git add src/components/CuteBottomNav.tsx src/components/CalendarMonthView.tsx src/components/LoveNotesView.tsx src/components/TeamScheduleView.tsx src/components/SideDrawerMenu.tsx
  git commit -m "feat: implement bottom navigation, calendar view, love notes, and team view"
  ```

---

### Task 9: Assemble Full App, State Persistence, & Integration
**Files:**
- Modify: `src/App.tsx`
- Clean up unused legacy components

**Interfaces:**
- Consumes: All components from Tasks 1–8
- Produces: Polished, reactive, mobile-first single page app.

- [ ] **Step 1: Refactor `src/App.tsx`**
  Assemble all views under active tab state (`home` | `calendar` | `notes` | `team`), manage `scheduleData` in `localStorage`, handle date navigation, modal states, and drawer.
- [ ] **Step 2: Clean up obsolete files**
  Safely remove or supersede deprecated corporate components (`AssistantSelector.tsx`, `DailyOverview.tsx`, `Header.tsx`, `PersonalScheduleView.tsx`, `ScheduleCard.tsx`, `ShareScheduleModal.tsx`, etc.).
- [ ] **Step 3: Run full TypeScript check and Vite build**
  Run: `npm run build`
  Expected: Build completes cleanly with 0 TypeScript or lint errors.
- [ ] **Step 4: Commit**
  ```bash
  git add src/App.tsx src/components/
  git commit -m "feat: assemble complete Strawberry Milk Afiz shift schedule application"
  ```

---

### Task 10: End-to-End Validation & Verification
**Files:**
- Test with both `NOVEMBER MG 1 2026.xlsx` and `OKTOBER AKHIR 2026.xlsx`

- [ ] **Step 1: Test Clean-Start & Upload Modal**
  Clear `localStorage`, verify empty state, open upload modal, upload `NOVEMBER MG 1 2026.xlsx`, verify instant parse.
- [ ] **Step 2: Verify Afiz Schedule on Nov 2, 2026**
  Check Shift 14.00, "⏰ Masuk jam 12 ya! ✨", doctors Tan Hengky, Rheza, Marsella, and BPJS banner.
- [ ] **Step 3: Test Multi-Week / 15-Days File (`OKTOBER AKHIR 2026.xlsx`)**
  Upload October file, verify all 15 dates load into strawberry date selector, verify smooth horizontal scrolling.
- [ ] **Step 4: Verify All 4 Bottom Tabs**
  Test navigation between Beranda, Kalender (date jump), Pesan Cinta (shuffle 50 notes), and Jadwal Teman (doctor search).
- [ ] **Step 5: Visual Check Against Screenshot**
  Verify bunny nurse avatar, lace card, gingham background, and kawaii upload modal match the user's reference mockup.
- [ ] **Step 6: Final Commit**
  ```bash
  git commit --allow-empty -m "chore: complete Strawberry Milk Edition revamp validation"
  ```

