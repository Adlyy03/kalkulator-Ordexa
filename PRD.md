# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# ORDEXA BUSINESS CALCULATOR

**Product:** ORDEXA Business Calculator  
**Platform:** Android & iOS  
**Product Type:** Internal Business Financial Planning & Simulation App  
**Version:** 1.0  
**Status:** Development Specification  
**Primary Language:** Bahasa Indonesia  
**Currency:** Indonesian Rupiah (IDR)

---

# 1. PRODUCT OVERVIEW

## 1.1 Deskripsi Produk

ORDEXA Business Calculator adalah aplikasi mobile untuk membantu founder ORDEXA menghitung, memantau, menganalisis, dan menyimulasikan kondisi finansial bisnis ORDEXA.

Aplikasi ini dirancang untuk menghitung seluruh aspek keuangan bisnis SaaS, mulai dari modal awal, biaya operasional, pendapatan berlangganan restoran, biaya payment gateway, keuntungan, hingga proyeksi pertumbuhan bisnis.

Aplikasi harus memiliki sistem perhitungan otomatis dan interaktif. Setiap perubahan angka pada input harus langsung memperbarui hasil kalkulasi.

## 1.2 Tujuan Produk

1. Menghitung estimasi pendapatan ORDEXA.
2. Menghitung seluruh biaya operasional.
3. Menghitung keuntungan dan kerugian bisnis.
4. Mengetahui titik impas atau Break Even Point.
5. Menghitung kebutuhan modal awal.
6. Menyimulasikan pertumbuhan jumlah restoran.
7. Mengukur profitabilitas setiap paket berlangganan.
8. Menyediakan analisis kondisi bisnis secara keseluruhan.
9. Membantu pengambilan keputusan berdasarkan data finansial.

## 1.3 Target Pengguna

Pengguna utama:
- Founder ORDEXA.
- Business owner.
- Business development.
- Financial planner internal.

Aplikasi bersifat internal dan tidak ditujukan untuk restoran pelanggan ORDEXA.

---

# 2. TECHNOLOGY STACK

## 2.1 Teknologi Utama

| Komponen | Teknologi |
|---|---|
| Mobile Framework | React Native |
| Framework Runtime | Expo |
| Programming Language | TypeScript |
| UI Styling | NativeWind |
| Navigation | Expo Router |
| State Management | Zustand |
| Form Validation | Zod |
| Local Database | Expo SQLite |
| Lightweight Preferences | AsyncStorage |
| Charts | Victory Native |
| Date Handling | date-fns |
| PDF Export | Expo Print |
| Excel/CSV Export | CSV Generator |
| Icon | Lucide Icons |
| Build Android/iOS | Expo EAS |

## 2.2 Arsitektur Sistem

Aplikasi menggunakan pendekatan Local-First Architecture.

Artinya:
- Seluruh perhitungan dilakukan langsung di perangkat.
- Tidak membutuhkan backend untuk MVP.
- Data disimpan secara lokal.
- Aplikasi dapat digunakan tanpa internet.
- Tidak membutuhkan akun pengguna untuk MVP.

## 2.3 Sistem Perhitungan

Semua kalkulasi wajib menggunakan TypeScript.

Buat calculation engine terpisah dari UI agar:
- Formula mudah diperbaiki.
- Perhitungan dapat diuji.
- Tidak ada duplikasi formula.
- Hasil konsisten di seluruh halaman.

Gunakan tipe data angka untuk perhitungan dan lakukan pembulatan hanya pada hasil tampilan.

---

# 3. APPLICATION STRUCTURE

Aplikasi memiliki navigasi utama berikut:

1. Dashboard
2. Revenue Calculator
3. Subscription Calculator
4. Expense Calculator
5. Profit & Loss
6. Break Even Calculator
7. Growth Simulator
8. Scenario Simulator
9. Investment & ROI
10. Financial Reports
11. Settings

Bottom Navigation:
- Home
- Calculator
- Simulation
- Reports
- Settings

---

# 4. DASHBOARD

## 4.1 Tujuan

Menampilkan ringkasan kondisi finansial ORDEXA dalam satu halaman.

## 4.2 Komponen Dashboard

### Financial Overview

