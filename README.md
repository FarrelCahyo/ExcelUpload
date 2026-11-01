# 🏥 Aplikasi Web Jadwal Shift Klinik Internis & Bedah

Aplikasi web modern, cepat, dan *mobile-first* yang dirancang untuk membaca, menampilkan, memfilter, dan membagikan jadwal shift kerja asisten dan dokter klinik dari file Excel mingguan (template sheet `internis dkk`).

Aplikasi berjalan **100% Client-Side** di browser tanpa memerlukan server backend, database, maupun autentikasi. Data jadwal otomatis tersimpan secara lokal di browser (`localStorage`).

---

## ✨ Fitur Unggulan

1. **Jadwal Saya (Fokus Personal)**
   - Pilih nama asisten (misal: **Afiz**, **Suci P**, **Ovylia**, dll.) dengan pencarian cepat (*searchable select & quick pills*).
   - Filter per tanggal aktif (`Sen 2 Nov`, `Sel 3 Nov`, dst.) atau mode **"Sepekan Penuh"** untuk melihat rotasi tugas seminggu penuh.
   - Deteksi otomatis asisten dengan **Double Slot** pada hari yang sama (misal: *Suci P* di Shift Jam 8 dan Shift 14.00).
   - Deteksi status **Cuti / Libur Pengganti (LP)** langsung dari Baris 101–103 Excel.
   - Menampilkan tugas kolektif bersama (*BPJS & Piket 5R1P*).
   
2. **Semua Jadwal Harian (Eksplorasi Lengkap)**
   - Melihat pemandangan utuh seluruh poliklinik dan slot shift per hari.
   - Filter cepat berdasarkan kategori jam shift (`Jam 7`, `Jam 8`, `j 9`, `J.10`, `14.00`, `07.14`, `14.21`).
   - Pencarian multi-kategori *real-time*: cari nama dokter, asisten, atau jenis tugas.
   - Kotak ringkasan daftar petugas yang sedang cuti/LP hari ini.

3. **Cari Dokter & Asisten (Direktori Poliklinik)**
   - Menjawab pertanyaan *"Siapa asisten yang mendampingi dr. X hari ini / besok?"*
   - Cukup ketik atau klik nama dokter (misal: *dr. Tan Hengky*, *dr. Rheza*, *Prof. Darmono*, *dr. Vincent*).

4. **Bagikan Jadwal via WhatsApp (Share WA)**
   - Membuat format pesan ringkasan jadwal yang rapi lengkap dengan emoji.
   - Tombol satu klik: *Salin ke Clipboard* atau *Buka WhatsApp Langsung*.

5. **Upload & Ganti File Excel Fleksibel**
   - Modal drag-and-drop untuk mengunggah file jadwal minggu-minggu berikutnya.
   - Sudah terpasang (*preloaded*) jadwal default periode **1 Nov – 8 Nov 2026** dari file `NOVEMBER MG 1 2026.xlsx`.
   - Tombol untuk memulihkan jadwal bawaan sewaktu-waktu.

---

## 🚀 Menjalankan Secara Lokal

```bash
# Masuk ke direktori
cd JadwalExcel

# Jalankan development server
npm run dev
```

Buka browser di `http://localhost:3000` (atau URL yang ditampilkan terminal).

---

## 📦 Build & Deploy ke Vercel

Aplikasi ini dapat langsung dideploy ke **Vercel** sebagai *Static Site*:

1. **Build lokal**:
   ```bash
   npm run build
   ```
   Hasil build statis berada di direktori `dist/`.

2. **Deploy via Vercel CLI**:
   ```bash
   npx vercel
   ```
   Atau hubungkan repositori Git ke dashboard [Vercel](https://vercel.com) dengan konfigurasi:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

