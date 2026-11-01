# Product Requirements Document (PRD): Aplikasi Web Jadwal Shift Klinik Internis & Bedah

## 1. Ringkasan Produk & Tujuan

Aplikasi web statis (*client-side web application*) yang dirancang untuk membaca dan menampilkan jadwal kerja mingguan perawat/asisten dari file Excel **`NOVEMBER MG 1 2026.xlsx`** (khususnya sheet **`internis dkk`**).

Setiap pengguna (perawat/asisten) mengunggah sendiri file Excel jadwal mingguan di perangkat masing-masing. Aplikasi mem-parsing file Excel langsung di browser, menyimpan hasilnya di penyimpanan lokal browser (`localStorage`), dan menyajikannya dalam antarmuka kartu (*mobile-first*) yang mudah dibaca tanpa memerlukan *database* eksternal, *backend server*, maupun sistem *login*.

| Atribut Proyek | Spesifikasi |
| :--- | :--- |
| **Nama Aplikasi** | Jadwal Shift Klinik Internis & Bedah |
| **Target Deployment** | Vercel (100% Static / Client-Side Rendering) |
| **Penyimpanan Data** | Browser `localStorage` (tanpa database eksternal) |
| **Autentikasi / User Role** | Tidak ada (setiap user mengunggah file `.xlsx` di perangkat masing-masing) |
| **Sumber Data Utama** | File Excel `.xlsx` dengan struktur template sheet `internis dkk` |
| **Fokus Perangkat** | Mobile-First (nyaman diakses melalui layar smartphone maupun desktop) |

---

## 2. Arsitektur Teknis & Stack Rekomendasi (Untuk Antigravity)

* **Framework**: Next.js (App Router, Client Components / Static Export) atau React + Vite + TypeScript.
* **Styling & UI**: Tailwind CSS + Lucide Icons (desain bersih, kontras tinggi, responsif untuk layar HP).
* **Excel Parser**: Library `xlsx` (SheetJS) yang berjalan sepenuhnya di sisi klien (*browser*) menggunakan `FileReader` / `ArrayBuffer`.
* **State & Persistence**: React State + `localStorage` untuk menyimpan:
  1. `internis_schedule_raw`: Data hasil parsing jadwal mingguan dalam format JSON.
  2. `internis_selected_nurse`: Nama asisten yang terakhir dipilih user (agar saat halaman dibuka kembali, jadwal asisten tersebut langsung tampil otomatis).
  3. `internis_selected_date`: Tanggal aktif yang terakhir dilihat.

---

## 3. Spesifikasi Struktur Excel Sumber (Sheet `internis dkk`)

File Excel memiliki struktur matriks gabungan antara **Template Tugas Harian (Kolom B–G)** dan **Penugasan Nama Asisten per Tanggal (Kolom H–O)**.

### 3.1 Struktur Kolom (1-Based Indexing / Koordinat Excel)

| Kolom Excel | Indeks (0-Based) | Nama Header (Baris 3) | Fungsi & Isi Data |
| :--- | :--- | :--- | :--- |
| **Kolom A** | `0` | `JAM` | Kategori besar jam shift (`Jam 7`, `Jam 8`, `j 9`, `J.10`, `14.00`, `07.14`, `14.21`). Menggunakan *merged cells* vertikal. |
| **Kolom B** | `1` | `SENIN` | Daftar poliklinik dokter & rincian tugas untuk hari **Senin**. |
| **Kolom C** | `2` | `SELASA` | Daftar poliklinik dokter & rincian tugas untuk hari **Selasa**. |
| **Kolom D** | `3` | `RABU` | Daftar poliklinik dokter & rincian tugas untuk hari **Rabu**. |
| **Kolom E** | `4` | `KAMIS` | Daftar poliklinik dokter & rincian tugas untuk hari **Kamis**. |
| **Kolom F** | `5` | `JUMAT` | Daftar poliklinik dokter & rincian tugas untuk hari **Jumat**. |
| **Kolom G** | `6` | `Sabtu` | Daftar poliklinik dokter & rincian tugas untuk hari **Sabtu**. |
| **Kolom H–O** | `7` s/d `14` | Tanggal (`2026-11-01` s/d `2026-11-08`) | Nama asisten yang bertugas pada tanggal tersebut. Di Excel tersimpan sebagai *Excel Serial Date Number* (contoh: `46327` = 1 Nov 2026, `46328` = 2 Nov 2026, dst.) atau objek tanggal. |

### 3.2 Aturan Pemetaan Tanggal ke Kolom Hari

