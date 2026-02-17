# Uang Kematian - KP Ciletuh RT 05/01

Sistem manajemen iuran kematian untuk warga RT 05/01 KP Ciletuh dengan integrasi Google Sheets.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 atau lebih baru)
- npm atau yarn
- Google Sheets yang sudah dipublikasikan sebagai CSV

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd uang-kematian-ku
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

4. Edit `.env` dan isi Google Sheets URL Anda:
```env
VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?gid=YOUR_GID&single=true&output=csv
```

5. Run development server
```bash
npm run dev
```

6. Buka browser di `http://localhost:5173`

## 📋 Features

- ✅ **Real-time Data**: Sinkronisasi dengan Google Sheets
- ✅ **Responsive Design**: Mobile-friendly UI
- ✅ **Search**: Cari warga berdasarkan nama atau alias
- ✅ **Statistics**: Dashboard statistik pembayaran
- ✅ **Offline Support**: Cache data untuk akses offline
- ✅ **Auto Retry**: Retry otomatis jika koneksi gagal
- ✅ **Data Validation**: Validasi data untuk integritas

## 🔧 Technology Stack

- **Frontend**: React 19 + Vite
- **Styling**: Vanilla CSS
- **Data Source**: Google Sheets (CSV)
- **CSV Parser**: Papaparse
- **Validation**: Zod
- **Fonts**: Inter, Poppins (Google Fonts)

## 📁 Project Structure

```
uang-kematian-ku/
├── src/
│   ├── components/
│   │   ├── PaymentTable.jsx      # Tabel pembayaran
│   │   ├── PaymentTable.css
│   │   ├── Statistics.jsx        # Dashboard statistik
│   │   └── Statistics.css
│   ├── data/
│   │   ├── googleSheets.js       # Google Sheets integration
│   │   └── wargaData.js          # Data utilities
│   ├── App.jsx                   # Main app component
│   ├── App.css
│   ├── main.jsx                  # Entry point
│   └── index.css
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment template
├── package.json
└── vite.config.js
```

## 🔒 Security

### Environment Variables

File `.env` berisi konfigurasi sensitif dan **tidak** di-commit ke git. Gunakan `.env.example` sebagai template.

**Required Variables:**
- `VITE_GOOGLE_SHEETS_URL` - URL CSV dari Google Sheets yang sudah dipublikasikan

### Google Sheets Setup

1. Buka Google Sheets Anda
2. File → Share → Publish to web
3. Pilih sheet yang ingin dipublikasikan
4. Format: CSV
5. Copy URL yang dihasilkan
6. Paste ke `.env` file

## 🧪 Testing

### Manual Testing

1. **Normal Load**: Buka aplikasi, verify data dimuat
2. **Offline Mode**: Disconnect internet, verify cache fallback
3. **Error Handling**: Invalid URL, verify error messages
4. **Search**: Test search functionality
5. **Responsive**: Test di berbagai device sizes

### Browser Console

Buka Developer Tools (F12) untuk:
- Check network requests
- View validation warnings
- Debug errors

## 📦 Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

Build output akan ada di folder `dist/`.

## 🚀 Deployment

### Netlify / Vercel

1. Connect repository
2. Set environment variables di dashboard:
   - `VITE_GOOGLE_SHEETS_URL`
3. Build command: `npm run build`
4. Publish directory: `dist`

### Manual Deployment

1. Build project: `npm run build`
2. Upload folder `dist/` ke hosting
3. Configure environment variables di hosting

## 🔄 Data Flow

```
Google Sheets (CSV)
    ↓
fetchGoogleSheetsData() [with retry & timeout]
    ↓
Papaparse CSV Parser
    ↓
Data Validation (Zod)
    ↓
localStorage Cache
    ↓
React State
    ↓
UI Components
```

## 🐛 Troubleshooting

### "VITE_GOOGLE_SHEETS_URL is not defined"
- Pastikan file `.env` ada di root project
- Pastikan variable name benar: `VITE_GOOGLE_SHEETS_URL`
- Restart dev server setelah edit `.env`

### Data tidak muncul
- Check browser console untuk errors
- Verify Google Sheets URL valid
- Pastikan spreadsheet sudah dipublikasikan
- Check network tab di DevTools

### Cache tidak update
- Cache duration: 5 menit
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

## 📝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - feel free to use for your community!

## 🙏 Credits

Developed for RT 05/01 KP Ciletuh community.

---

**Version**: 1.0.0  
**Last Updated**: 17 Februari 2026
