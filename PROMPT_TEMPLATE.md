# 🤖 Prompt Template: Sistem Manajemen Iuran/Pembayaran

> **Copy-paste prompt ini ke AI untuk membuat sistem serupa**

---

## 📋 Prompt Lengkap

```
Buatkan saya aplikasi web untuk tracking iuran/pembayaran dengan spesifikasi berikut:

## OVERVIEW
Aplikasi untuk mengelola pembayaran iuran bulanan dengan data source dari Google Sheets.
Target user: RT/RW, organisasi kecil, komunitas.
Requirement: Mudah diupdate non-teknis, mobile-friendly, gratis hosting.

## TECH STACK
- Frontend Framework: React 19 + Vite (Rolldown)
- Styling: Vanilla CSS (NO Tailwind, NO Bootstrap)
- Data Source: Google Sheets (CSV export via published URL)
- CSV Parser: Papaparse 5.5.3
- Validation: Zod 4.3.6
- Excel: XLSX 0.18.5 (untuk export/import)
- Fonts: Google Fonts (Inter, Poppins)
- Deployment: Netlify atau Vercel

## ARSITEKTUR

### Data Flow
1. User buka app → fetchGoogleSheetsData()
2. Check localStorage cache (TTL: 5 menit)
   - Valid → gunakan cache
   - Expired → fetch dari Google Sheets
3. Fetch CSV dari Google Sheets URL
   - Retry: 3x dengan exponential backoff (1s, 2s, 4s)
   - Timeout: 30 detik
4. Parse CSV dengan Papaparse
5. Validate dengan Zod schemas
6. Transform ke format app
7. Save ke localStorage cache
8. Update React state
9. Render UI

### File Structure
```
project/
├── src/
│   ├── components/
│   │   ├── Statistics.jsx         # Dashboard statistik
│   │   ├── Statistics.css
│   │   ├── PaymentTable.jsx       # Tabel pembayaran
│   │   ├── PaymentTable.css
│   │   ├── ExcelExport.jsx        # Export Excel
│   │   ├── ExcelImport.jsx        # Import Excel
│   │   └── ExcelImport.css
│   ├── data/
│   │   ├── googleSheets.js        # Data fetching + parsing
│   │   └── dataUtils.js           # Helper functions
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── netlify.toml
├── package.json
└── vite.config.js
```

## FITUR UTAMA

### 1. Dashboard Statistik (Statistics.jsx)
Tampilkan dalam grid 4 kolom (2 kolom di mobile):

**Card 1: Total Pemasukan**
- Icon: 💰
- Value: Format rupiah (Rp 2.110.000)
- Background: Gradient hijau

**Card 2: Pembayaran Lunas**
- Icon: ✅
- Value: Jumlah transaksi lunas
- Unit: "transaksi"
- Background: Gradient biru

**Card 3: Belum Lunas**
- Icon: ⏳
- Value: Jumlah transaksi belum lunas
- Unit: "transaksi"
- Background: Gradient kuning

**Card 4: Persentase Lunas**
- Icon: 📊
- Value: Persentase (10.9%)
- Progress bar dengan animasi
- Background: Gradient ungu

**Ringkasan Keuangan**
- Background: Gradient hijau gelap
- Grid 3 kolom (1 kolom di mobile)
- Item 1: Total Perbulan (hijau)
- Item 2: Uang Lelah 10% (merah, dengan minus)
- Item 3: Saldo Uang Kematian (kuning, highlight)

**Detail per Bulan (Expandable)**
- Button toggle: "Lihat Detail per Bulan"
- Grid 2 kolom di mobile (auto-fit di desktop)
- Per card bulan:
  - Nama bulan
  - Jumlah lunas (hijau)
  - Jumlah belum (merah)
  - Total pemasukan bulan itu

### 2. Tabel Pembayaran (PaymentTable.jsx)
**Layout:**
- Header: Nama Warga (sticky left) + Bulan (horizontal scroll)
- Body: Grid cells dengan status
- Visual: ✅ (hijau) untuk lunas, ❌ (merah) untuk belum

**Features:**
- Search box: Filter warga by nama/alias
- Responsive: Horizontal scroll di mobile
- Sticky header & first column
- Hover effects

### 3. Excel Export/Import
**Export (ExcelExport.jsx):**
- Button: "📥 Export ke Excel"
- Generate .xlsx file
- Include: Semua data warga + pembayaran

**Import (ExcelImport.jsx):**
- Drag & drop zone atau file picker
- Parse Excel → validate → update data
- Show preview sebelum import

## STYLING REQUIREMENTS

### Design System
**Colors:**
- Primary: #166534 (hijau gelap)
- Success: #22c55e (hijau)
- Warning: #f59e0b (kuning)
- Danger: #dc2626 (merah)
- Info: #3b82f6 (biru)
- Background: #f8fafc
- Text: #1f2937

**Typography:**
- Font: Inter (body), Poppins (headings)
- Mobile stat value: 11px (tablet), 10px (extra small)
- Desktop stat value: 26px
- Line height: 1.3
- Font weight: 800 untuk angka

**Components:**
- Border radius: 12-16px
- Box shadow: 0 4px 15px rgba(0,0,0,0.08)
- Padding card: 24px (desktop), 16px (mobile)
- Gap: 16px (desktop), 10px (mobile)

**Responsive:**
- Desktop: Grid 4 kolom untuk stats
- Tablet (768px): Grid 2 kolom
- Mobile (480px): Grid 2 kolom, font lebih kecil
- Extra small (380px): Grid 2 kolom, font minimal

**Animations:**
- Fade in up untuk cards (stagger 0.1s)
- Progress bar grow animation
- Hover: translateY(-4px) + shadow
- Transition: 0.3s ease

### Mobile-First Principles
1. **Typography:**
   - Angka rupiah HARUS lengkap dalam 1 baris
   - NO word break di angka
   - white-space: nowrap untuk currency
   - Font size disesuaikan agar muat

2. **Layout:**
   - Stats grid: 2 kolom di mobile
   - Monthly detail: Grid 2 kolom (NO horizontal scroll)
   - Cards wrap ke baris baru otomatis

3. **Touch-Friendly:**
   - Button min height: 44px
   - Padding cukup untuk tap
   - No hover-only interactions

## DATA MANAGEMENT

### Google Sheets Format
```
Row 1-5: Header info (tahun, dll)
Row 6: Column headers
  | No | Nama Warga | Januari | Februari | ... | Desember |