Untuk setiap kolom tanggal pada **Kolom H s/d O** (indeks kolom `7` s/d `14`):
1. Baca nilai sel pada **Baris 3** (`H3:O3`). Jika berupa angka *Excel Serial Date* (misal `46328`), konversikan ke tanggal JS: `new Date(Math.round((serial - 25569) * 86400 * 1000))`.
2. Tentukan hari dalam seminggu (`dayOfWeek = date.getUTCDay()`):
   * `1` (Senin) → Ambil rincian tugas dari **Kolom B** (indeks `1`)
   * `2` (Selasa) → Ambil rincian tugas dari **Kolom C** (indeks `2`)
   * `3` (Rabu) → Ambil rincian tugas dari **Kolom D** (indeks `3`)
   * `4` (Kamis) → Ambil rincian tugas dari **Kolom E** (indeks `4`)
   * `5` (Jumat) → Ambil rincian tugas dari **Kolom F** (indeks `5`)
   * `6` (Sabtu) → Ambil rincian tugas dari **Kolom G** (indeks `6`)
   * `0` (Minggu) → Hari Minggu tidak memiliki kolom template di B–G. Jika pada kolom Minggu terdapat teks (misal `Ovylia` dan `CFD` di baris 4–5 atau `Dwi Ulfa CFD` di baris 56), tampilkan langsung teks sel tersebut sebagai jadwal khusus hari Minggu/CFD.

### 3.3 Pemetaan 28 Blok Slot Penugasan (`Baris 4` s/d `Baris 100`)

