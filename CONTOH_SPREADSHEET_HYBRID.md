# 📊 Contoh Implementasi Google Spreadsheet Hybrid

> **Panduan step-by-step untuk setup Google Spreadsheet dengan sistem hybrid**

---

## 🎯 Contoh Kasus Kecil (5 Warga)

Mari kita gunakan contoh 5 warga dengan berbagai skenario pembayaran:

### **Skenario Pembayaran:**

1. **Pak Budi** - Bayar tepat waktu setiap bulan
2. **Bu Ani** - Bayar 3 bulan sekaligus (Jan-Mar) di tanggal 10 Feb
3. **Pak Dedi** - Telat bayar Januari, baru bayar di tanggal 15 Feb
4. **Bu Siti** - Belum bayar sama sekali
5. **Pak Eko** - Bayar Januari tepat waktu, Februari belum

---

## 📋 SHEET 1: Status Bulanan (Existing)

**Nama Sheet:** `Status Bulanan 2026`

```
┌────┬──────────────┬─────────┬──────────┬───────┬───────┬─────┬─────┐
│ No │ Nama Warga   │ Januari │ Februari │ Maret │ April │ ... │ Des │
├────┼──────────────┼─────────┼──────────┼───────┼───────┼─────┼─────┤
│ 1  │ Pak Budi     │ 10000   │ 10000    │ 10000 │       │     │     │
│ 2  │ Bu Ani       │ 10000   │ 10000    │ 10000 │       │     │     │
│ 3  │ Pak Dedi     │ 10000   │          │       │       │     │     │
│ 4  │ Bu Siti      │         │          │       │       │     │     │
│ 5  │ Pak Eko      │ 10000   │          │       │       │     │     │
└────┴──────────────┴─────────┴──────────┴───────┴───────┴─────┴─────┘
```

**Penjelasan:**
- Kolom ada isi (10000) = Lunas ✅
- Kolom kosong = Belum lunas ❌
- **MASALAH:** Tidak tahu kapan bayar, berapa kali transaksi

---

## 📝 SHEET 2: Log Transaksi (Baru)

**Nama Sheet:** `Log Transaksi`

### **Format Header:**
```
┌────┬───────────────┬──────────────┬───────────────┬────────┬─────────────┐
│ No │ Tanggal Bayar │ Nama Warga   │ Bulan Dibayar │ Jumlah │ Keterangan  │
└────┴───────────────┴──────────────┴───────────────┴────────┴─────────────┘
```

### **Data Transaksi:**
```
┌────┬───────────────┬──────────────┬───────────────┬────────┬─────────────────┐
│ No │ Tanggal Bayar │ Nama Warga   │ Bulan Dibayar │ Jumlah │ Keterangan      │
├────┼───────────────┼──────────────┼───────────────┼────────┼─────────────────┤
│ 1  │ 2026-01-10    │ Pak Budi     │ Januari       │ 10000  │ Bayar tepat     │
│ 2  │ 2026-02-10    │ Pak Budi     │ Februari      │ 10000  │ Bayar tepat     │
│ 3  │ 2026-03-10    │ Pak Budi     │ Maret         │ 10000  │ Bayar tepat     │
│ 4  │ 2026-02-10    │ Bu Ani       │ Januari       │ 10000  │ Bayar 3 bulan   │
│ 5  │ 2026-02-10    │ Bu Ani       │ Februari      │ 10000  │ Bayar 3 bulan   │
│ 6  │ 2026-02-10    │ Bu Ani       │ Maret         │ 10000  │ Bayar 3 bulan   │
│ 7  │ 2026-02-15    │ Pak Dedi     │ Januari       │ 10000  │ Telat bayar     │
│ 8  │ 2026-01-10    │ Pak Eko      │ Januari       │ 10000  │ Bayar tepat     │
└────┴───────────────┴──────────────┴───────────────┴────────┴─────────────────┘
```

---

## 🔍 Analisis dari Log Transaksi

### **Insight yang Bisa Didapat:**

#### **1. Transaksi per Hari**
```
10 Jan 2026: 2 transaksi (Pak Budi, Pak Eko)
10 Feb 2026: 5 transaksi (Pak Budi + Bu Ani 3 bulan)
15 Feb 2026: 1 transaksi (Pak Dedi)
```

#### **2. Warga yang Bayar Sekaligus**
```
Bu Ani: Bayar 3 bulan sekaligus (10 Feb)
Total: Rp 30.000
```

