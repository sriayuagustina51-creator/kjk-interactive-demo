# Sentra Portal - Interactive Demo Prototype

Website demonstrasi interaktif antarmuka pengguna (UI/UX flow prototype) yang dibuat menggunakan **Next.js (App Router)**, **TypeScript**, dan **Tailwind CSS**, terintegrasi dengan **Google Sheets** melalui **Google Apps Script** untuk pencatatan analitik interaksi, dan siap di-deploy ke **Vercel**.

---

## 📋 Fitur Utama

1. **Halaman Login Demo (`/`)**
   - Tampilan profesional bertema gelap (*enterprise security aesthetic*) dengan efek *glassmorphism*.
   - Responsif optimal untuk desktop, tablet, dan smartphone.
   - Kolom email/username demo, password simulasi dengan toggle lihat/sembunyi, dan checkbox preferensi demo.
   - Validasi input formulir sederhana di sisi klien.
   - **Privasi & Keamanan:** Tombol login berfungsi murni sebagai demonstrasi interaksi pengguna. Sesuai prinsip privasi dan keamanan, kata sandi maupun data autentikasi sensitif **tidak pernah disimpan atau dikirimkan ke server/spreadsheet**.
   - Pencegahan pencatatan ganda (*debounce / submit lock*) saat tombol ditekan.

2. **Halaman Hasil Konfirmasi (`/result`)**
   - Desain visual konsisten dengan animasi status sukses.
   - Menampilkan ringkasan interaksi: ID Sesi Acak (*random session ID*), waktu interaksi lokal, jenis event (`LOGIN_BUTTON_CLICKED`), dan status privasi data.
   - Fitur salin ID Sesi untuk referensi verifikasi.
   - Tombol kembali ke halaman utama untuk mengulang demonstrasi secara mulus.

3. **Pencatatan ke Google Sheets**
   - Menggunakan Google Apps Script Web App sebagai endpoint penerima data.
   - Data yang dicatat hanya berupa metadata:
     - Waktu interaksi (Server & Client ISO)
     - ID Sesi Acak (Anonim)
     - Jenis Interaksi (`LOGIN_BUTTON_CLICKED`)
     - Status Interaksi (`SUCCESS`)
     - Informasi Perangkat Dasar (Resolusi & Platform)
   - Penanganan kegagalan pengiriman yang anggun (*graceful fallback*): Jika endpoint belum disetel atau koneksi bermasalah, pengguna tetap dialihkan ke halaman `/result` tanpa gangguan atau hambatan navigasi.

---

## 📁 Struktur Proyek

```
KJK project/
├── .env.example              # Contoh variabel lingkungan
├── .env.local                # Konfigurasi lokal (diabaikan oleh git)
├── .gitignore                # Berkas yang diabaikan git
├── google-apps-script/
│   └── Code.gs               # Script Google Apps Script untuk Google Sheets
├── package.json              # Dependensi proyek
├── postcss.config.mjs        # Konfigurasi PostCSS
├── tailwind.config.ts        # Konfigurasi Tailwind CSS
├── tsconfig.json             # Konfigurasi TypeScript
├── next.config.mjs           # Konfigurasi Next.js
├── README.md                 # Dokumentasi lengkap
└── src/
    ├── app/
    │   ├── api/
    │   │   └── track/
    │   │       └── route.ts  # Next.js Route Handler aman (Proxy ke Google Apps Script)
    │   ├── globals.css       # Tailwind directives & CSS kustom
    │   ├── layout.tsx        # Layout utama aplikasi
    │   ├── page.tsx          # Halaman Login Utama
    │   └── result/
    │       └── page.tsx      # Halaman Konfirmasi Setelah Login
    ├── components/
    │   └── LoginForm.tsx     # Komponen formulir login demo interaktif
    └── lib/
        └── tracking.ts       # Utilitas pencatatan interaksi aman (tanpa password)
```

---

## 🛠️ Langkah Menghubungkan Google Sheets & Google Apps Script

Ikuti langkah mudah berikut untuk mengaktifkan pencatatan otomatis ke Google Sheets:

### 1. Buat Google Spreadsheet Baru
1. Buka browser dan kunjungi: [https://sheets.new](https://sheets.new).
2. Beri nama spreadsheet Anda, misalnya: `Sentra Demo - Log Interaksi`.

### 2. Pasang Kode Google Apps Script
1. Pada menu Google Sheets, klik **Extensions** (Ekstensi) > **Apps Script**.
2. Hapus semua baris kode bawaan di editor `Code.gs`.
3. Buka file [`google-apps-script/Code.gs`](file:///C:/Users/User/Documents/KJK%20project/google-apps-script/Code.gs) di proyek ini, lalu salin dan tempel seluruh isinya ke editor Google Apps Script.
4. Klik tombol **Save** (ikon disket) atau tekan `Ctrl + S`.

### 3. Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy** (Terapkan) > pilih **New deployment** (Penerapan baru).
2. Klik ikon gerigi (Select type) di sebelah kiri > pilih **Web app**.
3. Atur konfigurasi berikut:
   - **Description**: `Sentra Demo Logger v1`
   - **Execute as**: `Me (email Anda)`
   - **Who has access**: `Anyone` *(PENTING: Pilih "Anyone" / "Siapa saja" agar backend Vercel atau aplikasi web dapat mengirimkan data interaksi tanpa otentikasi login Google)*.
4. Klik tombol **Deploy**.
5. Jika muncul jendela otorisasi izin (*Authorization required*):
   - Klik **Authorize access** (atau *Review permissions*).
   - Pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, klik **Advanced** di kiri bawah > klik **Go to Untitled project (unsafe)**.
   - Klik **Allow**.
6. Salin **Web app URL** yang muncul. URL berformat seperti:
   `https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec`

### 4. Konfigurasikan URL di Proyek
Buka file `.env.local` di komputer Anda, lalu tempelkan URL tersebut:
```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
```

---

## 💻 Menjalankan Proyek Secara Lokal

1. **Buka Terminal di direktori proyek:**
   ```bash
   npm install
   ```

2. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```

3. **Buka di Browser:**
   Akses `http://localhost:3000` melalui browser Anda.
   - Masukkan nama pengguna simulasi (misal: `tamu@demo.com`) dan kata sandi simulasi (misal: `demo123`).
   - Klik tombol **Masuk ke Demo Interaktif**.
   - Halaman akan otomatis berpindah ke `/result` dan baris baru akan tercatat di Google Sheets Anda!

---

## 🚀 Panduan Deployment ke Vercel via GitHub

Untuk membagikan tautan demo kepada teman melalui email:

### Langkah 1: Inisialisasi Git dan Push ke GitHub
1. Pastikan Anda telah membuat repositori baru di [GitHub](https://github.com/new) (misal: `kjk-interactive-demo`), disarankan bersifat *Public* atau *Private*.
2. Di terminal folder proyek ini:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit sentra interactive demo"
   git branch -M main
   git remote add origin https://github.com/<username-anda>/<nama-repo>.git
   git push -u origin main
   ```

### Langkah 2: Deploy ke Vercel
1. Kunjungi [vercel.com](https://vercel.com) dan login (bisa login menggunakan akun GitHub).
2. Klik tombol **Add New...** > **Project**.
3. Cari dan pilih repositori `kjk-interactive-demo` yang baru saja Anda push ke GitHub, lalu klik **Import**.
4. Di bagian **Environment Variables**:
   - Masukkan Key: `GOOGLE_SCRIPT_URL`
   - Masukkan Value: `https://script.google.com/macros/s/AKfycbx.../exec` (URL Web App Apps Script Anda).
5. Klik tombol **Deploy**.
6. Vercel akan otomatis melakukan build proyek Next.js dalam waktu sekitar 1 menit.
7. Setelah selesai, Anda akan mendapatkan URL publik resmi (contoh: `https://kjk-interactive-demo.vercel.app`).
8. Tautan ini siap dibagikan melalui email untuk demonstrasi interaktif!
