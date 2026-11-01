# 🏥 Sistem Informasi Jadwal Shift Klinik Internis & Bedah

Aplikasi web *client-side* berbasis mobile-first yang dirancang untuk mentransformasikan dokumen matriks Excel jadwal shift klinik spesialis (template sheet `internis dkk`) menjadi antarmuka visual yang terstruktur, cepat dicari, dan mudah dibaca langsung dari perangkat seluler maupun desktop.

---

## 📌 Latar Belakang & Tujuan Sistem

Di lingkungan poliklinik rawat jalan dan bedah, jadwal kerja asisten dan perawat sering kali disusun dalam bentuk spreadsheet matriks yang sangat padat. Spreadsheet tersebut menggabungkan:
1. **Template Tugas Harian**: Rincian poliklinik dokter spesialis, tindakan medis, jam masuk, dan tugas penunjang (Kolom B–G).
2. **Penugasan Asisten per Tanggal**: Nama-nama staf yang bertugas pada setiap tanggal kalender (Kolom H ke kanan).
3. **Matriks Vertikal Multibaris**: Satu penugasan (slot) membentang di beberapa baris sel (*merged rows/borders*).

Membuka file Excel matriks besar secara langsung di layar smartphone saat operasional klinik sering kali menyulitkan perawat untuk menemukan jam dinas pribadi, rotasi dokter, maupun status libur/cuti. Aplikasi ini hadir sebagai instrumen konversi dan visualisasi instan yang membaca matriks tersebut secara otomatis dan menyajikan informasi yang relevan secara personal maupun operasional.

---

## 🏛️ Arsitektur & Prinsip Desain

### 1. 100% Client-Side Processing (Zero-Backend)
* Pemrosesan file `.xlsx` dilakukan sepenuhnya di dalam memori browser pengguna menggunakan library SheetJS (`xlsx`) melalui antarmuka `FileReader` dan `ArrayBuffer`.
* Tidak ada data pasien, staf, maupun file jadwal yang dikirimkan ke server eksternal, sehingga menjamin kerahasiaan data internal rumah sakit/klinik (*data privacy by design*).

### 2. Penyimpanan Lokal Mandiri (*Local Persistence*)
* Data hasil parsing disimpan langsung pada `localStorage` browser perangkat masing-masing:
  * `internis_schedule_raw`: Struktur data JSON lengkap dari file Excel aktif.
  * `internis_selected_nurse`: Nama asisten yang terakhir dipilih (tersimpan permanen agar saat aplikasi dibuka kembali, jadwal pribadi langsung tampil).
  * `internis_selected_date`: Tanggal terakhir yang sedang ditinjau.
* Tidak memerlukan otentikasi login, akun pengguna, maupun koneksi database online.

### 3. Adaptabilitas Rentang Waktu Dinamis (*Dynamic Date Range*)
Sistem tidak membatasi jumlah hari dalam file Excel. Parser memindai kolom tanggal secara dinamis untuk menangani berbagai variasi rotasi kerja:
* **Periode Singkat**: Jadwal khusus 3–5 hari (misal saat libur panjang / cuti bersama).
* **Periode Mingguan**: Siklus standar 7–8 hari.
* **Periode Dwi-Mingguan / Tengah Bulan**: Siklus 14–15 hari (misal: 17 Okt – 31 Okt).
* **Periode Bulanan Penuh**: Siklus 28–31 hari.

---

## ⚙️ Logika & Spesifikasi Parsing Excel (Sheet `internis dkk`)

Struktur parsing dibangun berdasarkan spesifikasi matriks kerja poliklinik:

### 1. Pemetaan Kolom Template & Tanggal
* **Kolom A (Baris 4–100)**: Kategori jam shift utama (`Jam 7`, `Jam 8`, `j 9`, `J.10`, `14.00`, `07.14`, `14.21`, `Semua Shift`).
* **Kolom B s/d G**: Master template tugas harian poliklinik dokter untuk hari Senin (B), Selasa (C), Rabu (D), Kamis (E), Jumat (F), dan Sabtu (G).
* **Kolom H ke Kanan**: Kolom penugasan per tanggal kalender. Baris ke-3 menyimpan nilai tanggal (angka serial Excel seperti `46326` atau objek tanggal). Hari dalam seminggu (`dayOfWeek`) dari tanggal tersebut secara otomatis memetakan tugas ke kolom template yang bersesuaian.