Row 7+: Data warga
  | 1 | John Doe (Alias) | 10000 | | 10000 | ... |

Bottom rows: Summary
  | Total Perbulan | | 2110000 |
  | Uang Lelah perbulan - 10% | | 211000 |
  | Saldo UANG KEMATIAN | | 1899000 |
```

### Data Parsing Logic (googleSheets.js)
```javascript
// 1. Find header row (contains "Nama Warga" + bulan names)
// 2. Parse warga data (stop at row 162 or summary rows)
// 3. Extract payment status per bulan
// 4. Parse summary data (total, uang lelah, saldo)
// 5. Validate with Zod schemas
// 6. Return: { wargaData, paymentData, tahun, ringkasan }
```

### Zod Schemas
```javascript
const WargaSchema = z.object({
  id: z.number().positive(),
  nama: z.string().min(1),
  alias: z.string(),
});

const PaymentSchema = z.object({
  lunas: z.boolean(),
  tanggalBayar: z.string().nullable(),
  jumlah: z.number().positive(),
});

const RingkasanSchema = z.object({
  totalPerbulan: z.number().nonnegative(),
  uangLelahPerbulan: z.number().nonnegative(),
  saldoUangKematian: z.number().nonnegative(),
});
```

### Cache Strategy
```javascript
const CACHE_KEY = 'app_data';
const CACHE_TIMESTAMP_KEY = 'app_data_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// getCachedData() - check timestamp, return if valid
// setCachedData() - save data + timestamp
// Fallback: use cache if fetch fails
```

### Error Handling
```javascript
// Retry with exponential backoff
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1s
const TIMEOUT = 30000; // 30s

// User-friendly error messages:
// - Timeout: "Koneksi terlalu lambat..."
// - 404: "Spreadsheet tidak ditemukan..."
// - 403: "Akses ditolak..."
// - Network: "Tidak dapat terhubung..."
```

## PERFORMANCE OPTIMIZATION

1. **Lazy Loading:**
   - React.lazy() untuk components besar
   - Suspense dengan loading state

2. **Memoization:**
   - useMemo untuk computed values
   - useCallback untuk event handlers

3. **Bundle Size:**
   - Tree shaking otomatis (Vite)
   - No unused dependencies

4. **Caching:**
   - localStorage untuk data
   - Service Worker (optional)

## DEPLOYMENT

### Environment Variables
```env
VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?gid=GID&single=true&output=csv
```

### Netlify Config (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vite Config
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    hmr: { overlay: true }
  }
})
```

## TESTING CHECKLIST

Manual testing yang harus dilakukan:

1. **Data Loading:**
   - [ ] Data muncul dari Google Sheets
   - [ ] Loading state tampil
   - [ ] Error handling works

2. **Statistics:**
   - [ ] Semua card tampil dengan benar
   - [ ] Angka rupiah lengkap (tidak terpotong)
   - [ ] Progress bar animated
   - [ ] Detail per bulan expandable

3. **Payment Table:**
   - [ ] Grid layout correct
   - [ ] Search/filter works
   - [ ] Visual indicators (✅/❌) correct
   - [ ] Horizontal scroll di mobile

