# ORDEXA BUSINESS CALCULATOR
# DESIGN SYSTEM — design.md

**Version:** 1.0  
**Platform:** Android & iOS  
**Design Style:** Neubrutalism + Glassmorphism  
**Primary Language:** Bahasa Indonesia  
**Design Priority:** Mobile-First

---

# 1. DESIGN VISION

## 1.1 Design Concept

ORDEXA Business Calculator menggunakan perpaduan dua pendekatan visual:

**Neubrutalism**
- Bold typography.
- Strong black outlines.
- High contrast.
- Hard shadows.
- Geometric components.
- Solid color surfaces.
- Distinctive buttons and cards.

**Glassmorphism**
- Translucent surfaces.
- Subtle background blur.
- Layered interface.
- Soft transparency.
- Light reflections.
- Floating navigation elements.

## 1.2 Design Philosophy

Antarmuka harus memberikan kesan:

- Modern.
- Premium.
- Bold.
- Clean.
- Professional.
- Interactive.
- Futuristic.
- Easy to understand.

Neubrutalism menjadi identitas visual utama, sedangkan Glassmorphism digunakan sebagai elemen pendukung untuk menciptakan kedalaman visual.

Hindari penggunaan efek glass secara berlebihan sehingga angka finansial tetap mudah dibaca.

---

# 2. COLOR SYSTEM

Gunakan palet warna yang konsisten di seluruh aplikasi.

## 2.1 Primary Colors

| Token | Color | Hex |
|---|---|---|
| Primary | Electric Purple | #8B5CF6 |
| Secondary | Soft Lavender | #C4B5FD |
| Accent | Neon Lime | #C6F66A |
| Background | Warm Off-White | #F5F3EE |
| Surface | White | #FFFFFF |
| Dark | Deep Black | #171717 |

## 2.2 Financial Colors

| Purpose | Color | Hex |
|---|---|---|
| Profit | Lime Green | #A3E635 |
| Loss | Coral Red | #FF6B6B |
| Warning | Amber | #FBBF24 |
| Neutral | Slate Gray | #94A3B8 |
| Information | Blue | #60A5FA |

## 2.3 Color Usage Rules

- Purple digunakan sebagai identitas utama ORDEXA.
- Lime digunakan untuk menonjolkan angka positif dan CTA.
- Black digunakan untuk outline dan typography.
- Off-white menjadi background utama.
- Coral digunakan untuk kondisi kerugian.
- White digunakan untuk card surfaces.

Jangan menggunakan seluruh warna sekaligus dalam satu komponen.

---

# 3. TYPOGRAPHY

## 3.1 Font Family

Primary Font: **Plus Jakarta Sans**

Alternative: Inter.

## 3.2 Typography Hierarchy

| Element | Size | Weight |
|---|---|---|
| Dashboard Heading | 28px | ExtraBold |
| Page Heading | 24px | ExtraBold |
| Section Heading | 18px | Bold |
| Card Title | 15px | Bold |
| Body Text | 14px | Medium |
| Caption | 12px | Medium |
| Financial Number | 28–36px | ExtraBold |
| Button Text | 14px | Bold |

## 3.3 Typography Rules

- Gunakan typography bold untuk angka finansial utama.
- Gunakan hierarchy yang jelas.
- Hindari font terlalu kecil.
- Gunakan tabular numbers untuk angka finansial.
- Format mata uang menggunakan format Rupiah Indonesia.

Contoh:

Rp12.500.000

---

# 4. NEUBRUTALISM DESIGN SYSTEM

## 4.1 Border

Komponen utama menggunakan outline tegas.

- Border color: #171717.
- Border width: 2px.
- Border radius: 14–18px.

Jangan menggunakan outline pada setiap elemen kecil. Prioritaskan card, button, modal, dan komponen penting.

## 4.2 Shadow

Gunakan hard shadow tanpa blur.

Default shadow:

- X: 4px.
- Y: 4px.
- Blur: 0px.
- Color: #171717.

Untuk komponen besar:

- X: 5px.
- Y: 5px.
- Blur: 0px.

## 4.3 Buttons