### 2. Definisi 28 Blok Slot Penugasan (Baris 4 s/d 100)
Tiap slot kerja didefinisikan secara presisi untuk mencakup seluruh baris vertikal penugasan:
* **Slot 01–03** (`Baris 4–8`): Kategori `Jam 7` (Koordinator Family Care, MCU/DHL, TTV internis, dr. Yeffry, Prof. Soeharyo, dr. Indra).
* **Slot 04–06** (`Baris 9–16`): Kategori `Jam 8` (dr. Dicky, piket BHP, dr. Vincent, dr. Antonius, dr. Kurniawan, dr. Ardian).
* **Slot 07–10** (`Baris 17–38`): Kategori `j 9` (TTV bedah, Onloop, dr. Theodorus, dr. Hirlan, dr. Dadang Sp.OT, Prof. Darmono, dr. Meilina, dr. Firsza, dr. Witjitra, dr. Kamil, dr. Neni).
* **Slot 11–13** (`Baris 39–49`): Kategori `J.10` (dr. Andy, dr. KunSemedi, dr. Novalia Sp.KJ, dr. Donie, dr. Bambang Singgih, dr. Agnes).
* **Slot 14–25** (`Baris 50–97`): Kategori `14.00 / Shift Siang` (dr. Suhardiyono, dr. Agus P, dr. Suyanto, dr. Teguh, Prof. Zainal, SECA/uroflo, dr. Tan Hengky, dr. Rheza Sp.OT, dr. Marsella, dr. Linda, dr. Diana, dr. Dwi Lestari, dr. Rifqi Sp.BP, dr. Tania).
* **Slot 26–27** (`Baris 98–99`): Kategori `07.14` dan `14.21` (PIC BPJS cluster & STOCK, TTV anamnesa DAHLIA).
* **Slot 28** (`Baris 100`): Kategori `Semua Shift` (Tugas kolektif: Evaluasi BPJS, Print resume, Piket 5R1P).

### 3. Penanganan Aturan Khusus (Edge Cases)
* **Double Slot dalam Satu Hari**: Jika seorang staf bertugas di 2 slot pada tanggal yang sama (misal: *Suci P* di Shift Jam 8 sekaligus Shift 14.00, atau *Afiz* di Shift j 9 sekaligus Shift 14.00), sistem tidak menimpa (*overwrite*) data, melainkan menyajikan keduanya sebagai kartu penugasan terpisah.
* **Normalisasi & Pembersihan Nama Asisten**: Sistem secara otomatis mengekstrak nama unik staf dan memisahkan catatan penugasan tambahan, misalnya:
  * `Ovylia dr.Agnes` ➔ dinormalisasi sebagai asisten `Ovylia` (tetap mencocokkan tugas dr. Agnes).
  * `Ulfa BPJS dl` / `Dwi Ulfa CFD` ➔ dinormalisasi sebagai `Dwi Ulfa`.
  * `Latifah j.9` ➔ dinormalisasi sebagai `Latifah`.
  * `Rin A LP` ➔ dinormalisasi sebagai `Rina A`.
* **Deteksi Cuti & Libur Pengganti (LP)**: Membaca baris 101–104 untuk mendeteksi asisten yang berstatus cuti atau LP (contoh: `Nurul U cuti`, `Novisa LP`, `Ina cuti`, `Adung cuti`) dan menampilkan penanda visual khusus.
* **Hari Minggu / CFD**: Hari Minggu tidak memiliki kolom template di B–G; parser mengambil catatan penugasan langsung dari sel tanggal terkait.

---

## 🖥️ Mode Tampilan & Fungsionalitas Utama

```
                               ┌─────────────────────────────┐
                               │     Header & Mode Nav       │
                               └──────────────┬──────────────┘
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              ▼                               ▼                               ▼
     [ 1. Jadwal Saya ]           [ 2. Semua Jadwal Harian ]       [ 3. Cari Dokter & Asisten ]
 ┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
 │ • Searchable Nurse Pill │     │ • Selector Tanggal      │     │ • Direktori Nama Dokter │
 │ • Filter Tanggal / All  │     │ • Live Search Bar       │     │ • Matriks Hari & Shift  │
 │ • Kartu Dinas & Tugas   │     │ • Pengelompokan Shift   │     │ • Asisten Pendamping    │
 │ • Banner Cuti / Off     │     │ • Rekap Cuti / LP       │     │ • Konteks Tugas Slot    │
 └─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
              │                               │                               │
              └───────────────────────────────┼───────────────────────────────┘
                                              ▼
                              [ Bagikan Ringkasan via WhatsApp ]
```