Tampilkan:
- Total Monthly Revenue.
- Total Monthly Expenses.
- Gross Profit.
- Net Profit.
- Total Active Restaurants.
- Monthly Recurring Revenue (MRR).
- Annual Recurring Revenue (ARR).
- Break Even Status.

### Financial Charts

Grafik:
- Revenue vs Expenses.
- Monthly Net Profit.
- Restaurant Growth.
- Revenue Growth.
- Profit Margin.

### Business Health Indicator

Status kondisi bisnis:

- Profitable: Pendapatan melebihi total biaya.
- Break Even: Pendapatan sama dengan total biaya.
- Loss: Pendapatan lebih kecil dari total biaya.

### Quick Actions

- Add Restaurant.
- Calculate Revenue.
- Add Expense.
- Run Simulation.
- View Financial Report.

## 4.3 Dashboard Behavior

Semua angka pada dashboard harus diperbarui otomatis berdasarkan data kalkulator dan data simulasi yang aktif.

Dashboard harus menampilkan periode analisis yang jelas.

---

# 5. REVENUE CALCULATOR

## 5.1 Tujuan

Menghitung seluruh potensi pendapatan ORDEXA dari restoran yang berlangganan.

## 5.2 Input Variables

- Jumlah restoran.
- Jumlah restoran pada setiap paket.
- Harga setiap paket.
- Pendapatan tambahan.
- Diskon berlangganan.
- Periode pembayaran.

## 5.3 Subscription Packages

Sediakan paket yang bisa dikustomisasi.

Contoh default:

| Paket | Harga/Bulan |
|---|---:|
| Basic | Rp99.000 |
| Pro | Rp199.000 |
| Enterprise | Rp399.000 |

Seluruh harga harus bisa diedit melalui Settings.

## 5.4 Formula

Pendapatan Basic:

Basic Revenue = Basic Restaurants × Basic Price

Pendapatan Pro:

Pro Revenue = Pro Restaurants × Pro Price

Pendapatan Enterprise:

Enterprise Revenue = Enterprise Restaurants × Enterprise Price

Total MRR:

MRR = Basic Revenue + Pro Revenue + Enterprise Revenue + Other Recurring Revenue

ARR:

ARR = MRR × 12

Total Active Restaurants:

Total Restaurants = Basic + Pro + Enterprise

## 5.5 Output

- Revenue per package.
- Total MRR.
- Estimated ARR.
- Total active restaurants.
- Average Revenue Per Restaurant (ARPA).
- Revenue distribution per package.

## 5.6 Interactive Features

- Tambah dan hapus paket.
- Edit harga paket.
- Edit jumlah pelanggan.
- Simulasi perubahan harga.
- Grafik kontribusi setiap paket.

---

# 6. SUBSCRIPTION CALCULATOR

## 6.1 Tujuan

Menghitung performa model bisnis berlangganan ORDEXA.

## 6.2 Input

- Total pelanggan.
- Pelanggan baru.
- Pelanggan yang berhenti berlangganan.
- Harga paket.
- Periode berlangganan.
- Persentase pelanggan yang upgrade.
- Persentase pelanggan yang downgrade.

## 6.3 Formula

Net Customer Growth:

Net Growth = New Customers - Churned Customers

Ending Customers:

Ending Customers = Starting Customers + New Customers - Churned Customers

Customer Churn Rate:

Churn Rate = Churned Customers / Starting Customers × 100%

ARPA:

ARPA = MRR / Active Paying Restaurants

Revenue Churn:

Revenue Churn = Lost MRR / Starting MRR × 100%

## 6.4 Output

- Total pelanggan aktif.
- Pelanggan baru.
- Pelanggan berhenti.
- Customer churn rate.
- Revenue churn rate.
- ARPA.
- Net customer growth.

Catatan: Pisahkan pelanggan aktif, trial, gratis, dan pelanggan berbayar agar perhitungan MRR tidak salah.

---

# 7. EXPENSE CALCULATOR

## 7.1 Tujuan

Menghitung seluruh pengeluaran bisnis ORDEXA.

## 7.2 Kategori Pengeluaran

### A. Infrastructure Cost