4. **Excel:**
   - [ ] Export generates valid .xlsx
   - [ ] Import parses correctly

5. **Responsive:**
   - [ ] Desktop (1920px): 4 kolom
   - [ ] Tablet (768px): 2 kolom
   - [ ] Mobile (375px): 2 kolom, font kecil
   - [ ] Currency tidak terpotong di semua ukuran

6. **Performance:**
   - [ ] Cache works (check localStorage)
   - [ ] Retry on network error
   - [ ] Offline fallback

## DELIVERABLES

Buatkan file-file berikut:

1. **src/components/Statistics.jsx** - Dashboard component
2. **src/components/Statistics.css** - Styling dengan responsive breakpoints
3. **src/components/PaymentTable.jsx** - Tabel pembayaran
4. **src/components/PaymentTable.css** - Styling tabel
5. **src/components/ExcelExport.jsx** - Export functionality
6. **src/components/ExcelImport.jsx** - Import functionality
7. **src/data/googleSheets.js** - Data fetching + parsing logic
8. **src/data/dataUtils.js** - Helper functions (formatRupiah, dll)
9. **src/App.jsx** - Main app dengan state management
10. **src/App.css** - Global styles
11. **.env.example** - Environment template
12. **netlify.toml** - Deployment config
13. **README.md** - Documentation

## IMPORTANT NOTES

1. **NO Framework CSS**: Gunakan Vanilla CSS murni
2. **Mobile-First**: Design untuk mobile dulu, scale up ke desktop
3. **Currency Display**: Pastikan "Rp 2.110.000" LENGKAP dalam 1 baris
4. **Grid Layout**: Monthly cards HARUS grid 2 kolom, NO horizontal scroll
5. **Error Handling**: User-friendly messages, NO technical jargon
6. **Validation**: Zod untuk semua data dari Google Sheets
7. **Cache**: 5 menit TTL, fallback jika fetch gagal
8. **Accessibility**: Semantic HTML, proper labels

Buatkan kode yang production-ready, well-commented, dan mudah di-maintain!
```

---

## 🎯 Cara Menggunakan Prompt Ini

### 1. Copy Seluruh Prompt
Copy semua text di dalam code block di atas.

### 2. Sesuaikan untuk Use Case Anda

Ganti bagian berikut sesuai kebutuhan:

**Entity & Periode:**
```
Ganti: "Nama Warga" → "Nama Siswa" / "Nama Anggota"
Ganti: "Januari-Desember" → "Minggu 1-4" / "Semester 1-2"
```

**Jenis Pembayaran:**
```
Ganti: "Iuran Kematian" → "SPP" / "Kas RT" / "Arisan"
Ganti: "Uang Lelah 10%" → sesuai kebutuhan
```

**Statistik:**
```
Sesuaikan metric yang relevan:
- Total pemasukan
- Tunggakan
- Rata-rata per orang
- dll
```

### 3. Paste ke AI Assistant

Paste prompt ke:
- ChatGPT (GPT-4)
- Claude (Sonnet/Opus)
- Google Gemini
- Atau AI coding assistant lainnya

### 4. Iterasi

Jika hasil belum sesuai, tambahkan instruksi spesifik:
```
"Ubah warna primary menjadi biru"
"Tambahkan fitur filter by status"
"Ganti layout jadi 3 kolom di desktop"
```

---

## 📝 Contoh Variasi Prompt

### Untuk SPP Sekolah
```
Buatkan aplikasi tracking SPP siswa dengan data dari Google Sheets.

PERUBAHAN:
- Entity: Siswa (Nama, Kelas, NIS)
- Periode: Bulan (Juli-Juni)
- Pembayaran: SPP per bulan
- Statistik: Total SPP, Tunggakan, Lunas
- Extra: Filter by kelas
```

### Untuk Kas RT
```
Buatkan aplikasi kas RT dengan data dari Google Sheets.

PERUBAHAN:
- Entity: Warga (Nama, No Rumah)
- Periode: Bulan (Januari-Desember)
- Pembayaran: Kas bulanan
- Statistik: Total kas, Pengeluaran, Saldo
- Extra: Riwayat pengeluaran
```

---

## ✅ Checklist Sebelum Deploy

- [ ] Test di berbagai ukuran layar (mobile, tablet, desktop)
- [ ] Verify Google Sheets URL correct
- [ ] Environment variable terset di Netlify
- [ ] Build berhasil tanpa error
- [ ] Cache works (test offline)
- [ ] Error handling tested
- [ ] Excel export/import works
- [ ] Search/filter works
- [ ] Angka rupiah tampil lengkap
- [ ] Layout responsive (no horizontal scroll)

---

**🎉 Selamat! Anda siap membuat sistem serupa dengan mudah!**
