# Design Document: Aplikasi Jadwal Shift Cantikku (Strawberry Milk Edition) 🍓🍰

## 1. Intent & The Why
Mengubah aplikasi jadwal shift yang semula bertema korporat rumah sakit generik (*AI slop*) menjadi **aplikasi personal, hangat, dan menggemaskan** sebagai hadiah pendamping dinas untuk **Afiz**, seorang perawat klinik poli internis & bedah.

Desain mengikuti referensi visual yang diberikan: tema warna pink pastel dan strawberry milk, karakter suster kelinci (*bunny nurse*) memegang stroberi, ornamen awan dan bintang berkilau, tab tanggal stroberi imut, kartu shift renda bergelombang (*scalloped ribbon border*), dan modal upload susu stroberi di atas awan.

## 2. Goals, Non-Goals, & Anti-Goals
* **Goals**:
  - Tampilan visual presisi sesuai gambar referensi pengguna.
  - Persona Afiz sebagai pusat utama aplikasi (greeting, avatar, lencana cinta, highlight jam masuk).
  - Tetap memiliki fitur untuk mengintip jadwal rekan kerja dan mencari dokter.
  - Membaca file Excel klinik secara dinamis baik mingguan (8 hari), dua mingguan (15 hari), maupun sebulan penuh (1 s/d 31 hari).
  - 100% statis (*client-side*), tanpa backend atau database server, persistensi di `localStorage`.
  - Tanpa data bawaan: saat pertama kali dibuka, aplikasi menyambut dengan antarmuka imut dan memicu Modal Upload Kawaii untuk mengunggah file `.xlsx`.
  - Katalog 50 pesan cinta & perhatian manis otomatis yang berganti setiap hari di tab Pesan Cinta.
* **Non-Goals**:
  - Mengubah format file Excel rumah sakit (aplikasi beradaptasi dengan template Excel yang ada).
  - Sistem autentikasi / login multi-user yang rumit.
* **Anti-Goals**:
  - Tampilan generik, kaku, korporat (warna teal/biru rumah sakit yang membosankan).
  - Tampilan padat yang membingungkan saat dibuka di HP.
  - Aset grafis pecah atau berbayang hasil crop mockup miring.

## 3. Approaches Considered & Tradeoffs
1. **Opsi 1: Afiz-First Persona + Quick Drawer / Tab Jadwal Rekan (TERPILIH) ⭐**
   - Layar utama 100% didedikasikan untuk Afiz sesuai gambar referensi.
   - Fitur jadwal teman ditempatkan di tab khusus dan menu hamburger agar tidak mengganggu keintiman visual.
   - Dipilih karena memberikan pengalaman paling membahagiakan untuk Afiz dan paling sesuai dengan mock-up.
2. **Opsi 2: Dual-Mode Switcher**
   - Switcher kaku antara Afiz dan Tim di bagian atas. Ditolak karena terasa seperti alat kantor formal.
3. **Opsi 3: All-In-One Unified Feed**
   - Semua shift dalam 1 halaman panjang. Ditolak karena terlalu padat di mobile.

## 4. Detailed UI Specifications & Builder Decisions
1. **Header & Profile**:
   - Title: "Semangat Dinasnya Cantikku! 🍓🍰"
   - Avatar: Vector SVG resolusi tinggi Bunny Nurse dengan topi perawat, telinga kelinci, memegang stroberi, pipi merona dengan partikel bintang.
   - Badge: "Afiz 💖"
   - Floating Action: Kotak susu stroberi 3D mini dengan lencana `.xlsx` untuk trigger upload.
2. **Dynamic Date Selector**:
   - Bentuk buah stroberi manis, tanggal aktif berwarna stroberi merah menyala (`#D63447`) dengan daun hijau, teks putih.
   - Scrollable horizontal dengan dukungan 1 hingga 31 hari.
3. **Shift Card**:
   - Frame berenda pink dengan pita di sudut.
   - Judul shift: `SHIFT 14.00 🍓`
   - Entry time alert: `⏰ Masuk jam 12 ya! ✨` (kuning pastel)
   - Doctor list: Ikon stetoskop 🩺, tulang 🦴, kapsul 💊
   - Bottom task: `📋 Evaluasi BPJS & Print Resume ✨`
   - Multi-shift per day: Ditampilkan bertumpuk vertikal dengan frame renda masing-masing.
4. **Kawaii Upload Modal**:
   - Ilustrasi kotak susu stroberi di atas awan pink lembut.
   - Dropzone putus-putus dengan maskot kertas dokumen tersenyum (`📄😊`).
   - Tombol pita `Pilih File 📁` dan tombol kapsul `Batal`.
5. **Bottom Navigation**:
   - 4 tab: 🏠 Beranda, 📅 Kalender (tap tanggal otomatis membuka Beranda pada tanggal tersebut), 🔔 Pesan Cinta (katalog 50 pesan manis & perhatian dinas berganti harian / tombol acak pesan baru), 👥 Jadwal Teman (cari dokter & intip asisten).
   - ☰ Hamburger Menu: Akses cepat ganti file, riwayat file, dan setelan tampilan.

## 5. Excel Engine & Data Flow
- Membaca sheet `internis dkk` dari baris 4 s/d 100 untuk slot 1–28.
- Mendeteksi kolom tanggal mulai Kolom H ke kanan secara dinamis (fleksibel 1–31+ hari).
- Menangani baris cuti/LP (baris 101–103).
- Data disimpan di `localStorage` (`internis_schedule_raw`, `internis_selected_date`).