#### **3. Warga yang Telat**
```
Pak Dedi: Januari dibayar tanggal 15 Feb (telat 1 bulan)
```

#### **4. Warga yang Belum Bayar**
```
Bu Siti: Belum ada transaksi sama sekali
Pak Eko: Belum bayar Februari
```

---

## 🛠️ Cara Setup Google Spreadsheet

### **Step 1: Buat Google Spreadsheet Baru**

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **"Blank"** untuk spreadsheet baru
3. Rename: `Uang Kematian RT 05/01 - 2026`

### **Step 2: Setup Sheet 1 (Status Bulanan)**

1. **Rename sheet pertama:**
   - Klik kanan tab sheet → Rename → `Status Bulanan 2026`

2. **Buat header:**
   ```
   A1: No
   B1: Nama Warga
   C1: Januari
   D1: Februari
   E1: Maret
   ... (sampai Desember)
   ```

3. **Isi data warga:**
   ```
   A2: 1    B2: Pak Budi
   A3: 2    B3: Bu Ani
   A4: 3    B4: Pak Dedi
   A5: 4    B5: Bu Siti
   A6: 5    B6: Pak Eko
   ```

4. **Isi status pembayaran:**
   - Sesuai contoh di atas
   - Isi 10000 untuk yang lunas
   - Kosongkan untuk yang belum

### **Step 3: Setup Sheet 2 (Log Transaksi)**

1. **Tambah sheet baru:**
   - Klik **"+"** di pojok kiri bawah
   - Rename: `Log Transaksi`

2. **Buat header:**
   ```
   A1: No
   B1: Tanggal Bayar
   C1: Nama Warga
   D1: Bulan Dibayar
   E1: Jumlah
   F1: Keterangan
   ```

3. **Format kolom:**
   - Kolom B (Tanggal): Format → Number → Date
   - Kolom E (Jumlah): Format → Number → Number

4. **Isi data transaksi:**
   - Copy data dari tabel contoh di atas
   - Atau input manual satu per satu

### **Step 4: Publish Kedua Sheet**

#### **Publish Sheet 1:**

1. File → Share → **Publish to web**
2. **Link:**
   - Dropdown pertama: Pilih `Status Bulanan 2026`
   - Dropdown kedua: Pilih `Comma-separated values (.csv)`
3. Klik **Publish**
4. **Copy URL** → Simpan sebagai `URL_SHEET_1`

#### **Publish Sheet 2:**

1. Masih di dialog yang sama
2. **Link:**
   - Dropdown pertama: Pilih `Log Transaksi`
   - Dropdown kedua: Pilih `Comma-separated values (.csv)`
3. Klik **Publish**
4. **Copy URL** → Simpan sebagai `URL_SHEET_2`

---

## 🔧 Update Environment Variables

Edit file `.env`:

```env
# Sheet 1: Status Bulanan (existing)
VITE_GOOGLE_SHEETS_STATUS_URL=URL_SHEET_1_YANG_DICOPY

# Sheet 2: Log Transaksi (baru)
VITE_GOOGLE_SHEETS_LOG_URL=URL_SHEET_2_YANG_DICOPY
```

---

## 📊 Cara Input Transaksi Baru

### **Contoh: Pak Budi bayar April di tanggal 10 April**

1. Buka Google Sheets
2. Ke Sheet 2: `Log Transaksi`
3. Tambah baris baru di bawah:
   ```
   A: 9
   B: 2026-04-10
   C: Pak Budi
   D: April
   E: 10000
   F: Bayar tepat
   ```
4. (Opsional) Update Sheet 1: Kolom April untuk Pak Budi = 10000
5. Save (otomatis)
6. Refresh website → Data update!

### **Contoh: Bu Siti bayar 2 bulan sekaligus (Jan-Feb) di tanggal 17 Feb**

1. Buka Sheet 2: `Log Transaksi`
2. Tambah **2 baris**:
   ```
   Baris 1:
   A: 9
   B: 2026-02-17
   C: Bu Siti
   D: Januari
   E: 10000
   F: Bayar 2 bulan
   
   Baris 2:
   A: 10
   B: 2026-02-17
   C: Bu Siti
   D: Februari
   E: 10000
   F: Bayar 2 bulan
   ```
3. Update Sheet 1: Kolom Jan & Feb untuk Bu Siti = 10000
4. Save → Refresh website