### 1. Mode "Jadwal Saya" (Personal Nurse View)
* Ditujukan untuk penggunaan harian perawat/asisten.
* Menyediakan pemilih nama asisten berbasis pencarian (*searchable selector*) serta tombol pintas (*quick pills*).
* Menampilkan kartu penugasan spesifik pada tanggal yang dipilih atau opsi **"Seluruh Periode"** yang merangkum rotasi kerja selama siklus jadwal dalam satu garis waktu (*timeline*).
* Dilengkapi status informatif saat staf bersangkutan sedang Off, Cuti, atau bertugas lebih dari satu shift (*Double Slot*).

### 2. Mode "Semua Jadwal Harian" (Daily Operational Matrix)
* Ditujukan untuk koordinator ruangan, kepala jaga, maupun supervisi operasional harian.
* Menyajikan seluruh 28 slot tugas pada satu hari tertentu, dikelompokkan secara visual berdasarkan kategori jam shift.
* Memiliki fitur pencarian multi-kategori *real-time*: pengguna dapat memfilter daftar berdasarkan nama asisten, nama dokter spesialis, maupun jenis tindakan/tugas medis.
* Menyediakan kotak rekapitulasi staf yang sedang berhalangan hadir (Cuti / LP).

### 3. Mode "Cari Dokter & Asisten" (Clinic Doctor Directory)
* Menjawab kebutuhan koordinasi medis harian terkait jadwal praktek dokter spesialis.
* Mengagregasi seluruh dokter yang tercantum di kolom template tugas selama periode jadwal aktif.
* Pengguna dapat memilih atau mengetik nama dokter (misal: *dr. Tan Hengky*, *dr. Rheza*, *Prof. Darmono*, *dr. Vincent*) untuk mengetahui hari apa saja dokter tersebut berpraktek, jam shiftnya, dan **nama asisten yang mendampingi**.

### 4. Ekspor & Integrasi WhatsApp (Share WA)
* Memformat data jadwal aktif menjadi pesan teks terstruktur lengkap dengan emoji penanda (jam shift, dokter, tugas kolektif).
* Mendukung pilihan cakupan: membagikan jadwal untuk tanggal yang sedang dibuka saja atau rangkuman seluruh periode rotasi kerja.
* Dilengkapi tombol satu klik untuk menyalin ke clipboard maupun langsung membuka tautan `api.whatsapp.com`.

---

## 📊 Struktur Model Data Internal (JSON Schema)

```typescript
export interface SlotAssignment {
  slotId: number;              // ID Slot tetap: 1 s/d 28
  rowRange: [number, number];   // Rentang baris fisik Excel (1-based), misal: [75, 79]
  shiftLabel: string;          // Label kategori shift, misal: "14.00", "Jam 7", "j 9"
  rawAssignees: string[];      // Nilai teks asli nama petugas di kolom tanggal
  tasks: string[];             // Uraian tugas/dokter dari kolom template hari bersangkutan
}

export interface DailySchedule {
  dateISO: string;             // Tanggal format ISO: "YYYY-MM-DD"
  dateLabel: string;           // Label tampilan lokal, misal: "Senin, 2 Nov 2026"
  dayName: string;             // "SENIN" | "SELASA" | "RABU" | "KAMIS" | "JUMAT" | "SABTU" | "MINGGU"
  assignments: SlotAssignment[];
  leaveNotes: string[];        // Rekapitulasi staf cuti/LP (Baris 101-104)
}

export interface ParsedScheduleData {
  fileName: string;            // Nama berkas Excel sumber
  sheetName: string;           // Nama lembar kerja yang diolah (default: "internis dkk")
  uploadedAt: string;          // Timestamp ISO pemrosesan berkas
  periodLabel?: string;        // Ringkasan rentang waktu, misal: "1 Nov – 8 Nov 2026 (8 Hari)"
  assistantList: string[];     // Daftar nama asisten unik terurut alfabetis
  days: DailySchedule[];       // Koleksi jadwal harian kronologis
}
```

---

## 🛠️ Spesifikasi Teknologi

| Komponen | Pilihan Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript | Komponen antarmuka berbasis tipe data ketat dan performa tinggi |
| **Build Tool** | Vite | Kompilasi ultra-cepat dan *tree-shaking* statis optimal |
| **Styling** | Tailwind CSS v4 | Utilitas styling modern, tema warna klinis medis (*teal/emerald*), kontras tinggi |
| **Excel Engine** | SheetJS (`xlsx`) | Pembacaan biner spreadsheet langsung di sisi klien (*in-browser ArrayBuffer*) |
| **Icon Set** | Lucide React | Ikonografi vektor yang konsisten dan ringan |
| **Target Deployment** | Static Web Application (Vercel / Netlify / GitHub Pages) | Tanpa ketergantungan server runtime Node.js saat produksi |
