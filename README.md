# 💰 Uang Kematian - Sistem Manajemen Iuran RT

> **Sistem manajemen iuran kematian berbasis web dengan integrasi Google Sheets untuk RT 05/01 KP Ciletuh**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://uang-kematianku.netlify.app/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev/)

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Technology Stack](#-technology-stack)
- [Fitur Utama](#-fitur-utama)
- [Kelebihan & Kekurangan](#-kelebihan--kekurangan)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [Panduan Membuat Ulang](#-panduan-membuat-ulang-sistem-serupa)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Tentang Project

Aplikasi web untuk mengelola iuran kematian warga RT dengan fitur:
- 📊 Dashboard statistik real-time
- 📱 Responsive mobile-first design
- 🔄 Sinkronisasi otomatis dengan Google Sheets
- 💾 Offline support dengan localStorage cache
- 🔍 Pencarian warga
- 📥 Export/Import Excel

### Use Case
Cocok untuk RT/RW, organisasi kecil, atau komunitas yang perlu:
- Tracking iuran/pembayaran bulanan
- Data source dari Google Sheets (mudah diupdate non-teknis)
- Akses via web tanpa perlu install aplikasi
- Budget minim (gratis hosting di Netlify/Vercel)

---

## 🏗️ Arsitektur Sistem

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Statistics   │  │ PaymentTable │  │ Excel Export │      │
│  │ Component    │  │ Component    │  │ Component    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │   React State   │                        │
│                   │   (App.jsx)     │                        │
│                   └────────┬────────┘                        │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │ Data Layer      │                        │
│                   │ googleSheets.js │                        │
│                   └────────┬────────┘                        │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐              │
│         │                  │                  │              │
│  ┌──────▼──────┐  ┌────────▼────────┐  ┌─────▼──────┐      │
│  │ localStorage│  │  Zod Validation │  │  Papaparse │      │
│  │   Cache     │  │                 │  │  CSV Parser│      │
│  └─────────────┘  └─────────────────┘  └─────┬──────┘      │
└────────────────────────────────────────────────┼────────────┘
                                                 │
                                        ┌────────▼────────┐
                                        │  Google Sheets  │
                                        │   (CSV Export)  │
                                        └─────────────────┘
```

### Data Flow

```
1. User opens app
   ↓
2. fetchGoogleSheetsData() called
   ↓
3. Check localStorage cache (5 min TTL)
   ├─ Cache valid → Use cached data
   └─ Cache expired/missing → Fetch from Google Sheets
      ↓
4. Fetch CSV from Google Sheets URL
   ├─ Retry with exponential backoff (max 3 retries)
   └─ Timeout after 30 seconds
      ↓
5. Parse CSV with Papaparse
   ↓
6. Validate data with Zod schemas
   ├─ Valid → Continue
   └─ Invalid → Use default values + log warnings
      ↓
7. Transform to app format (wargaData, paymentData, ringkasan)
   ↓
8. Save to localStorage cache
   ↓
9. Update React state
   ↓
10. Render UI components
```

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 19.2.0** - UI library dengan hooks modern
- **Vite 7.2.5** (Rolldown) - Build tool super cepat
- **Vanilla CSS** - Styling tanpa framework (full control)

### Data Management
- **Google Sheets** - Data source (CSV export)
- **Papaparse 5.5.3** - CSV parser
- **Zod 4.3.6** - Runtime validation
- **localStorage** - Client-side caching

### Excel Features
- **XLSX 0.18.5** - Excel export/import

### Development Tools
- **ESLint** - Code linting
- **Google Fonts** - Inter, Poppins

### Deployment
- **Netlify** - Hosting & CI/CD
- **Git** - Version control

---

## ✨ Fitur Utama

### 1. Dashboard Statistik
- Total pemasukan
- Pembayaran lunas/belum lunas
- Persentase lunas dengan progress bar
- Ringkasan keuangan (total, uang lelah, saldo)
- Detail per bulan (expandable)

### 2. Tabel Pembayaran
- Grid view: Warga × Bulan
- Visual indicator (✅ lunas, ❌ belum)
- Search/filter warga
- Responsive horizontal scroll

### 3. Excel Integration
- **Export**: Download data ke Excel (.xlsx)
- **Import**: Upload Excel untuk update batch

### 4. Performance & UX
- **Offline Support**: Cache 5 menit di localStorage
- **Auto Retry**: 3x retry dengan exponential backoff
- **Loading States**: Skeleton/spinner saat loading
- **Error Handling**: User-friendly error messages
- **Responsive**: Mobile-first design (grid 2 kolom)

---

## ⚖️ Kelebihan & Kekurangan

### ✅ Kelebihan

#### 1. **Mudah Diupdate Non-Teknis**
- Admin cukup edit Google Sheets
- Tidak perlu akses ke code/database
- Familiar interface (seperti Excel)

#### 2. **Zero Backend Cost**
- Tidak perlu server/database
- Hosting gratis (Netlify/Vercel)
- Google Sheets gratis

#### 3. **Simple Architecture**
- Hanya frontend (React)
- Mudah di-maintain
- Deployment cepat

#### 4. **Offline Capable**
- Cache di localStorage
- Tetap bisa lihat data tanpa internet (5 menit)

#### 5. **Fast Development**
- Vite build super cepat
- Hot reload instant
- No complex setup

#### 6. **Responsive & Modern UI**
- Mobile-first design
- Grid layout yang rapi
- Smooth animations

### ❌ Kekurangan

#### 1. **Tidak Ada Authentication**
- Siapa saja bisa akses (public)
- Tidak ada role-based access
- **Solusi**: Tambahkan auth (Firebase, Auth0)

#### 2. **Read-Only dari UI**
- User tidak bisa edit langsung dari web
- Harus edit di Google Sheets
- **Solusi**: Tambahkan backend API untuk CRUD

#### 3. **Google Sheets Limitations**
- Max 5 juta cells per spreadsheet
- Slow jika data sangat besar (>10k rows)
- **Solusi**: Migrasi ke database (Supabase, Firebase)

#### 4. **No Real-Time Sync**
- Cache 5 menit → data bisa delay
- Tidak ada WebSocket/real-time update
- **Solusi**: Reduce cache TTL atau gunakan real-time DB

#### 5. **Client-Side Validation Only**
- Tidak ada server-side validation
- Bisa di-bypass jika ada manipulasi
- **Solusi**: Tambahkan backend validation

#### 6. **SEO Terbatas**
- SPA → poor SEO (jika perlu)
- **Solusi**: Gunakan Next.js untuk SSR

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18
npm atau yarn
Google Sheets account
```

### Installation

1. **Clone repository**
```bash
git clone https://github.com/ardhiS/uang-kematian-ku.git
cd uang-kematian-ku
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Google Sheets**
   - Buat Google Sheets dengan format:
     ```
     | No | Nama Warga | Januari | Februari | ... | Desember |
     |----|-----------|---------|----------|-----|----------|
     | 1  | John Doe  | 10000   |          |     |          |
     ```
   - File → Share → Publish to web
   - Format: CSV
   - Copy URL

4. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?gid=YOUR_GID&single=true&output=csv
```

5. **Run development server**
```bash
npm run dev
```

6. **Open browser**
```
http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview  # Test production build locally
```

---

## 🌐 Deployment

### Netlify (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Netlify**
   - Login ke [Netlify](https://netlify.com)
   - New site from Git
   - Select repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables**
   - Site settings → Environment variables
   - Add: `VITE_GOOGLE_SHEETS_URL`
   - Value: Your Google Sheets CSV URL

5. **Deploy**
   - Trigger deploy
   - Wait ~2 minutes
   - Visit your site!

### Vercel

Similar steps, tapi:
- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite

---

## 🔄 Panduan Membuat Ulang Sistem Serupa

### Prompt Template untuk AI

Gunakan prompt ini untuk membuat sistem serupa:

```
Buatkan saya aplikasi web untuk tracking [JENIS IURAN/PEMBAYARAN] dengan spesifikasi:

TECH STACK:
- Frontend: React + Vite
- Styling: Vanilla CSS (responsive, mobile-first)
- Data source: Google Sheets (CSV export)
- Libraries: Papaparse (CSV parser), Zod (validation), XLSX (Excel export)

FITUR UTAMA:
1. Dashboard statistik:
   - Total pemasukan
   - Jumlah lunas/belum lunas
   - Persentase dengan progress bar
   - Ringkasan keuangan

2. Tabel pembayaran:
   - Grid: [ENTITY] × [PERIODE]
   - Visual indicator (✅/❌)
   - Search/filter
   - Responsive (2 kolom di mobile)

3. Excel export/import

4. Performance:
   - localStorage cache (5 menit TTL)
   - Auto retry (3x dengan exponential backoff)
   - Offline support
   - Loading states & error handling

ARSITEKTUR:
- Single Page Application (SPA)
- Client-side only (no backend)
- Data dari Google Sheets via CSV URL
- Validation dengan Zod schemas
- Cache di localStorage

DATA FORMAT (Google Sheets):
[SESUAIKAN DENGAN KEBUTUHAN]
Contoh:
| No | Nama | Bulan1 | Bulan2 | ... |

DEPLOYMENT:
- Netlify/Vercel
- Environment variable: VITE_GOOGLE_SHEETS_URL

STYLING:
- Modern, clean design
- Gradient backgrounds
- Card-based layout
- Smooth animations
- Mobile-first responsive
```

### Customization Points

Sesuaikan bagian ini untuk use case Anda:

1. **Entity**: Warga → Siswa, Anggota, Karyawan, dll
2. **Periode**: Bulan → Minggu, Tahun, Semester, dll
3. **Jenis Pembayaran**: Iuran kematian → SPP, Kas, Arisan, dll
4. **Statistik**: Sesuaikan metric yang relevan
5. **Validasi**: Sesuaikan Zod schema dengan data Anda

### File Structure Template

```
your-project/
├── src/
│   ├── components/
│   │   ├── Statistics.jsx        # Dashboard
│   │   ├── Statistics.css
│   │   ├── DataTable.jsx         # Main table
│   │   ├── DataTable.css
│   │   ├── ExcelExport.jsx       # Export feature
│   │   └── ExcelImport.jsx       # Import feature
│   ├── data/
│   │   ├── googleSheets.js       # Data fetching logic
│   │   └── dataUtils.js          # Helper functions
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env
├── .env.example
├── netlify.toml
├── package.json
└── vite.config.js
```

---

## 📁 Project Structure

```
uang-kematian-ku/
├── src/
│   ├── components/
│   │   ├── Statistics.jsx         # Dashboard statistik
│   │   ├── Statistics.css         # Styling dashboard
│   │   ├── PaymentTable.jsx       # Tabel pembayaran
│   │   ├── PaymentTable.css       # Styling tabel
│   │   ├── ExcelExport.jsx        # Export ke Excel
│   │   ├── ExcelImport.jsx        # Import dari Excel
│   │   └── ExcelImport.css        # Styling import
│   ├── data/
│   │   ├── googleSheets.js        # Google Sheets integration
│   │   │                          # - fetchGoogleSheetsData()
│   │   │                          # - parseSheetData()
│   │   │                          # - Retry logic
│   │   │                          # - Cache management
│   │   └── wargaData.js           # Data utilities & constants
│   │                              # - formatRupiah()
│   │                              # - bulanList
│   │                              # - IURAN_AMOUNT
│   ├── App.jsx                    # Main component
│   ├── App.css                    # Global styles
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Base styles
├── public/
│   └── vite.svg                   # Favicon
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── netlify.toml                   # Netlify config
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

---

## 🐛 Troubleshooting

### Error: "VITE_GOOGLE_SHEETS_URL is not defined"

**Penyebab**: Environment variable tidak terset

**Solusi**:
1. Pastikan file `.env` ada di root project
2. Isi dengan: `VITE_GOOGLE_SHEETS_URL=your_url_here`
3. Restart dev server: `Ctrl+C` → `npm run dev`
4. Untuk Netlify: Tambahkan di Site Settings → Environment Variables

### Data tidak muncul / Loading terus

**Penyebab**: Google Sheets URL invalid atau tidak published

**Solusi**:
1. Buka Google Sheets
2. File → Share → Publish to web
3. Pilih sheet yang benar
4. Format: **CSV** (bukan Web page)
5. Copy URL, paste ke `.env`
6. Pastikan spreadsheet bisa diakses publik

### Cache tidak update

**Penyebab**: localStorage cache masih valid (< 5 menit)

**Solusi**:
```javascript
// Buka browser console (F12), jalankan:
localStorage.clear()
// Lalu refresh halaman
```

Atau tunggu 5 menit untuk auto-refresh.

### Build error: "Module not found"

**Penyebab**: Dependencies belum terinstall

**Solusi**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Netlify deployment gagal

**Penyebab**: Environment variable tidak terset di Netlify

**Solusi**:
1. Netlify Dashboard → Site Settings
2. Environment Variables → Add a variable
3. Key: `VITE_GOOGLE_SHEETS_URL`
4. Value: Your CSV URL
5. Trigger new deploy

---

## 📊 Performance Tips

### 1. Optimize Cache Duration
```javascript
// src/data/googleSheets.js
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// Untuk data yang jarang berubah, tingkatkan:
const CACHE_DURATION = 30 * 60 * 1000; // 30 menit
```

### 2. Reduce Bundle Size
```bash
# Analyze bundle
npm run build
# Check dist/ folder size

# Lazy load components
const Statistics = lazy(() => import('./components/Statistics'));
```

### 3. Optimize Google Sheets
- Publish hanya sheet yang diperlukan
- Hapus kolom/baris yang tidak dipakai
- Gunakan formula minimal

---

## 🔐 Security Considerations

### Current State
- ✅ No sensitive data in code (env variables)
- ✅ HTTPS deployment (Netlify)
- ❌ No authentication
- ❌ Public access

### Recommendations for Production

1. **Add Authentication**
```bash
# Option 1: Firebase Auth
npm install firebase

# Option 2: Auth0
npm install @auth0/auth0-react
```

2. **Restrict Access**
- Deploy di private network
- Atau tambahkan password protection (Netlify)

3. **Validate Input**
- Jika menambahkan form input
- Gunakan Zod untuk validation

---

## 📝 Changelog

### Version 1.0.0 (17 Feb 2026)
- ✅ Initial release
- ✅ Google Sheets integration
- ✅ Statistics dashboard
- ✅ Payment table
- ✅ Excel export/import
- ✅ Responsive mobile design
- ✅ Offline support
- ✅ Netlify deployment

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - Free to use for your community!

---

## 🙏 Credits

**Developed for**: RT 05/01 KP Ciletuh  
**Developer**: Ardhi S  
**Year**: 2026

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
- 📧 Email: [your-email]
- 💬 GitHub Issues: [Create issue](https://github.com/ardhiS/uang-kematian-ku/issues)

---

**⭐ Star this repo if helpful!**