- Server.
- Database.
- Cloud storage.
- CDN.
- Domain.
- SSL.
- Monitoring.
- Backup.

### B. Payment Gateway Cost

- Biaya transaksi.
- Persentase MDR.
- Biaya transaksi tetap.
- Biaya pencairan dana.
- Biaya refund.
- Biaya layanan payment gateway.

### C. Development Cost

- Developer.
- AI API.
- Software subscription.
- Maintenance.
- Bug fixing.
- Testing.

### D. Marketing Cost

- Advertising.
- Social media.
- Content production.
- Influencer.
- Promotion.
- Customer acquisition.

### E. Operational Cost

- Customer support.
- Internet.
- Administrasi.
- Transportasi.
- Komunikasi.
- Biaya legal.

### F. Other Expenses

Kategori pengeluaran tambahan yang dapat dibuat sendiri.

## 7.3 Expense Classification

Setiap pengeluaran harus memiliki klasifikasi:

1. Fixed Cost.
2. Variable Cost.
3. One-Time Cost.
4. Recurring Cost.

## 7.4 Formula

Total Fixed Cost:

Fixed Cost = Sum of All Fixed Expenses

Total Variable Cost:

Variable Cost = Sum of All Variable Expenses

Total Monthly Expenses:

Total Expenses = Fixed Cost + Variable Cost

Total Operating Cost:

Operating Cost = Total Monthly Expenses + Other Operating Expenses

## 7.5 Output

- Total fixed cost.
- Total variable cost.
- Total monthly expenses.
- Total annual expenses.
- Expense breakdown.
- Expense distribution chart.

## 7.6 Interactive Features

- Tambah pengeluaran.
- Edit pengeluaran.
- Hapus pengeluaran.
- Pilih kategori.
- Atur biaya bulanan atau tahunan.
- Atur biaya berdasarkan jumlah pelanggan.
- Duplikasi pengeluaran.
- Riwayat pengeluaran.

---

# 8. PAYMENT GATEWAY CALCULATOR

## 8.1 Tujuan

Menghitung biaya transaksi yang harus dibayarkan ORDEXA kepada payment gateway.

Payment gateway harus dipisahkan dari payment gateway yang digunakan oleh masing-masing restoran jika model bisnisnya berbeda.

## 8.2 Input

- Nama payment gateway.
- Metode pembayaran.
- Persentase biaya transaksi.
- Biaya tetap per transaksi.
- Jumlah transaksi.
- Rata-rata nilai transaksi.
- Persentase transaksi berhasil.
- Biaya tambahan lainnya.

## 8.3 Formula

Successful Transactions:

Successful Transactions = Total Transactions × Success Rate

Gross Transaction Volume:

GTV = Successful Transactions × Average Transaction Value

Percentage Fee:

Percentage Fee = GTV × MDR Percentage

Fixed Fee:

Fixed Fee = Successful Transactions × Fixed Transaction Fee

Total Gateway Fee:

Gateway Fee = Percentage Fee + Fixed Fee + Additional Fees

## 8.4 Output

- Total transaction volume.
- Successful transactions.
- Failed transactions.
- Percentage fee.
- Fixed fee.
- Total payment gateway cost.
- Effective transaction fee.

## 8.5 Important Rules

- Setiap payment gateway memiliki konfigurasi biaya sendiri.
- MDR tidak boleh diasumsikan sama untuk seluruh metode pembayaran.
- Fee dapat dikonfigurasi apakah ditanggung ORDEXA atau restoran.
- Perhitungan harus mempertimbangkan biaya refund jika berlaku.
- Pajak atas biaya gateway harus dapat dikonfigurasi berdasarkan invoice penyedia.

---

# 9. PROFIT & LOSS CALCULATOR

## 9.1 Tujuan

Menghitung kondisi laba dan rugi ORDEXA.

## 9.2 Input

Data diambil otomatis dari:
- Revenue Calculator.
- Expense Calculator.
- Payment Gateway Calculator.
- Other Income.

## 9.3 Formula

Gross Profit:

Gross Profit = Revenue - Direct Costs

Operating Profit:

Operating Profit = Gross Profit - Operating Expenses

Net Profit:

Net Profit = Total Revenue - Total Expenses

Net Profit Margin:

Net Profit Margin = Net Profit / Total Revenue × 100%

Gross Profit Margin:

Gross Profit Margin = Gross Profit / Revenue × 100%

Jika Revenue = 0, margin ditampilkan sebagai N/A agar tidak terjadi pembagian dengan nol.

## 9.4 Output

- Total Revenue.
- Direct Costs.
- Gross Profit.
- Operating Expenses.
- Operating Profit.
- Net Profit.
- Gross Profit Margin.
- Net Profit Margin.

## 9.5 Financial Status

- PROFIT: Net Profit positif.
- BREAK EVEN: Net Profit nol.
- LOSS: Net Profit negatif.

Semua komponen harus dapat ditelusuri ke sumber perhitungannya.

---

# 10. BREAK EVEN CALCULATOR

## 10.1 Tujuan

Mengetahui jumlah minimum restoran berbayar yang diperlukan agar ORDEXA mencapai titik impas.

## 10.2 Input

- Fixed Cost.
- Harga rata-rata paket.
- Variable Cost per Restaurant.
- Payment Gateway Cost per Restaurant.
- Pendapatan tambahan per restoran.

## 10.3 Formula

Contribution Margin per Restaurant:

Contribution Margin = ARPA - Variable Cost per Restaurant

Break Even Restaurants:

BEP = Fixed Cost / Contribution Margin per Restaurant

Pembulatan jumlah restoran menggunakan pembulatan ke atas.

Break Even Revenue:

BEP Revenue = BEP Restaurants × ARPA

## 10.4 Output

- Minimum restoran untuk break even.
- Minimum monthly revenue.
- Current restaurant count.
- Selisih pelanggan menuju BEP.
- Progress menuju BEP.
- Estimasi waktu mencapai BEP.

Jika contribution margin nol atau negatif, sistem harus menyatakan bahwa BEP tidak dapat dicapai dengan struktur biaya saat ini.

---

# 11. GROWTH SIMULATOR

## 11.1 Tujuan

Menyimulasikan pertumbuhan ORDEXA dalam jangka waktu tertentu.

## 11.2 Input

- Starting Restaurants.
- New Restaurants per Month.
- Monthly Churn Rate.
- Average Subscription Price.
- Package Distribution.
- Monthly Expense Growth.
- Marketing Budget.
- Customer Acquisition Cost (CAC).

## 11.3 Formula

Monthly Customer Growth:

Ending Customers = Starting Customers + New Customers - Churned Customers

Churned Customers:

Churned Customers = Starting Customers × Churn Rate

Revenue:

Revenue = Ending Customers × ARPA

CAC:

CAC = Acquisition Marketing Cost / New Paying Customers

Customer Lifetime Value (LTV):

LTV = ARPA × Gross Margin Percentage / Monthly Customer Churn Rate

LTV:CAC Ratio:

LTV:CAC = LTV / CAC

Jika churn atau CAC tidak tersedia, LTV dan LTV:CAC ditampilkan sebagai N/A.

## 11.4 Simulation Period

Pengguna dapat memilih:

- 3 bulan.
- 6 bulan.
- 12 bulan.
- 24 bulan.
- 36 bulan.

## 11.5 Output

- Total restoran setiap bulan.
- MRR setiap bulan.
- Total expenses setiap bulan.
- Net profit setiap bulan.
- Cumulative revenue.
- Cumulative profit.
- Estimated break even month.
- Customer growth chart.

## 11.6 Simulation Behavior

Simulasi harus berjalan secara berurutan dari bulan pertama sampai periode terakhir.

Gunakan hasil akhir bulan sebelumnya sebagai starting point bulan berikutnya.

---

# 12. SCENARIO SIMULATOR

## 12.1 Tujuan

Membandingkan kemungkinan kondisi bisnis ORDEXA.

## 12.2 Scenario Types

### A. Pessimistic Scenario

- Pertumbuhan pelanggan rendah.
- Churn tinggi.
- Biaya marketing meningkat.
- Revenue growth lambat.

### B. Realistic Scenario

- Pertumbuhan pelanggan moderat.
- Churn normal.
- Pengeluaran sesuai estimasi.
- Revenue growth stabil.

