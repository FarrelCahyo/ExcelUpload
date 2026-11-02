# Product Requirements Document (PRD): Aplikasi Jadwal Shift Cantikku (Strawberry Milk Edition) 🍓🍰

## 1. Ringkasan Produk & Visi
Aplikasi web statis (*100% Client-Side Static Web Application*) yang dirancang khusus sebagai **hadiah dan pendamping dinas personal yang manis untuk wanita tersayang (Afiz)**, seorang perawat/asisten klinik di poli internis & bedah.

Aplikasi ini merombak total antarmuka generik rumah sakit (*corporate AI slop*) menjadi antarmuka yang sangat imut (*kawaii*), hangat, dan personal dengan tema **Pink & Strawberry Milk**, terinspirasi dari referensi desain visual yang dipersonalisasi. Aplikasi membaca file jadwal Excel klinik mingguan maupun bulanan (1 s/d 31 hari), mem-parsing data langsung di browser, dan menyajikannya secara mobile-first dengan kenyamanan maksimal untuk Afiz.

| Atribut Proyek | Spesifikasi |
| :--- | :--- |
| **Nama Aplikasi** | Jadwal Shift Cantikku (Strawberry Milk Edition) 🍓🥛 |
| **Persona Pengguna Utama** | **Afiz** (Perawat / Asisten Klinik Internis & Bedah) |
| **Target Lingkungan** | Static Web App (Mobile-First responsive, PWA-ready, tanpa backend server) |
| **Penyimpanan Data** | Browser `localStorage` (100% privat di perangkat lokal) |
| **Format Sumber Data** | File Excel `.xlsx` (Sheet `internis dkk`, rentang 1 s/d 31+ hari) |
| **Aestetika & Nuansa** | *Strawberry Milk, Soft Pastel Pink Gingham, Bunny-Nurse Chibi, Lace Ribbons, Clouds & Stars* |
| **Kondisi Awal (First Run)** | Tanpa data bawaan (*clean start*). Saat pertama dibuka, aplikasi menampilkan layar selamat datang berdesain strawberry yang imut dan langsung membuka Modal Upload Kawaii untuk memilih file Excel. |

---

## 2. Pendekatan Arsitektur & Keputusan Desain (Approaches Considered)

Tiga pendekatan arsitektur dipertimbangkan dalam perombakan ini:
1. **Opsi 1: Afiz-First Persona + Tab Pendukung Jadwal Rekan (TERPILIH) ⭐**
   * *Deskripsi*: Tampilan utama 100% fokus memanjakan Afiz (greeting hangat, avatar bunny-nurse, strawberry date tabs, kartu shift renda). Jadwal rekan kerja tetap dapat diakses dengan mudah melalui tab navigasi bawah (Jadwal Tim) atau menu drawer tanpa mengotori halaman utama.
   * *Alasan Dipilih*: Memberikan pengalaman paling intim, estetik, dan sesuai gambar referensi, sambil tetap fungsional 100% saat Afiz perlu bertukar shift dengan rekan.
2. **Opsi 2: Dual-Mode Toggle Switcher (Ditolak)**
   * *Deskripsi*: Switcher kaku di bagian atas antara "Jadwal Afiz" dan "Jadwal Semua".
   * *Alasan Ditolak*: Kurang terasa sebagai hadiah personal; lebih condong ke alat kerja korporat yang diberi warna pink.
3. **Opsi 3: All-In-One Unified Feed (Ditolak)**
   * *Deskripsi*: Semua shift digabung dalam 1 halaman scroll panjang.
   * *Alasan Ditolak*: Membuat layar HP penuh dan melelahkan (28 slot per hari), merusak kerapian UI imut.

---

## 3. Spesifikasi Tampilan & Elemen Visual (UI/UX)

Mengacu langsung pada referensi visual terlampir, antarmuka dirancang dengan detail presisi:

### 3.1 Tema Visual & Palet Warna (Strawberry Milk Palette)
* **Background Utama**: Pola kotak-kotak pastel lembut (*Soft Pink Gingham*) berpadu dengan aksen awan putih halus (*fluffy clouds* ☁️) dan partikel bintang berkilau (*kawaii sparkles* ✨, ✦, ✧).
* **Palet Warna**:
  - `Strawberry Cream (Background)`: `#FFF5F7` / `#FFF0F3`
  - `Gingham Pink Accent`: `#FCE4EC` / `#F8BBD0`
  - `Strawberry Fresh (Primary Brand)`: `#FF6B8B` / `#E85D75`
  - `Strawberry Deep Red (Active Date)`: `#D63447` / `#C2185B`
  - `Pastel Cream / Warm Yellow (Highlight Jam)`: `#FFF9E6` border `#FFE082`
  - `Soft Text Chocolate/Dark Plum`: `#4A2E35` (kontras tinggi, ramah di mata, bukan hitam mati)

### 3.2 Header & Profil Persona Afiz
1. **App Bar Atas**:
   - Ikon mini Stroberi 🍓 di kiri atas.
   - Ikon Menu Hamburger (☰ tiga garis pink lembut) di kanan atas untuk akses cepat ganti file, riwayat file, dan setelan.
2. **Kartu Sapaan Hangat**:
   - Judul Sapaan: **`Semangat Dinasnya Cantikku! 🍓🍰`** dengan tipografi bulat (*rounded*), tebal, dan bernuansa kasih sayang.
   - **Avatar Karakter**: Karakter chibi perawat perempuan berhijab/bertopi suster medis (*nurse cap*) dengan telinga kelinci manis (*bunny ears*), memegang stroberi kecil, pipi merona (*blushing*), dan dihiasi bintang-bintang kecil. Dibuat dengan format vector SVG resolusi tinggi agar tajam dan tidak pecah di layar retina smartphone.
   - **Lencana Nama**: Pill putih manis dengan border pink berhias pita/hati: **`Afiz 💖`**.
   - **Tombol Upload Susu Stroberi Melayang**:
     - Ikon 3D kotak susu stroberi (*Strawberry Milk box*) dengan hiasan lencana file Excel (`🍓🥛 .xlsx`).
     - Berfungsi sebagai tombol cepat untuk membuka Modal Upload jadwal baru kapan saja.

### 3.3 Pemilih Tanggal Stroberi Fleksibel (Dynamic Date Bar 1–31 Hari)
* **Visual Tombol Tanggal**:
  - Setiap tanggal ditampilkan sebagai siluet/ikon buah stroberi yang manis.
  - Format label: Nama Hari singkat & Tanggal (contoh: `Sen, 1 Nov`, `Sel, 2 Nov`).
  - **State Aktif**: Stroberi merah cerah penuh dengan daun hijau di atasnya dan teks putih kontras.
  - **State Inaktif**: Stroberi outline pastel pink dengan teks kecokelatan lembut.
* **Dukungan Tanggal 1 s/d 31**:
  - Mendukung rentang dinamis dari 1 hari, sepekan (8 hari), dua pekan (15 hari), hingga sebulan penuh (31 hari).
  - Dilengkapi *smooth touch scroll* horizontal dan indikator minggu jika rentang tanggal melebihi 7 hari.

### 3.4 Kartu Detail Shift Afiz (The Princess Shift Card)
* **Frame & Border**: Bingkai kartu dengan aksen renda bergelombang (*scalloped lace border*) dan ornamen pita imut (*ribbon bows* 🎀) di sudut-sudutnya.
* **Header Shift**:
  - Menampilkan jam dinas dengan huruf besar manis: contoh **`SHIFT 14.00 🍓`** (atau `SHIFT PAGI 07.00`, `SHIFT J.10`, dll.).
* **Highlight Jam Masuk Khusus**:
  - Jika ada catatan khusus di jadwal seperti *"masuk jam 12"*, tampilkan dalam badge kapsul berwarna krem/kuning pastel: **`⏰ Masuk jam 12 ya! ✨`**.
* **Daftar Dokter Poliklinik yang Didampingi**:
  - Menampilkan daftar dokter yang bertugas dengan ikon tematik yang lucu:
    - 🩺 `dr. Tan Hengky C+D`
    - 🦴 `dr. Rheza Sp.OT`
    - 💊 `dr. Marsella`
* **Lencana Tugas Kolektif / BPJS**:
  - Di bagian bawah kartu, ditampilkan tombol/lencana tugas bersama: **`📋 Evaluasi BPJS & Print Resume ✨`**.
