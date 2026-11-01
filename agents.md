# AGENT INSTRUCTIONS — ORDEXA BUSINESS CALCULATOR

> **STATUS:** CRITICAL DIRECTIVES — ALL AGENTS MUST COMPLY AT ALL TIMES.

---

## 1. MANDATORY SKILLS ON EVERY PROMPT

Setiap kali user memberikan prompt / permintaan, agen **WAJIB** secara otomatis memuat dan menerapkan 3 skill berikut tanpa kecuali:

1. **`caveman`**
   - Respon ringkas, padat, dan langsung ke inti teknis (answer first, zero fluff).
   - Hapus basa-basi ("Halo", "Tentu saja", "Senang membantu", dsb.).
   - Pertahankan 100% fakta teknis, kode, path, dan rumus.

2. **`graphify`**
   - Selalu gunakan dan konsultasikan knowledge graph di `graphify-out/graph.json` untuk memahami arsitektur, relasi antar modul, dan alur ketergantungan.
   - Setiap ada penambahan atau perubahan struktural besar, perbarui visualisasi dan data graph (`graphify update`).

3. **`antislop-ui`**
   - Terapkan standar tinggi UI anti-slop: larang keras template AI generik.
   - Desain tajam, komponen taktil, kontras tinggi, micro-interactions responsif, dan layout berkarakter.

---

## 2. STRICT COMPLIANCE WITH PRD.md

Pengembangan aplikasi **WAJIB 100% MENGIKUTI [PRD.md](file:///home/adly/Projects/kal-ordexa/PRD.md)**.
Dilarang menyimpang atau berimprovisasi di luar spesifikasi yang telah ditentukan.

### Aturan Inti PRD:
- **Platform Stack:** React Native, Expo, TypeScript, Expo Router, NativeWind, Zustand, Zod, Expo SQLite, Victory Native, Lucide Icons.
- **Local-First Architecture:** Seluruh kalkulasi berjalan offline di perangkat. Tidak ada backend server untuk MVP.
- **Decoupled Calculation Engine:** Seluruh formula finansial (MRR, ARR, Churn, Fixed/Variable Cost, Payment Gateway MDR & fixed fee, Net Profit, BEP, Growth LTV:CAC, Scenario, ROI) dibuat dalam engine TypeScript murni yang terpisah dari UI dan lolos unit testing.
- **Data Integrity:** Nilai rupiah dihitung secara decimal-safe, pembagian nol ditangani (`N/A`), dan pembulatan hanya dilakukan di layer tampilan.
- **Simulasi Terisolasi:** Data simulasi skenario tidak boleh menimpa atau merusak data utama.

---

## 3. STRICT MOBILE APP UI REQUIREMENT (TAMPILAN WAJIB MOBILE!)

> **PERINGATAN KERAS:**
> TAMPILAN WAJIB 100% UNTUK APLIKASI MOBILE (ANDROID & IOS SMARTPHONE)!
> DILARANG MEMBUAT TAMPILAN ATAU ASUMSI LAYOUT WEB / DESKTOP!

### Spesifikasi Tampilan Mobile (Mengacu pada [design.md](file:///home/adly/Projects/kal-ordexa/design.md)):
- **Form Factor:** Smartphone portrait (Android & iOS).
- **Layout:** Single column mobile-first, screen horizontal padding 20px, card spacing 16px, minimum touch target 44px, safe area insets (notch & home indicator) wajib ditangani.
- **Design Style Hybrid (70% Neubrutalism + 30% Glassmorphism):**
  - **70% Neubrutalism:**
    - Outline border hitam tegas 2px (`#171717`).
    - Hard shadow tanpa blur (`4px 4px #171717` untuk card/button, `5px 5px #171717` untuk komponen besar).
    - Border radius 12–18px.
    - Typography: **Plus Jakarta Sans**, ExtraBold untuk angka finansial (`28–36px`), tabular numbers, format Rupiah (`Rp12.500.000`).
    - Palet: Electric Purple (`#8B5CF6`), Neon Lime (`#C6F66A`), Warm Off-White (`#F5F3EE`), Coral Red (`#FF6B6B`), Deep Black (`#171717`).
  - **30% Glassmorphism:**
    - Digunakan pada Floating Bottom Navigation, Modal Overlay, dan Context Panel.
    - Backdrop blur 16px dengan permukaan translucent (`rgba(255,255,255,0.72)`).
- **Interaksi Mobile:**
  - Numeric keyboard dengan auto-formatting Rupiah pada input.
  - Button press feedback (translate `2-4px` ke kanan-bawah dengan reduksi shadow).
  - Floating pill bottom navigation (Home, Calculator, Simulation, Reports, Settings).

---

## 4. STRICT PHASE-BY-PHASE EXECUTION ([PHASES.md](file:///home/adly/Projects/kal-ordexa/PHASES.md))

> **ATURAN EKSEKUSI TAHAPAN KERJA:**
> Setiap AI Agen yang bekerja pada codebase ini WAJIB membaca [PHASES.md](file:///home/adly/Projects/kal-ordexa/PHASES.md) sebelum melakukan pengerjaan.

1. **Urutan Sekuensial:** Pengerjaan dilakukan berurutan mulai dari Phase 0 sampai Phase 7.
2. **Dilarang Melompati Tahapan:** Jangan membuat layar UI kompleks atau fitur Phase lanjutan sebelum fondasi engine dan database di Phase sebelumnya selesai dan terverifikasi.
3. **Verification Gate:** Sebelum menandai suatu phase selesai atau berpindah phase, wajib menjalankan pengujian sesuai Verification Gate di phase terkait (unit test engine, schema database, format layout).
4. **Update Status Board:** Perbarui checkbox dan status phase di [PHASES.md](file:///home/adly/Projects/kal-ordexa/PHASES.md) secara transparan seiring progres pengerjaan.