### C. Optimistic Scenario

- Pertumbuhan pelanggan tinggi.
- Churn rendah.
- Akuisisi pelanggan lebih efisien.
- Revenue growth cepat.

## 12.3 Custom Variables

Semua parameter skenario harus dapat diedit.

Contoh:
- New Restaurants per Month.
- Churn Rate.
- ARPA.
- Marketing Cost.
- Infrastructure Cost.
- Operational Cost.

## 12.4 Output

Tampilkan perbandingan tiga skenario:

- Total restaurants.
- MRR.
- ARR.
- Total expenses.
- Net profit.
- BEP achievement.
- Cumulative cash flow.

Sediakan grafik perbandingan antar skenario.

Setiap skenario harus menggunakan salinan data simulasi tersendiri dan tidak boleh mengubah data utama.

---

# 13. INVESTMENT & ROI CALCULATOR

## 13.1 Tujuan

Menghitung kebutuhan modal dan tingkat pengembalian investasi ORDEXA.

## 13.2 Input

- Initial Development Cost.
- Initial Infrastructure Cost.
- Initial Marketing Cost.
- Legal Cost.
- Equipment Cost.
- Other Initial Investment.
- Monthly Net Profit.
- Investment Amount.

## 13.3 Formula

Total Initial Investment:

Initial Investment = Sum of All Initial Costs

ROI:

ROI = Net Profit / Investment Amount × 100%

Untuk analisis periode tertentu, gunakan cumulative net profit selama periode yang dipilih.

Payback Period:

Payback Period = Investment Amount / Average Monthly Net Cash Inflow

Jika arus kas bulanan berubah-ubah, gunakan simulasi cash flow kumulatif untuk menentukan bulan pengembalian modal.

## 13.4 Output

- Total initial investment.
- Total monthly capital requirement.
- ROI.
- Estimated payback period.
- Cumulative cash flow.
- Investment recovery status.

---

# 14. FINANCIAL REPORTS

## 14.1 Tujuan

Menyediakan laporan keuangan berdasarkan data kalkulasi ORDEXA.

## 14.2 Report Types

1. Monthly Financial Report.
2. Annual Financial Report.
3. Revenue Report.
4. Expense Report.
5. Profit & Loss Report.
6. Growth Report.
7. Scenario Comparison Report.
8. Investment Report.

## 14.3 Export Features

Format:
- PDF.
- CSV.
- Excel-compatible CSV.

## 14.4 Report Information

Setiap laporan harus mencantumkan:
- Nama laporan.
- Periode.
- Tanggal pembuatan.
- Total revenue.
- Total expenses.
- Net profit.
- Informasi pendukung sesuai jenis laporan.

---

# 15. SETTINGS

## 15.1 General Settings

- Business Name.
- Currency.
- Financial Year.
- Default Simulation Period.
- Number Formatting.

## 15.2 Subscription Settings

- Nama paket.
- Harga paket.
- Batasan paket.
- Status paket.
- Diskon.
- Billing Period.

## 15.3 Financial Settings

- Default Payment Gateway Fee.
- Tax Configuration.
- Default Operating Expenses.
- Default Growth Rate.
- Default Churn Rate.

## 15.4 Data Management

- Backup Data.
- Restore Data.
- Export All Data.
- Import Data.
- Reset Application Data.

Reset harus membutuhkan konfirmasi eksplisit sebelum menghapus data.

---

# 16. UI/UX REQUIREMENTS

## 16.1 Design Direction

Desain aplikasi harus:
- Modern.
- Minimalist.
- Professional.
- Clean.
- Mobile-first.
- Mudah digunakan.
- Berorientasi pada data finansial.

## 16.2 Dashboard Design

Prioritaskan:
- Angka finansial utama.
- Grafik sederhana.
- Ringkasan profit.
- Informasi BEP.
- Quick Actions.

## 16.3 Calculator Design

Setiap kalkulator memiliki:
- Judul.
- Deskripsi singkat.
- Input fields.
- Perhitungan otomatis.
- Hasil utama.
- Detail formula.
- Grafik jika relevan.

## 16.4 Interaction