* **Penanganan Multi-Shift dalam Satu Hari**:
  - Jika pada tanggal yang sama Afiz memiliki 2 penugasan (misal pagi dan sore), ditampilkan 2 kartu Princess Shift Card yang tersusun vertikal secara rapi.
* **Kondisi Khusus (Cuti / Libur Pengganti / Tidak Dinas)**:
  - Jika Afiz terdaftar di baris Cuti/LP: Kartu menampilkan ilustrasi awan tidur lucu dengan teks: **`Hari Ini Cantikku Libur / Cuti! Selamat Istirahat ya Sayang ☁️💖`**.
  - Jika tidak ada jadwal di hari tersebut: Tampilan santai *"Tidak ada dinas hari ini, nikmati harimu! 🌸"*.

### 3.5 Modal Upload Jadwal Kawaii
Sesuai layar kanan pada gambar referensi:
* **Backdrop**: Efek blur lembut dengan bintang-bintang manis mengambang.
* **Ilustrasi Puncak**: Kotak susu stroberi bertuliskan *"Strawberry Milk"* dengan pita merah muda besar di atas gumpalan awan pink *fluffy* ☁️.
* **Judul**: **`Upload Jadwal Excel .xlsx ☁️🍓🥛`**.
* **Area Dropzone**:
  - Garis putus-putus (*dashed border*) warna pink pastel.
  - Maskot kertas dokumen tersenyum yang imut (`📄😊`).
  - Tombol berbentuk pita: **`Pilih File 📁`**.
* **Tombol Batal**: Tombol kapsul berwarna pink pastel lembut: **`Batal`**.
* **Keterangan Status**: Menampilkan nama file aktif yang sedang tersimpan di `localStorage`.

### 3.6 Bottom Navigation Bar (4 Tab Manis)
Menu navigasi bawah yang mengambang manis (*floating bottom bar*) dengan ikon berwarna stroberi:
1. 🏠 **Beranda**: Halaman utama jadwal harian Afiz (sesuai referensi).
2. 📅 **Kalender**: Tampilan matriks kalender bulanan/mingguan yang menandai hari-hari dinas Afiz dengan ikon stroberi mini dan status shift. Mengetuk tanggal pada kalender langsung mengarahkan kembali ke Beranda dengan tanggal tersebut aktif.
3. 🔔 **Pesan Cinta / Love Notes**: Halaman pesan penyemangat harian dengan katalog **50 pesan cinta & perhatian otomatis** yang berganti setiap hari atau dapat di-refresh dengan sekali ketuk (e.g. pesan pengingat minum air, semangat dinas pagi/siang, doa kesehatan, pujian ketulusan perawat, dan pelukan virtual hangat).
4. 👥 **Jadwal Teman / Cari Dokter**: Halaman pencarian cepat untuk melihat siapa yang mendampingi dokter tertentu atau melihat jadwal perawat lain jika Afiz ingin tukar dinas.
5. ☰ **Drawer Menu Hamburger**: Menu geser samping praktis untuk ganti file Excel, unduh jadwal, atau setelan tampilan.

---

## 4. Spesifikasi Teknis Parser Excel (`excelParser.ts`)

Mesin parser tetap mempertahankan ketepatan pembacaan data Excel klinik internis & bedah:

### 4.1 Logika Pembacaan Kolom Tanggal Dinamis (1 s/d 31+ Kolom)
1. Baris 3 diperiksa dari Kolom H (indeks `7`) ke kanan secara dinamis.
2. Setiap sel yang berisi tanggal (baik angka *Excel Serial Date* `46327`, string `10/17/26`, maupun objek `Date`) diubah menjadi tanggal JavaScript standar.
3. Pembacaan berhenti jika ditemukan 4 sel kosong berturut-turut di luar batas ref sheet.
4. Nilai hari (`dayOfWeek = date.getDay()`) dipetakan secara otomatis:
   - `1` (Senin) → Kolom B
   - `2` (Selasa) → Kolom C
   - `3` (Rabu) → Kolom D
   - `4` (Kamis) → Kolom E
   - `5` (Jumat) → Kolom F
   - `6` (Sabtu) → Kolom G
   - `0` (Minggu) → Catatan khusus baris Minggu/CFD