Primary Button:
- Background: #8B5CF6.
- Text: #FFFFFF.
- Border: 2px solid #171717.
- Border radius: 12px.
- Hard shadow: 4px 4px #171717.
- Font weight: Bold.

Secondary Button:
- Background: #FFFFFF.
- Text: #171717.
- Border: 2px solid #171717.

Button Interaction:
- Saat ditekan, tombol bergerak 2–4px ke kanan dan bawah.
- Shadow berkurang.
- Gunakan transisi cepat.

## 4.4 Cards

Default Card:
- Background: #FFFFFF.
- Border: 2px solid #171717.
- Border radius: 16px.
- Padding: 16px.
- Shadow: 4px 4px #171717.

Featured Card:
- Background: #8B5CF6.
- Text: #FFFFFF.
- Border: 2px solid #171717.
- Shadow: 5px 5px #171717.

---

# 5. GLASSMORPHISM DESIGN SYSTEM

Glass effect digunakan untuk elemen yang membutuhkan visual layering.

## 5.1 Glass Surface

Light Glass:
- Background: rgba(255,255,255,0.72).
- Border: 1px solid rgba(255,255,255,0.8).
- Blur: 16px.
- Border radius: 18px.

Dark Glass:
- Background: rgba(23,23,23,0.78).
- Border: 1px solid rgba(255,255,255,0.12).
- Blur: 16px.
- Text: #FFFFFF.

## 5.2 Glass Usage

Gunakan glass effect pada:

- Floating Bottom Navigation.
- Modal Overlay.
- Floating Action Panel.
- Filter Dropdown.
- Context Menu.
- Dashboard Floating Elements.

Jangan menggunakan glass effect sebagai default untuk semua card.

## 5.3 Glass Background

Gunakan background dengan dekorasi visual sederhana:

- Soft purple gradient.
- Subtle lime accents.
- Abstract blurred circles.
- Low-opacity geometric shapes.

Background tidak boleh mengganggu keterbacaan data.

---

# 6. SPACING & LAYOUT

## 6.1 Spacing Scale

| Token | Value |
|---|---|
| XS | 4px |
| SM | 8px |
| MD | 12px |
| LG | 16px |
| XL | 24px |
| 2XL | 32px |
| 3XL | 40px |

## 6.2 Mobile Layout

- Screen horizontal padding: 20px.
- Card spacing: 16px.
- Section spacing: 24px.
- Bottom navigation height: 72–84px.
- Minimum touch target: 44px.
- Safe area harus diperhatikan.

Gunakan satu kolom sebagai layout utama.

Untuk data finansial, gunakan dua kolom hanya jika angka tetap terbaca dengan baik.

---

# 7. COMPONENT DESIGN

## 7.1 Financial Summary Card

Menampilkan:
- Label finansial.
- Nilai utama.
- Persentase perubahan.
- Icon.
- Trend indicator.

Style:
- White background.
- Black border.
- Hard shadow.
- Bold number.

## 7.2 Calculator Input

Input:
- White background.
- Black border.
- Radius 12px.
- Padding 14px.
- Numeric keyboard.
- Currency formatting.

Focus State:
- Purple border.
- Soft purple background.
- Clear active indicator.

## 7.3 Result Card

Hasil perhitungan harus menjadi fokus utama.

Style:
- Purple atau lime background.
- Bold typography.
- Strong outline.
- Hard shadow.

Tampilkan formula atau penjelasan singkat di bawah hasil utama.

## 7.4 Charts

Gunakan grafik yang minimalis dan mudah dibaca.

Style:
- White card background.
- Black outline.
- Rounded chart container.
- Minimal grid lines.
- Clear labels.
- Consistent financial colors.

Jenis grafik:
- Line Chart.
- Bar Chart.
- Donut Chart.
- Area Chart.

Jangan menggunakan terlalu banyak warna dalam satu grafik.

## 7.5 Modal & Bottom Sheet

- Glass overlay.
- White modal surface.
- Black border.
- Rounded corners.
- Hard shadow.
- Clear close button.

---

# 8. SCREEN DESIGN SPECIFICATIONS