- Input angka menggunakan numeric keyboard.
- Format Rupiah otomatis.
- Hasil kalkulasi diperbarui saat input berubah.
- Validasi input secara langsung.
- Loading hanya jika ada operasi yang memang membutuhkan waktu.
- Konfirmasi sebelum menghapus data.

## 16.5 Responsive Design

Optimalkan untuk:
- Android smartphone.
- iPhone.
- Berbagai ukuran layar.
- Orientasi portrait.

---

# 17. DATABASE DESIGN

Gunakan SQLite untuk penyimpanan lokal.

## 17.1 Tables

### business_settings
- id
- business_name
- currency
- created_at
- updated_at

### subscription_packages
- id
- package_name
- monthly_price
- annual_price
- is_active
- created_at
- updated_at

### restaurants
- id
- restaurant_name
- package_id
- subscription_status
- start_date
- created_at
- updated_at

### revenue_records
- id
- period
- package_id
- restaurant_count
- revenue_amount
- created_at

### expense_categories
- id
- category_name
- category_type

### expenses
- id
- expense_name
- category_id
- amount
- expense_type
- frequency
- effective_date
- created_at
- updated_at

### payment_gateway_settings
- id
- gateway_name
- payment_method
- percentage_fee
- fixed_fee
- fee_bearer
- created_at
- updated_at

### simulations
- id
- simulation_name
- scenario_type
- simulation_period
- input_data_json
- result_data_json
- created_at

### financial_snapshots
- id
- period
- revenue
- expenses
- profit
- restaurant_count
- created_at

## 17.2 Data Integrity

- Gunakan ID unik.
- Gunakan transaksi database saat menyimpan beberapa data terkait.
- Validasi foreign key.
- Jangan menyimpan hasil kalkulasi sebagai satu-satunya sumber data.
- Simpan input dan snapshot hasil simulasi agar laporan historis dapat direproduksi.

---

# 18. BUSINESS LOGIC & CALCULATION RULES

Seluruh kalkulasi harus mengikuti ketentuan berikut:

1. Gunakan IDR sebagai mata uang default.
2. Input angka negatif ditolak untuk jumlah pelanggan, harga, dan biaya normal.
3. Nilai persentase dibatasi 0–100%.
4. Pembagian dengan nol harus ditangani.
5. Gunakan decimal-safe calculation untuk perhitungan finansial.
6. Jangan melakukan pembulatan terlalu awal.
7. Hasil perhitungan harus konsisten pada semua halaman.
8. Semua simulasi harus menggunakan asumsi yang terlihat oleh pengguna.
9. Perubahan asumsi tidak boleh mengubah histori laporan yang sudah disimpan.
10. Semua periode keuangan harus memiliki definisi yang konsisten.

## 18.1 Important Financial Distinction

Pisahkan:

- Revenue: Pendapatan bisnis.
- Gross Transaction Volume: Nilai transaksi yang diproses.
- Gateway Fee: Biaya pemrosesan pembayaran.
- Operating Expense: Pengeluaran operasional.
- Net Profit: Laba setelah seluruh biaya yang relevan.
- Cash Flow: Arus uang masuk dan keluar.

Jangan menghitung seluruh nilai transaksi QRIS restoran sebagai revenue ORDEXA jika dana tersebut sebenarnya milik restoran.

## 18.2 Tax Handling

Sediakan konfigurasi pajak yang fleksibel.

Jangan mengasumsikan satu tarif pajak berlaku untuk seluruh biaya dan pendapatan.

Pajak dapat dicatat secara terpisah sesuai perlakuan akuntansi dan invoice aktual.

---

# 19. NON-FUNCTIONAL REQUIREMENTS

## 19.1 Performance

- Dashboard tampil cepat.
- Perhitungan sederhana berjalan langsung.
- Input tidak menyebabkan UI freeze.
- Simulasi 36 bulan harus berjalan dengan lancar.
- Grafik tidak boleh menghambat navigasi.

## 19.2 Security

- Data lokal tidak boleh terekspos melalui log.
- Gunakan secure storage untuk informasi sensitif jika kelak diperlukan.
- Tidak menyimpan password atau credential payment gateway.
- Validasi semua input.
- Backup dapat diekspor secara aman.

## 19.3 Reliability