Satu penugasan asisten terdiri dari **beberapa baris vertikal (1 blok/kotak)** yang dibatasi garis *border* atas dan bawah. Nama asisten biasanya ditulis di salah satu baris tengah di dalam blok tersebut (misalnya pada **Slot #20**, blok tugas membentang dari **Baris 75 s/d Baris 79**, sedangkan nama **Afiz** tertulis di **Baris 77–78**).

Karena template jadwal bersifat tetap, parser wajib menggunakan **Tabel Definisi Blok Baris** berikut:

| ID Slot | Rentang Baris Excel (1-Based) | Indeks Baris Array (0-Based) | Kategori Shift (Kolom A) | Contoh Asisten (Senin, 2 Nov 2026) | Contoh Isi Tugas Hari Senin (Kolom B) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Slot 01** | Baris 4 – 5 | `3` – `4` | `Jam 7` | `MCU`, `Ovylia dr.Agnes` | KOORDINATOR FAMILY CARE PAGI/SIANG, MCU/DHL, TTV internis |
| **Slot 02** | Baris 6 – 6 | `5` – `5` | `Jam 7` | `Desi` | dr.Yeffry (C+D), Prof. Soeharyo, ceklist suhu inter, rekap edukasi |
| **Slot 03** | Baris 7 – 8 | `6` – `7` | `Jam 7` | *(Kosong di Senin; Selasa: `Endang`)* | dr. Indra(C+D) • 5R1P TTV EMR gizi |
| **Slot 04** | Baris 9 – 10 | `8` – `9` | `Jam 8` | `Suci P` | dr. Dicky(C+D) • piket BHP bedah |
| **Slot 05** | Baris 11 – 12 | `10` – `11` | `Jam 8` | `Adung` | dr. Vincent • 5R1P bedah inter |
| **Slot 06** | Baris 13 – 16 | `12` – `15` | `Jam 8` | `Mirada` | dr.Antonius D+C • dr.Kurniawan • dr.Ardian C+D |
| **Slot 07** | Baris 17 – 22 | `16` – `21` | `j 9` | `Naela` | TTV anamnesa bedah, Onloop, 5R1P • dr.Ardian • dr.Theodorus • DUTA CS, PIKET STOCK, k.anesthesi • masuk jam 7 |
| **Slot 08** | Baris 23 – 27 | `22` – `26` | `j 9` | `Endang` | siapkan dr.Hirlan • TTV EMR internis BEDAH • dr.Dadang Sp.OT 9-17 • piket stock bedah • msk j.9 |
| **Slot 09** | Baris 28 – 32 | `27` – `31` | `j 9` | `Supaati` | Prof.Darmono • dr.Meilina • dr.Firsza • Keliling ceklist suhu |
| **Slot 10** | Baris 33 – 38 | `32` – `37` | `j 9` | `Maria` | dr.Witjitra D, dr.M.Kamil, dr.Neni, dr.Carolin Stela, TTV cek R.Laktasi C1, msk jam 8 |
| **Slot 11** | Baris 39 – 43 | `38` – `42` | `J.10` | `Jihan N` | msk j.8 • dr.Andy • dr.KunSemedi • TTV EMR bedah • dr.Novalia Sp.KJ |
| **Slot 12** | Baris 44 – 48 | `43` – `47` | `J.10` | `Dian SL` | dr. Donie (C+D) • dr.Ardian C • siapkan dr.Hirlan D • suhu kulkas bedah&pool • masuk jam 9 |
| **Slot 13** | Baris 49 – 49 | `48` – `48` | `J.10` | *(Kosong di Senin; Selasa: `Lita`)* | dr.Bambang Singgih, dr.Agnes, piket 5R1P |
| **Slot 14** | Baris 50 – 54 | `49` – `53` | `14.00` | `Mega` | dr.Witjitra • dr.Meilina • dr.Suhardiyono • Prof. Darmono sore • masuk j.11 |
| **Slot 15** | Baris 55 – 58 | `54` – `57` | `14.00` | `Dwi Ulfa` | dr. Agus P(C+D) • dr.Suyanto • masuk j.14 • TTV EMR internis BEDAH |
| **Slot 16** | Baris 59 – 62 | `58` – `61` | `14.00` | `Dewi S` | dr.Teguh Dahlia • dr.Indra • dr.Antonius • masuk jam 13 |
| **Slot 17** | Baris 63 – 67 | `62` – `66` | `14.00` | `Suci P` | Prof.Zainal • Msk jam 13.00 • TTV bedah • 5R1P bedah inter |
| **Slot 18** | Baris 68 – 70 | `67` – `69` | `14.00` | `Dian SL` | SECA, uroflo • dr.Hirlan • dr. B.Singgih |
| **Slot 19** | Baris 71 – 74 | `70` – `73` | `14.00` | `Adelina` | FAMILY CARE/ TTV EMR • Onoop /piket BHP bedah • trouble • drr.Niken Sp.KK |
| **Slot 20** | **Baris 75 – 79** | **`74` – `78`** | **`14.00`** | **`Afiz`** | **masuk jam 12 • dr.Tan Hengky C+D • dr.Rheza Sp.OT • dr.Marsella** |
| **Slot 21** | Baris 80 – 83 | `79` – `82` | `14.00` | `Adung` | dr.Linda • dr.Vincent • piket BHP bedah • suhu kulkas bedah&pool |
| **Slot 22** | Baris 84 – 87 | `83` – `86` | `14.00` | `Nabila` | masuk jam 14 • BPJS • dr.Diana • PIKET 5r1p |
| **Slot 23** | Baris 88 – 91 | `87` – `90` | `14.00` | `Ina` | dr.Hirlan • dr.Dwi Lestari • TTV EMR / DUTA cs • msk jam 11 |
| **Slot 24** | Baris 92 – 96 | `91` – `95` | `14.00` | `Lita` | masuk jam 15 • Duta CS/5R1P • dr.Rifqi Sp.BP • dr.Tania D • TTV EMR internis BEDAH |
| **Slot 25** | Baris 97 – 97 | `96` – `96` | `14.00` | *(Khusus Selasa: `Aisah`)* | *(Senin kosong; Selasa: TTV internis, dr.Rakhma, dr.Suyanto, rekap edukasi)* |
| **Slot 26** | Baris 98 – 98 | `97` – `97` | `07.14` | `Rina A` | PIC BPJS cluster & STOCK, TTV anamnesa DAHLIA |
| **Slot 27** | Baris 99 – 99 | `98` – `98` | `14.21` | `Latifah` | PIC BPJS cluster & STOCK, TTV anamnesa DAHLIA |
| **Slot 28** | Baris 100 – 100 | `99` – `99` | `Semua Shift` | `semua asisten` | EVALUASI BPJS dan Print resume, PIKET 5R1P |

### 3.4 Baris Cuti / Libur Pengganti (`Baris 101` s/d `Baris 103`)

Pada **Baris 101–103** (indeks 0-based: `100`–`102`) di kolom tanggal (`H` s/d `O`), terdapat informasi asisten yang sedang **Cuti** atau **LP (Libur Pengganti)**:
* Contoh pada **2 Nov 2026 (Kolom I, Baris 101)**: `Nurul U cuti`
* Contoh pada **4 Nov 2026 (Kolom K, Baris 101)**: `Novisa LP`
* Contoh pada **7 Nov 2026 (Kolom N, Baris 101–103)**: `Adung cuti`, `Rin A LP`, `Firda LP`

Sistem wajib mem-parsing baris 101–103 ini per tanggal untuk ditampilkan sebagai informasi status libur/cuti.

### 3.5 Penanganan Kasus Khusus pada Data Nama & Tugas

1. **Rincian Jam Masuk di Dalam Sel Tugas**: Teks seperti `masuk jam 12`, `msk j.8`, `masuk jam 13`, atau `msk j.11` tetap dimasukkan apa adanya sebagai bagian dari *list* detail rincian tugas di dalam kartu shift tersebut (tidak perlu mengubah label kategori utama `Shift 14.00`, cukup ditampilkan di dalam rincian isi kartu).
2. **Satu Asisten Memiliki 2 Slot di Hari yang Sama (*Double Slot*)**:
   * Contoh pada Senin, 2 Nov 2026: **Suci P** bertugas di **Slot 04 (`Jam 8`)** sekaligus **Slot 17 (`14.00`)**; **Adung** bertugas di **Slot 05 (`Jam 8`)** dan **Slot 21 (`14.00`)**; **Dian SL** bertugas di **Slot 12 (`J.10`)** dan **Slot 18 (`14.00`)**.
   * Sistem **tidak boleh menimpa (*overwrite*)** jadwal pertama dengan jadwal kedua, melainkan menyimpannya sebagai *array* penugasan sehingga keduanya tampil sebagai 2 kartu tugas pada tanggal tersebut.
3. **Dua Baris Nama di Dalam Satu Blok yang Sama**:
   * Contoh pada **Slot 01 (Baris 4–5)**: Baris 4 berisi `MCU` dan Baris 5 berisi `Ovylia dr.Agnes`.
   * Contoh pada **Slot 22 (Baris 84–87, Sabtu 7 Nov)**: Baris 85 berisi `Ina` dan Baris 86 berisi `Indri dl`.
   * Parser harus mengambil semua sel non-kosong di kolom tanggal pada rentang baris blok tersebut (`startRow` s/d `endRow`), sehingga baik pencarian `"Ovylia"`, `"Ina"`, maupun `"Indri"` tetap menemukan blok tugas tersebut.
4. **Pencarian & Pembersihan Nama Asisten (*Fuzzy / Substring Matching*)**:
   * Beberapa sel nama mengandung catatan tambahan seperti `Ovylia dr.Agnes`, `Ulfa BPJS dl`, `Latifah j.9`, atau `Dwi Ulfa CFD`.
   * Saat membuat daftar *dropdown* nama asisten unik, bersihkan sufiks catatan umum (`dr.Agnes`, `BPJS dl`, `j.9`, `CFD`, `dl`, `cuti`, `LP`, `MCU`, `semua asisten`) untuk menghasilkan daftar nama bersih (misal: `Afiz`, `Adelina`, `Adung`, `Aisah`, `Desi`, `Dewi S`, `Dian A`, `Dian SL`, `Dwi Ulfa`, `Endang`, `Firda`, `Ina`, `Indri`, `Jihan N`, `Kamti`, `Kristi`, `Latifah`, `Lita`, `Lulut`, `Maria`, `Maya`, `Mega`, `Mirada`, `Nabila`, `Naela`, `Novisa`, `Nurul U`, `Octavia`, `Ovylia`, `Rina A`, `Risma`, `Suci P`, `Supaati`, `Ulfa`, `Yetty`).
   * Saat memfilter jadwal berdasarkan nama asisten, gunakan pencocokan kata (*case-insensitive substring/word match*) terhadap teks asli di sel kolom tanggal.
5. **Pembersihan Spasi Berlebih pada Teks Tugas**:
   * Di Excel asli, banyak sel tugas yang memisahkan nama dokter menggunakan spasi panjang (contoh Baris 33: `"dr.Witjitra D     dr.M.Kamil                           dr.Neni"`).
   * Saat ditampilkan di UI, ubah spasi berlebih (`/\s{2,}/g`) menjadi pemisah poin atau koma yang rapi agar mudah dibaca di layar HP.

---

## 4. Spesifikasi Fitur & Tampilan Antarmuka (UI/UX)

Aplikasi terdiri dari **1 Halaman Utama (*Single Page Application*)** dengan komponen berikut:

### 4.1 Komponen Header & Upload File Excel
* **Status File Aktif**: Menampilkan nama file Excel yang sedang dimuat (contoh: `NOVEMBER MG 1 2026.xlsx • Periode 1 Nov – 8 Nov 2026`) beserta tombol **"Ganti File Excel"**.
* **Dropzone Upload (Saat Belum Ada Data / Klik Ganti File)**:
  * Area *drag-and-drop* atau pilih file `.xlsx` dari HP/Laptop.
  * Secara otomatis mencari sheet yang namanya mengandung kata `internis` (*case-insensitive*, default: `internis dkk`). Jika tidak ditemukan, tampilkan *dropdown* agar user bisa memilih nama sheet yang tersedia.
  * Begitu berhasil di-*parse*, data langsung disimpan ke `localStorage` sehingga user tidak perlu *upload* ulang ketika menutup dan membuka kembali browser.

### 4.2 Tab Navigasi Utama (2 Mode Baca)

#### Mode 1: "Jadwal Saya" (Filter Fokus per Asisten)
Mode default untuk asisten yang ingin mengecek jadwal pribadinya:
1. **Pemilih Nama Asisten (*Searchable Select / Pill Selector*)**:
   * User memilih atau mengetik namanya (contoh: **`Afiz`**). Pilihan otomatis tersimpan di `localStorage`.
2. **Pemilih Tanggal (*Horizontal Date Tabs*)**:
   * Menampilkan deretan tombol tanggal yang ada di Excel (`Min 1 Nov`, `Sen 2 Nov`, `Sel 3 Nov`, `Rab 4 Nov`, `Kam 5 Nov`, `Jum 6 Nov`, `Sab 7 Nov`, `Min 8 Nov`) serta tab **"Sepekan Penuh"**.
3. **Tampilan Kartu Tugas (Saat Memilih Tanggal Tertentu, misal: `Afiz` pada `Senin, 2 Nov 2026`)**:
   * **Header Kartu**: Menampilkan *Badge* Kategori Shift dari Kolom A (contoh: **`Shift 14.00`**) dan nomor slot (`Slot #20 • Baris 75–79`).
   * **Isi Detail Tugas (Bullet List)**: Menampilkan setiap baris tugas yang ada di dalam blok tersebut secara berurutan:
     * `masuk jam 12`
     * `dr.Tan Hengky C+D`
     * `dr.Rheza Sp.OT`
     * `dr.Marsella`
   * **Kartu Tugas Kolektif**: Menampilkan info tugas umum dari Baris 100 (`EVALUASI BPJS dan Print resume • PIKET 5R1P`).
   * **Kondisi Kosong / Libur**: Jika pada tanggal yang dipilih nama asisten tercatat di baris Cuti/LP (Baris 101–103), tampilkan *badge* status **`Sedang Cuti / Libur Pengganti (LP)`**. Jika namanya tidak ada di slot mana pun pada tanggal tersebut, tampilkan info **`Tidak ada jadwal tercatat pada tanggal ini`**.
4. **Tampilan "Sepekan Penuh"**:
   * Menampilkan daftar kartu berurutan dari Senin s/d Minggu khusus untuk asisten yang dipilih, sehingga ia bisa melihat perubahan rincian dokter dari hari ke hari dalam satu layar *scroll*.

#### Mode 2: "Semua Jadwal Harian" (Eksplorasi per Tanggal & Cari Dokter)
Mode untuk melihat keseluruhan jadwal klinik pada satu tanggal tertentu:
1. **Pemilih Tanggal**: Memilih tanggal aktif (misal: `Senin, 2 Nov 2026`).
2. **Search Bar Multi-Fungsi (Cari Asisten / Dokter / Tugas)**:
   * User bisa mengetik nama asisten (misal `"Afiz"`) **atau** nama dokter/tugas (misal `"dr. Rheza"`, `"Tan Hengky"`, `"BPJS"`).
   * Daftar kartu di bawahnya langsung terfilter secara *real-time* menampilkan slot mana yang menangani dokter/tugas tersebut beserta nama asisten yang bertugas.
3. **Pengelompokan per Kategori Jam Shift**:
   * Menampilkan daftar seluruh slot dikelompokkan berdasarkan jam di Kolom A (`Jam 7`, `Jam 8`, `j 9`, `J.10`, `14.00`, `07.14`, `14.21`).
   * Di bagian atas atau bawah halaman, tampilkan kotak informasi **Daftar Cuti / LP Hari Ini** (contoh 2 Nov: `Nurul U cuti`).

---

## 5. Struktur Data JSON Internal (Target Output Parser)

Berikut skema TypeScript / JSON yang harus dihasilkan oleh fungsi parser Excel di sisi klien dan disimpan ke `localStorage`:

```typescript
export interface SlotAssignment {
  slotId: number;            // 1 s/d 28
  rowRange: [number, number]; // Contoh: [75, 79] (1-based Excel row)
  shiftLabel: string;        // Contoh: "14.00", "Jam 7", "Jam 8", "j 9", "J.10"
  rawAssignees: string[];    // Teks asli di kolom tanggal, contoh: ["Afiz"]
  tasks: string[];           // Daftar baris tugas di kolom hari terkait, contoh: ["masuk jam 12", "dr.Tan Hengky C+D", "dr.Rheza Sp.OT", "dr.Marsella"]
}

export interface DailySchedule {
  dateISO: string;           // Contoh: "2026-11-02"
  dateLabel: string;         // Contoh: "Senin, 2 Nov 2026"
  dayName: string;           // "SENIN" | "SELASA" | "RABU" | "KAMIS" | "JUMAT" | "SABTU" | "MINGGU"
  assignments: SlotAssignment[];
  leaveNotes: string[];      // Dari Baris 101-103, contoh: ["Nurul U cuti"]
}

export interface ParsedScheduleData {
  fileName: string;
  sheetName: string;
  uploadedAt: string;
  assistantList: string[];   // Daftar nama asisten unik yang sudah dinormalisasi untuk dropdown
  days: DailySchedule[];     // Array jadwal per kolom tanggal (1 Nov s/d 8 Nov 2026)
}
```

---

## 6. Kasus Uji Validasi (Acceptance Criteria untuk Antigravity)

Saat mengimplementasikan parser dan UI, pastikan aplikasi lolos skenario pengujian berikut menggunakan file `NOVEMBER MG 1 2026.xlsx`:

| No | Skenario Uji | Input Filter | Output yang Wajib Tampil di Layar |
| :--- | :--- | :--- | :--- |
| **1** | **Cek Jadwal Afiz (2 Nov 2026)** | Nama: `Afiz` <br>Tanggal: `2026-11-02` (Senin) | • Kategori Shift: **`14.00`** (Slot #20, Baris 75–79)<br>• Detail Tugas:<br>  1. `masuk jam 12`<br>  2. `dr.Tan Hengky C+D`<br>  3. `dr.Rheza Sp.OT`<br>  4. `dr.Marsella`<br>• Tugas Umum: `EVALUASI BPJS dan Print resume • PIKET 5R1P` |
| **2** | **Cek Jadwal Afiz (3 Nov 2026)** | Nama: `Afiz` <br>Tanggal: `2026-11-03` (Selasa) | • Kategori Shift: **`14.00`** (Slot #20, Baris 75–79)<br>• Detail Tugas (mengikuti Kolom C / Selasa):<br>  1. `dr.Dwi Lestari (C+D)`<br>  2. `dr.Tan Hengky`<br>  3. `dr.gizi`<br>  4. `masuk jam 12`<br>  5. `5R1P` |
| **3** | **Cek Asisten Double Slot (2 Nov 2026)** | Nama: `Suci P` <br>Tanggal: `2026-11-02` (Senin) | Menampilkan **2 Kartu Tugas**:<br>• **Kartu 1 (`Jam 8` - Baris 9–10)**: `dr. Dicky(C+D)`, `piket BHP bedah`<br>• **Kartu 2 (`14.00` - Baris 63–67)**: `Prof.Zainal`, `Msk jam 13.00`, `TTV bedah`, `5R1P bedah inter` |
| **4** | **Cek Pencarian Nama dengan Catatan Tambahan** | Nama: `Ovylia` <br>Tanggal: `2026-11-02` (Senin) | Tetap cocok dengan sel `Ovylia dr.Agnes` di Baris 4–5 (`Jam 7`) dan menampilkan tugas: `KOORDINATOR FAMILY CARE PAGI/SIANG, MCU/DHL, TTV internis` |
| **5** | **Cek Status Cuti / LP** | Tanggal: `2026-11-02` & `2026-11-07` | • Pada `2026-11-02`: Menampilkan info cuti `Nurul U cuti` (meskipun Nurul U tidak ada di slot reguler hari Senin).<br>• Pada `2026-11-07`: Menampilkan info `Adung cuti`, `Rin A LP`, `Firda LP`. |
| **6** | **Persistensi `localStorage`** | Refresh halaman browser (`F5`) setelah upload | Data jadwal dan pilihan nama asisten terakhir tetap tampil tanpa perlu mengunggah ulang file Excel. |