---

## 💡 Tips & Tricks

### **Tip 1: Auto-numbering**

Untuk kolom No, gunakan formula:
```
A2: =ROW()-1
```
Drag ke bawah → otomatis numbering!

### **Tip 2: Dropdown untuk Nama Warga**

1. Select kolom C (Nama Warga)
2. Data → Data validation
3. Criteria: List from a range
4. Range: `Status Bulanan 2026!B2:B6`
5. Save

Sekarang kolom Nama Warga ada dropdown! ✅

### **Tip 3: Dropdown untuk Bulan**

1. Select kolom D (Bulan Dibayar)
2. Data → Data validation
3. Criteria: List of items
4. Items: `Januari,Februari,Maret,April,Mei,Juni,Juli,Agustus,September,Oktober,November,Desember`
5. Save

### **Tip 4: Validasi Jumlah**

1. Select kolom E (Jumlah)
2. Data → Data validation
3. Criteria: Number → Greater than → 0
4. Save

Tidak bisa input jumlah negatif! ✅

---

## 🎨 UI yang Akan Muncul di Website

### **1. Dashboard Statistik (Existing)**
```
┌─────────────────────────────────────────────┐
│ Total Pemasukan: Rp 80.000                  │
│ Pembayaran Lunas: 8 transaksi              │
│ Belum Lunas: 7 transaksi                   │
│ Persentase Lunas: 53.3%                    │
└─────────────────────────────────────────────┘
```

### **2. Riwayat Transaksi (Baru!)**
```
┌─────────────────────────────────────────────┐
│  📋 Riwayat Transaksi                       │
├─────────────────────────────────────────────┤
│  🔍 Filter: [Semua Warga ▼] [Semua Bulan ▼]│
├─────────────────────────────────────────────┤
│  10 Mar 2026 │ Pak Budi  │ Maret  │ 10.000 │
│  15 Feb 2026 │ Pak Dedi  │ Jan    │ 10.000 │
│  10 Feb 2026 │ Pak Budi  │ Feb    │ 10.000 │
│  10 Feb 2026 │ Bu Ani    │ Maret  │ 10.000 │
│  10 Feb 2026 │ Bu Ani    │ Feb    │ 10.000 │
│  10 Feb 2026 │ Bu Ani    │ Jan    │ 10.000 │
│  10 Jan 2026 │ Pak Eko   │ Jan    │ 10.000 │
│  10 Jan 2026 │ Pak Budi  │ Jan    │ 10.000 │
└─────────────────────────────────────────────┘
```

### **3. Detail Transaksi Warga**
```
┌─────────────────────────────────────────────┐
│  👤 Bu Ani                                  │
├─────────────────────────────────────────────┤
│  📅 10 Feb 2026 - Bayar 3 bulan sekaligus   │
│     • Januari  - Rp 10.000                  │
│     • Februari - Rp 10.000                  │
│     • Maret    - Rp 10.000                  │
│     Total: Rp 30.000                        │
└─────────────────────────────────────────────┘
```

---

## ❓ FAQ

### **Q: Apakah harus input di Sheet 2 dulu baru Sheet 1?**
A: Idealnya Sheet 2 dulu (log transaksi), lalu Sheet 1 otomatis update. Tapi untuk sekarang, Anda bisa input keduanya manual.

### **Q: Kalau lupa input di Sheet 2, gimana?**
A: Tidak masalah! Sheet 1 tetap jalan seperti biasa. Sheet 2 hanya untuk tracking detail.

### **Q: Bisa hapus transaksi yang salah?**
A: Bisa! Langsung hapus baris di Sheet 2. Tapi lebih baik tambah keterangan "BATAL" daripada hapus (untuk audit).

### **Q: Kalau warga bayar kurang (Rp 5.000 bukan Rp 10.000)?**
A: Isi di kolom Jumlah: 5000. Lalu di Keterangan: "Bayar sebagian".

---

## 🚀 Next Steps

Setelah Anda coba setup contoh kecil ini:

1. **Test input beberapa transaksi**
2. **Lihat hasilnya di website** (setelah saya update kode)
3. **Kalau cocok**, baru kita scale up ke data real (162 warga)
4. **Kalau ada yang kurang jelas**, kita diskusi lagi!

---

**Apakah panduan ini sudah cukup jelas? Atau ada bagian yang masih membingungkan?** 😊