## 8.1 Splash Screen

Elements:
- ORDEXA Logo.
- App Name.
- Minimal geometric background.
- Purple primary surface.

Style:
- Bold.
- Minimal.
- High contrast.

## 8.2 Dashboard Screen

Layout:

1. Header greeting.
2. Current financial period.
3. Main Revenue Card.
4. Net Profit Card.
5. Expenses Card.
6. Active Restaurants Card.
7. Revenue vs Expenses Chart.
8. Break Even Progress.
9. Quick Actions.

Main Revenue Card harus menjadi visual utama.

Gunakan purple surface dengan angka besar berwarna putih.

Net Profit dapat menggunakan lime jika positif dan coral jika negatif.

## 8.3 Calculator Screen

Layout:

1. Page Header.
2. Calculator Category.
3. Input Fields.
4. Live Calculation Result.
5. Formula Explanation.
6. Related Financial Metrics.

Gunakan struktur konsisten di seluruh kalkulator.

## 8.4 Revenue Calculator Screen

Tampilkan:
- Paket Basic.
- Paket Pro.
- Paket Enterprise.
- Jumlah restoran per paket.
- Harga per paket.
- Revenue per paket.
- Total MRR.
- Estimated ARR.

Gunakan package cards yang dapat diedit.

## 8.5 Expense Calculator Screen

Tampilkan:
- Total Monthly Expenses.
- Fixed Costs.
- Variable Costs.
- One-Time Costs.
- Expense Categories.
- Add Expense Button.
- Expense Breakdown Chart.

## 8.6 Profit & Loss Screen

Tampilkan:
- Total Revenue.
- Direct Costs.
- Gross Profit.
- Operating Expenses.
- Net Profit.
- Profit Margin.

Gunakan visual hierarchy yang kuat untuk Net Profit.

## 8.7 Break Even Screen

Tampilkan:
- Current Restaurants.
- Target Restaurants.
- Required Additional Restaurants.
- BEP Progress Bar.
- Break Even Revenue.
- Contribution Margin.

Gunakan progress visualization yang jelas.

## 8.8 Growth Simulator Screen

Tampilkan:
- Simulation Period.
- Starting Restaurants.
- Monthly Acquisition.
- Churn Rate.
- ARPA.
- Expense Growth.
- Simulation Result.

Hasil:
- Customer Growth Chart.
- Revenue Growth Chart.
- Profit Projection Chart.

## 8.9 Scenario Simulator Screen

Gunakan tiga scenario cards:

Pessimistic:
- Coral accent.

Realistic:
- Purple accent.

Optimistic:
- Lime accent.

Tampilkan perbandingan:
- Revenue.
- Expenses.
- Net Profit.
- Total Restaurants.
- Break Even Achievement.

## 8.10 Reports Screen

Tampilkan:
- Report Categories.
- Date Filters.
- Financial Summary.
- Export PDF.
- Export CSV.

## 8.11 Settings Screen

Tampilkan:
- Business Profile.
- Subscription Packages.
- Financial Configuration.
- Payment Gateway Configuration.
- Data Management.
- App Preferences.

---

# 9. NAVIGATION DESIGN

Gunakan floating bottom navigation dengan glassmorphism.

Navigation Items:

1. Home.
2. Calculator.
3. Simulation.
4. Reports.
5. Settings.

Design:
- Floating position.
- Translucent white background.
- Background blur.
- Thin border.
- Rounded pill container.
- Active icon menggunakan purple.
- Inactive icon menggunakan slate gray.

Pastikan navigation tidak menutupi konten utama dan mengikuti safe area perangkat.

---

# 10. ICONOGRAPHY

Gunakan Lucide Icons.

Style:
- Outline icons.
- Stroke width 2px.
- Consistent icon size.
- Avoid mixing icon styles.

Suggested Icons:

| Feature | Icon |
|---|---|
| Dashboard | LayoutDashboard |
| Revenue | TrendingUp |
| Expenses | Wallet |
| Profit | ChartNoAxesCombined |
| Calculator | Calculator |
| Growth | ChartLine |
| Simulation | SlidersHorizontal |
| Reports | FileChartColumn |
| Settings | Settings |
| Add | Plus |
| Edit | Pencil |
| Delete | Trash2 |
| Export | Download |