- Data tidak hilang ketika aplikasi ditutup.
- Aplikasi dapat digunakan offline.
- Database harus memiliki mekanisme backup.
- Penanganan error harus jelas.

## 19.4 Maintainability

- Pisahkan UI, business logic, database, dan calculation engine.
- Gunakan reusable components.
- Gunakan TypeScript strict mode.
- Gunakan automated tests untuk formula finansial.

---

# 20. TESTING REQUIREMENTS

## 20.1 Unit Testing

Setiap formula wajib diuji.

Contoh:

Revenue:
10 restoran × Rp199.000 = Rp1.990.000.

Expenses:
Fixed Cost Rp2.000.000 + Variable Cost Rp500.000 = Rp2.500.000.

Net Profit:
Revenue Rp5.000.000 - Expenses Rp3.000.000 = Rp2.000.000.

BEP:
Fixed Cost Rp2.000.000 / Contribution Margin Rp100.000 = 20 restoran.

## 20.2 Edge Case Testing

Uji:
- Revenue nol.
- Expenses nol.
- Pelanggan nol.
- Churn 100%.
- Contribution margin negatif.
- Harga paket nol.
- Transaksi gagal.
- Data kosong.
- Input persentase di luar batas.
- Simulasi dengan jumlah pelanggan pecahan akibat churn.

## 20.3 UI Testing

- Semua tombol berfungsi.
- Navigasi berfungsi.
- Input dapat diedit.
- Grafik mengikuti data.
- Export menghasilkan file valid.
- Data tetap tersimpan setelah aplikasi ditutup.

---

# 21. MVP DEVELOPMENT PRIORITY

## Phase 1 — Core MVP

Prioritas utama:

1. Dashboard.
2. Revenue Calculator.
3. Subscription Calculator.
4. Expense Calculator.
5. Payment Gateway Calculator.
6. Profit & Loss Calculator.
7. Break Even Calculator.
8. Local Database.
9. Settings.

## Phase 2 — Business Intelligence

1. Growth Simulator.
2. Scenario Simulator.
3. Investment & ROI.
4. Financial Reports.
5. PDF/CSV Export.
6. Financial Charts.

## Phase 3 — Advanced Features

1. Cloud Backup.
2. Multi-device Synchronization.
3. Authentication.
4. Historical Financial Analysis.
5. Advanced Forecasting.
6. Multi-business Support.

---

# 22. ACCEPTANCE CRITERIA

Aplikasi dinyatakan memenuhi kebutuhan MVP apabila:

- Seluruh kalkulator utama berfungsi.
- Formula telah melewati unit testing.
- Perubahan input langsung memperbarui hasil.
- Data tersimpan secara lokal.
- Dashboard mengambil data dari sumber yang konsisten.
- Seluruh biaya dapat dikategorikan.
- Biaya payment gateway dapat dihitung berdasarkan metode pembayaran.
- Profit dan loss dapat diketahui.
- Break Even Point dapat dihitung.
- Aplikasi dapat digunakan tanpa internet.
- Tidak ada data simulasi yang menimpa data utama.
- UI berjalan baik di Android dan iOS.

---

# 23. FINAL PRODUCT VISION

ORDEXA Business Calculator bukan sekadar kalkulator matematika.

Aplikasi ini harus menjadi alat pengambilan keputusan finansial untuk ORDEXA.

Founder dapat mengetahui:

- Berapa modal yang dibutuhkan untuk membangun ORDEXA.
- Berapa biaya untuk menjalankan ORDEXA.
- Berapa restoran yang harus berlangganan.
- Paket mana yang paling menguntungkan.
- Berapa pendapatan bulanan yang dapat dihasilkan.
- Berapa keuntungan bersih.
- Kapan bisnis mencapai Break Even Point.
- Bagaimana kondisi bisnis dalam 12–36 bulan.
- Apakah bisnis layak dikembangkan berdasarkan proyeksi finansial.

**CORE PRINCIPLE:**

Setiap angka harus memiliki sumber, setiap formula harus dapat ditelusuri, dan setiap simulasi harus berdasarkan asumsi yang dapat diubah pengguna.

**END OF PRD — ORDEXA BUSINESS CALCULATOR V1.0**
