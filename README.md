====================================================================
           WONDR FOR EDUCATION - PROTOTYPE ECOSYSTEM
   Platform Keuangan Sekolah, POS Kantin & Portal B2B BNI Open API
====================================================================

Proyek ini adalah prototipe interaktif web-based berbasis React, Tailwind CSS, 
dan Lucide Icons yang mereplikasi ekosistem "wondr by BNI".

--------------------------------------------------------------------
1. PRASYARAT (PREREQUISITES)
--------------------------------------------------------------------
Sebelum menjalankan proyek ini, pastikan komputer/laptop Anda sudah 
memiliki perangkat lunak berikut:

1. Node.js (Versi 18.x atau lebih baru)
   Download di: https://nodejs.org/
2. Git
   Download di: https://git-scm.com/
3. Code Editor (Rekomendasi: VS Code atau Google IDX / AntiGravity)

--------------------------------------------------------------------
2. CARA MENGUNDUH & MENJALANKAN PROYEK (INSTALLATION & SETUP)
--------------------------------------------------------------------

Langkah 1: Clone Repository dari GitHub
----------------------------------------
Buka Terminal / Command Prompt (CMD) / Git Bash, lalu jalankan perintah:

  git clone <URL_REPOSITORY_GITHUB_ANDA>

Contoh:
  git clone https://github.com/username/wondr-education-prototype.git


Langkah 2: Masuk ke Folder Proyek
---------------------------------
Ketik perintah berikut di terminal:

  cd wondr-education-prototype


Langkah 3: Install Semua Dependency / Packages
-----------------------------------------------
Karena folder 'node_modules' sengaja diabaikan (.gitignore) saat di-push 
ke GitHub, Anda harus mengunduh pustaka yang dibutuhkan secara otomatis 
dengan menjalankan:

  npm install

Tunggu hingga proses instalasi paket selesai.


Langkah 4: Jalankan Server Lokal (Development Server)
------------------------------------------------------
Setelah instalasi selesai, jalankan perintah:

  npm run dev

(Atau jika menggunakan Create React App / Next.js lama, gunakan: npm start)


Langkah 5: Buka Prototipe di Browser
------------------------------------
Buka browser pilihan Anda (Chrome/Edge/Brave) dan akses alamat lokal yang 
tertera di terminal, biasanya:

  http://localhost:5173/   atau   http://localhost:3000/

Selesai! Prototipe sekarang dapat digunakan secara interaktif.

--------------------------------------------------------------------
3. FITUR & CARA NAVIGASI DEMO PROTOTIPE
--------------------------------------------------------------------
Proyek ini memiliki 4 layar/mode simulator utama yang dapat diakses melalui 
Navigation Switcher di bagian atas antarmuka:

1. [Screen 1: Home]
   - Layar utama aplikasi ritel "wondr by BNI" milik Orang Tua.
   - Klik ikon "Edukasi & Anak" (badge BARU) untuk masuk ke Parent Hub.

2. [Screen 2: Parent Hub]
   - Dashboard kontrol orang tua.
   - Fitur: Geser slider untuk mengubah batas (pagu) jajan harian anak, 
     pantau riwayat & batas pagu terpakai, serta penawaran KPR Pre-Approved.

3. [Screen 3: POS Kantin]
   - Simulasi layar kasir kantin sekolah (Mbak Sri - SMAN 1 Surabaya).
   - Cobalah menambah pesanan dan klik "Proses Bayar" untuk menguji validasi 
     pagu harian secara real-time.

4. [Screen 4: Portal Sekolah (B2B Full Desktop)]
   - Web dashboard B2B penagihan & pencatatan SPP untuk Bendahara Sekolah.
   - Tampilan Full-Width Desktop dengan 4 metric cards & tabel rekonsiliasi SPP.
   - Klik "Kirim Remind SPP" untuk mensimulasikan penagihan SPP via BNI Open API.

--------------------------------------------------------------------
4. TROUBLESHOOTING (KENDALA UMUM)
--------------------------------------------------------------------
Q: Mengapa gambarnya pecah / tidak muncul?
A: Pastikan file aset gambar berada di dalam folder 'public/assets/' 
   dengan nama file berikut:
   - wondr-logo.png
   - bni-logo.png
   - qris-icon.svg

Q: Port 3000 / 5173 sudah digunakan oleh aplikasi lain?
A: Ketik 'y' saat terminal menanyakan apakah ingin berpindah ke port lain, 
   atau hentikan proses node.js lain yang sedang berjalan.

====================================================================

====================================================================