---

# 11. MICRO INTERACTIONS

Gunakan animasi ringan untuk meningkatkan pengalaman penggunaan.

- Card press animation.
- Button press animation.
- Smooth number transitions.
- Chart animation.
- Modal fade and slide.
- Bottom sheet slide.
- Tab transition.
- Progress bar animation.

Animation duration:
- Fast: 120ms.
- Normal: 200ms.
- Slow: 300ms.

Hindari animasi berlebihan.

Semua perubahan angka harus tetap akurat dan tidak menampilkan nilai sementara yang menyesatkan.

---

# 12. EMPTY STATES & ERROR STATES

## Empty State

Gunakan:
- Simple illustration atau icon.
- Short explanation.
- Clear CTA.

Contoh:

"Belum ada data pengeluaran."

CTA: "Tambah Pengeluaran"

## Error State

Gunakan:
- Coral accent.
- Clear error message.
- Action untuk memperbaiki input.

Contoh:

"Margin kontribusi tidak valid. Periksa kembali biaya variabel dan harga paket."

## Loading State

Gunakan skeleton loading hanya untuk proses yang benar-benar membutuhkan waktu.

Perhitungan lokal sederhana tidak membutuhkan loading screen.

---

# 13. ACCESSIBILITY

- Minimum touch target 44px.
- Kontras warna harus memadai.
- Jangan hanya menggunakan warna untuk membedakan profit dan loss.
- Gunakan label dan ikon pendukung.
- Semua input memiliki label.
- Hindari teks terlalu kecil.
- Pastikan angka finansial dapat dibaca dengan jelas.

---

# 14. DARK MODE

Sediakan dark mode sebagai opsi tambahan.

Dark Mode Palette:

| Token | Hex |
|---|---|
| Background | #111111 |
| Surface | #1E1E1E |
| Primary | #A78BFA |
| Accent | #C6F66A |
| Text | #FFFFFF |
| Muted Text | #A1A1AA |
| Border | #FFFFFF |

Pertahankan identitas Neubrutalism:
- Strong outlines.
- Hard shadows.
- Bold typography.

Glass surfaces harus menyesuaikan background dark mode.

---

# 15. IMPLEMENTATION RULES

Developer wajib mengikuti aturan berikut:

1. Gunakan design tokens untuk seluruh warna, typography, spacing, border, dan shadow.
2. Buat reusable UI components.
3. Jangan hardcode style berulang di setiap halaman.
4. Gunakan NativeWind untuk styling.
5. Gunakan React Native compatible blur implementation untuk glass effects.
6. Pastikan blur tidak mengganggu performa Android.
7. Gunakan fallback solid surface jika blur tidak didukung.
8. Prioritaskan readability daripada dekorasi.
9. Gunakan responsive layout.
10. Jangan mengubah formula atau business logic saat mengimplementasikan UI.
11. Semua komponen harus konsisten dengan design system.
12. Pastikan aplikasi tetap usable pada perangkat Android kelas menengah.

---

# 16. FINAL DESIGN PRINCIPLES

ORDEXA Business Calculator harus memiliki karakter visual yang kuat melalui perpaduan:

**NEUBRUTALISM**
- Bold.
- Geometric.
- High Contrast.
- Strong Borders.
- Hard Shadows.

**GLASSMORPHISM**
- Layered.
- Translucent.
- Soft Blur.
- Floating Elements.
- Subtle Depth.

**FINAL DESIGN DIRECTION:**

70% Neubrutalism + 30% Glassmorphism.

Neubrutalism membentuk identitas utama aplikasi, sedangkan Glassmorphism memberikan sentuhan modern dan premium.

Prioritas tertinggi tetap pada keterbacaan, kecepatan interaksi, konsistensi komponen, dan kemudahan memahami data finansial.

**END OF DESIGN SYSTEM — ORDEXA BUSINESS CALCULATOR V1.0**