### 4.2 Pemetaan 28 Blok Slot Penugasan (Baris 4 s/d 100)
* Slot 1 s/d Slot 28 dipetakan sesuai rentang baris tetap (Baris 4–5 untuk Slot 1, Baris 75–79 untuk Slot 20 tempat Afiz sering bertugas, hingga Baris 100 untuk Tugas Bersama BPJS).
* Ekstraksi Catatan Jam Masuk: Regex mendeteksi `masuk jam \d+|msk j\.\d+|masuk j\.\d+` untuk diangkat menjadi badge jam masuk di atas kartu.
* Ekstraksi Nama Dokter: Spasi panjang pemisah dokter dipecah menjadi daftar terpisah yang rapi.

### 4.3 Baris Cuti & Libur Pengganti (Baris 101 s/d 103)
* Baris 101–103 dipindai per tanggal untuk mencatat siapa saja yang Cuti/LP. Jika nama Afiz tertera di baris ini, status libur langsung diaktifkan.

### 4.4 Baris Tambahan (Baris 104+)
* Semua baris 104 ke atas (tanda tangan kepala unit, laporan bulanan, dsb. seperti pada file `OKTOBER AKHIR 2026.xlsx`) diabaikan secara aman oleh parser.

---

## 5. Struktur Data TypeScript

```typescript
export interface SlotAssignment {
  slotId: number;            // 1 s/d 28
  rowRange: [number, number]; // [75, 79]
  shiftLabel: string;        // "14.00", "Jam 7", "Jam 8", "j 9", "J.10"
  rawAssignees: string[];    // ["Afiz"]
  tasks: string[];           // ["masuk jam 12", "dr.Tan Hengky C+D", "dr.Rheza Sp.OT", "dr.Marsella"]
  timeNote?: string;         // "Masuk jam 12 ya!"
  doctors: string[];         // ["dr. Tan Hengky C+D", "dr. Rheza Sp.OT", "dr. Marsella"]
}

export interface DailySchedule {
  dateISO: string;           // "2026-11-02"
  dateLabel: string;         // "Sen, 2 Nov 2026"
  dayName: string;           // "SENIN"
  dayNumber: number;         // 2
  dayShort: string;          // "Sen"
  assignments: SlotAssignment[];
  leaveNotes: string[];      // ["Nurul U cuti"]
  afizAssignments: SlotAssignment[]; // Penugasan khusus Afiz pada hari ini
  isAfizLeave: boolean;      // Status apakah Afiz cuti/LP
  afizLeaveNote?: string;
}

export interface ParsedScheduleData {
  fileName: string;
  sheetName: string;
  uploadedAt: string;
  assistantList: string[];   // Daftar asisten untuk fitur intip jadwal teman
  days: DailySchedule[];     // Mendukung 1 hingga 31+ hari
}
```

---

## 6. Skenario Pengujian & Kriteria Keberhasilan (Acceptance Criteria)

1. **Pemeriksaan Visual Sesuai Gambar Referensi**:
   - Tampilan di layar HP menampilkan tema strawberry milk, avatar bunny-nurse Afiz resolusi tinggi, lencana *"Afiz 💖"*, tombol melayang susu stroberi, tab stroberi tanggal, dan kartu shift renda.
2. **Kesesuaian Data Afiz pada Contoh Nyata**:
   - File `NOVEMBER MG 1 2026.xlsx` pada tanggal 2 Nov 2026: Afiz tampil di Shift `14.00` dengan highlight *"Masuk jam 12 ya! ✨"*, dokter Tan Hengky, Rheza, Marsella, dan tugas BPJS.
   - File `OKTOBER AKHIR 2026.xlsx`: Memuat seluruh 15 hari dari 17 Okt hingga 31 Okt 2026 tanpa error, dan Afiz terdeteksi di setiap tanggal dinasnya.
3. **Fleksibilitas Rentang Tanggal 1–31**:
   - Jika diunggah file dengan 31 hari, semua 31 tanggal dapat diakses mulus tanpa tata letak berantakan.
4. **Fitur Intip Rekan Kerja**:
   - Afiz dapat membuka tab Jadwal Teman untuk mencari nama dokter atau nama perawat lain secara instan.
5. **Persistensi 100% Offline / Client-Side**:
   - Refresh browser (`F5`) atau membuka kembali aplikasi di HP tetap mempertahankan data Excel dan tanggal terakhir yang dibuka.
