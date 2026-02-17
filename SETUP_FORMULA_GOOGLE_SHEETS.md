# 📋 Panduan Setup Google Sheets Hybrid - SIAP COPY!

> **File ini berisi semua formula dan langkah setup yang bisa langsung di-copy-paste**

---

## 🎯 OVERVIEW SISTEM

```
Sheet 2 (Log Transaksi) = SUMBER DATA (Anda input di sini)
    ↓ (Formula otomatis)
Sheet 1 (Status Bulanan) = TAMPILAN (Auto-generated dari Sheet 2)
    ↓
Website = Baca kedua sheet
```

**Keuntungan:** Input sekali di Sheet 2, Sheet 1 otomatis update!

---

## 📝 SHEET 2: Log Transaksi (Input Manual)

### **Setup Header**

Copy-paste baris ini ke **Row 1**:

```
No	Tanggal Bayar	Nama Warga	Bulan Dibayar	Jumlah	Keterangan
```

### **Format Kolom**

1. **Kolom A (No):** 
   - Cell A2, isi formula: `=ROW()-1`
   - Drag ke bawah → auto-numbering!

2. **Kolom B (Tanggal Bayar):**
   - Select kolom B
   - Format → Number → Date

3. **Kolom C (Nama Warga):**
   - Select kolom C (mulai C2)
   - Data → Data validation
   - Criteria: List from a range
   - Range: `'Status Bulanan 2026'!B2:B163`
   - ✅ Show dropdown list in cell
   - Save

4. **Kolom D (Bulan Dibayar):**
   - Select kolom D (mulai D2)
   - Data → Data validation
   - Criteria: List of items
   - Items: `Januari,Februari,Maret,April,Mei,Juni,Juli,Agustus,September,Oktober,November,Desember`
   - ✅ Show dropdown list in cell
   - Save

5. **Kolom E (Jumlah):**
   - Select kolom E
   - Format → Number → Number
   - Data → Data validation
   - Criteria: Number → Greater than → 0
   - Save

6. **Kolom F (Keterangan):**
   - Text biasa, no validation

### **Contoh Data (untuk testing)**

Copy-paste ke Row 2-8:

```
1	2026-01-10	Pak Budi	Januari	10000	Bayar tepat
2	2026-02-10	Pak Budi	Februari	10000	Bayar tepat
3	2026-02-10	Bu Ani	Januari	10000	Bayar 3 bulan
4	2026-02-10	Bu Ani	Februari	10000	Bayar 3 bulan
5	2026-02-10	Bu Ani	Maret	10000	Bayar 3 bulan
6	2026-02-15	Pak Dedi	Januari	10000	Telat bayar
7	2026-01-10	Pak Eko	Januari	10000	Bayar tepat
```

---

## 📊 SHEET 1: Status Bulanan (Auto-Generated)

### **Setup Header**

**Row 1 (Header Utama):**
```
A1: No
B1: Nama Warga
C1: Januari
D1: Februari
E1: Maret
F1: April
G1: Mei
H1: Juni
I1: Juli
J1: Agustus
K1: September
L1: Oktober
M1: November
N1: Desember
```

**Row 2-163 (Data Warga):**
```
A2: 1
B2: Pak Budi
A3: 2
B3: Bu Ani
...
A163: 162
B163: Ustd Ading
```

### **FORMULA UTAMA (Copy-Paste Ini!)**

#### **Cell C2 (Januari - Pak Budi):**

```excel
=IF(COUNTIFS('Log Transaksi'!$C:$C,$B2,'Log Transaksi'!$D:$D,C$1)>0,10000,"")
```

**Cara Apply ke Semua Cell:**

1. **Copy formula** di atas
2. Klik cell **C2**
3. Paste formula
4. **Copy cell C2** (Ctrl+C)
5. **Select range C2:N163** (semua bulan untuk semua warga)
   - Klik C2
   - Scroll ke kanan sampai kolom N (Desember)
   - Scroll ke bawah sampai row 163
   - Shift+Click di N163
6. **Paste** (Ctrl+V)
7. **DONE!** Semua cell sekarang punya formula

### **Penjelasan Formula:**

```excel
=IF(
  COUNTIFS(
    'Log Transaksi'!$C:$C,  ← Kolom Nama Warga di Sheet 2
    $B2,                     ← Nama warga di baris ini (Pak Budi)
    'Log Transaksi'!$D:$D,  ← Kolom Bulan Dibayar di Sheet 2
    C$1                      ← Nama bulan di kolom ini (Januari)
  )>0,                       ← Kalau ada transaksi (>0)
  10000,                     ← Tampilkan 10000 (lunas)
  ""                         ← Kalau tidak ada, kosong (belum lunas)
)
```

**Kenapa pakai $ (dollar sign)?**
- `$B2` = Lock kolom B, baris bebas (bisa copy ke bawah)
- `C$1` = Lock row 1, kolom bebas (bisa copy ke kanan)
- `$C:$C` = Lock kolom C (selalu cek kolom C di Sheet 2)

---

## 🔧 FORMULA ALTERNATIF (Lebih Fleksibel)

### **Jika Jumlah Bayar Bisa Beda-Beda:**

```excel
=IFERROR(SUMIFS('Log Transaksi'!$E:$E,'Log Transaksi'!$C:$C,$B2,'Log Transaksi'!$D:$D,C$1),"")
```

**Keuntungan:**
- Tampilkan jumlah sebenarnya (bukan selalu 10000)
- Kalau bayar Rp 5.000, tampil 5000
- Kalau bayar 2x (Rp 10.000 + Rp 5.000), tampil 15000

### **Jika Ingin Tampilkan Tanggal Bayar:**

Buat kolom tambahan di sebelah kanan (kolom O dst):

```excel
=IFERROR(TEXT(INDEX('Log Transaksi'!$B:$B,MATCH(1,('Log Transaksi'!$C:$C=$B2)*('Log Transaksi'!$D:$D=C$1),0)),"DD/MM/YYYY"),"")
```

**Hasil:** Tampilkan tanggal bayar (contoh: 15/02/2026)

---

## 📋 RINGKASAN KEUANGAN (Auto-Calculate)

### **Tambahkan di Bawah Data Warga**

**Row 165-168 (setelah data warga terakhir):**

#### **Total Perbulan (Row 165):**

```
A165: Total Perbulan
B165: (kosong)
C165: =SUM(C2:C163)
```

Copy C165 → Paste ke D165:N165 (semua bulan)

#### **Uang Lelah 10% (Row 166):**

```
A166: Uang Lelah perbulan - 10%
B166: (kosong)
C166: =C165*0.1
```

Copy C166 → Paste ke D166:N166

#### **Saldo Uang Kematian (Row 167):**

```
A167: Saldo UANG KEMATIAN
B167: (kosong)
C167: =SUM(C165:N165)-SUM(C166:N166)
```

**Atau untuk total kumulatif:**

```
C167: =SUM($C165:C165)-SUM($C166:C166)
```

Copy C167 → Paste ke D167:N167

---

## ✅ TESTING FORMULA

### **Test 1: Input Transaksi Baru**

1. Ke Sheet 2 "Log Transaksi"
2. Tambah baris baru:
   ```
   8	2026-03-10	Pak Budi	Maret	10000	Test
   ```
3. Ke Sheet 1 "Status Bulanan"
4. Cek cell E2 (Maret - Pak Budi)
5. **Harus muncul: 10000** ✅

### **Test 2: Bayar 3 Bulan Sekaligus**

1. Ke Sheet 2
2. Tambah 3 baris:
   ```
   9	2026-02-17	Bu Siti	Januari	10000	Bayar 3 bln
   10	2026-02-17	Bu Siti	Februari	10000	Bayar 3 bln
   11	2026-02-17	Bu Siti	Maret	10000	Bayar 3 bln
   ```
3. Ke Sheet 1
4. Cek row Bu Siti, kolom C-E (Jan-Mar)
5. **Semua harus muncul: 10000** ✅

### **Test 3: Hapus Transaksi**

1. Ke Sheet 2
2. Hapus row 8 (Test tadi)
3. Ke Sheet 1
4. Cell E2 (Maret - Pak Budi)
5. **Harus kosong lagi** ✅

---

## 🚀 PUBLISH KEDUA SHEET

### **Step 1: Publish Sheet 1**

1. File → Share → **Publish to web**
2. **Link tab:**
   - Dropdown 1: `Status Bulanan 2026`
   - Dropdown 2: `Comma-separated values (.csv)`
3. Klik **Publish**
4. **Copy URL** yang muncul
5. Simpan sebagai `URL_SHEET_1`

**Contoh URL:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vTDyeE0k15VRkO0HHp7di6fDFbPgHNhmAvP-HfFlzrJpIYXJUd3CR1doN6l0G7txw/pub?gid=0&single=true&output=csv
```

### **Step 2: Publish Sheet 2**

1. Masih di dialog yang sama
2. **Link tab:**
   - Dropdown 1: `Log Transaksi`
   - Dropdown 2: `Comma-separated values (.csv)`
3. Klik **Publish**
4. **Copy URL** yang muncul
5. Simpan sebagai `URL_SHEET_2`

**Contoh URL:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vTDyeE0k15VRkO0HHp7di6fDFbPgHNhmAvP-HfFlzrJpIYXJUd3CR1doN6l0G7txw/pub?gid=123456789&single=true&output=csv
```

**Perhatikan perbedaan:** `gid=0` vs `gid=123456789`

---

## 🔧 UPDATE ENVIRONMENT VARIABLES

Edit file `.env`:

```env
# Sheet 1: Status Bulanan (existing, ganti dengan URL baru)
VITE_GOOGLE_SHEETS_STATUS_URL=PASTE_URL_SHEET_1_DI_SINI

# Sheet 2: Log Transaksi (baru)
VITE_GOOGLE_SHEETS_LOG_URL=PASTE_URL_SHEET_2_DI_SINI
```

**Contoh lengkap:**

```env
VITE_GOOGLE_SHEETS_STATUS_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vTDyeE0k15VRkO0HHp7di6fDFbPgHNhmAvP-HfFlzrJpIYXJUd3CR1doN6l0G7txw/pub?gid=0&single=true&output=csv

VITE_GOOGLE_SHEETS_LOG_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vTDyeE0k15VRkO0HHp7di6fDFbPgHNhmAvP-HfFlzrJpIYXJUd3CR1doN6l0G7txw/pub?gid=123456789&single=true&output=csv
```

---

## 📱 WORKFLOW HARIAN (dari HP)

### **Input Transaksi Baru:**

1. Buka **Google Sheets app** di HP
2. Buka file "Uang Kematian RT"
3. Ke sheet **"Log Transaksi"**
4. Scroll ke baris kosong terakhir
5. Tap cell di kolom Tanggal → **Date picker** muncul
6. Tap cell di kolom Nama → **Dropdown** muncul
7. Tap cell di kolom Bulan → **Dropdown** muncul
8. Ketik Jumlah (atau biarkan default 10000)
9. Ketik Keterangan (opsional)
10. **Done!** Auto-save

**Estimasi waktu:** 1-2 menit per transaksi

### **Cek Status:**

1. Ke sheet **"Status Bulanan 2026"**
2. Scroll ke nama warga
3. Lihat kolom bulan
4. **Ada angka = Lunas ✅**
5. **Kosong = Belum ❌**

---

## 🐛 TROUBLESHOOTING

### **Formula tidak jalan (tampil #REF! atau #N/A)**

**Penyebab:** Nama sheet salah

**Solusi:**
- Pastikan nama sheet persis: `Log Transaksi` (dengan spasi)
- Kalau nama sheet beda, ganti di formula:
  ```
  'Log Transaksi'!  →  'Nama Sheet Anda'!
  ```

### **Cell tetap kosong padahal sudah ada transaksi**

**Penyebab:** Nama warga atau bulan tidak match

**Solusi:**
- Cek ejaan nama warga (harus persis sama)
- Cek ejaan bulan (harus persis: "Januari" bukan "januari")
- Gunakan dropdown untuk menghindari typo

### **Angka tidak update real-time**

**Penyebab:** Google Sheets belum recalculate

**Solusi:**
- Edit cell formula (tambah spasi, lalu hapus)
- Atau: Ctrl+R (recalculate)
- Atau: Tunggu beberapa detik

---

## ✅ CHECKLIST SETUP

- [ ] Buat Sheet 1 "Status Bulanan 2026"
- [ ] Buat Sheet 2 "Log Transaksi"
- [ ] Setup header di kedua sheet
- [ ] Setup dropdown untuk Nama Warga (Sheet 2)
- [ ] Setup dropdown untuk Bulan (Sheet 2)
- [ ] Copy-paste formula di Sheet 1 (C2:N163)
- [ ] Test dengan input beberapa transaksi
- [ ] Verify Sheet 1 auto-update
- [ ] Publish Sheet 1 ke CSV
- [ ] Publish Sheet 2 ke CSV
- [ ] Copy kedua URL
- [ ] Update file .env
- [ ] Restart dev server
- [ ] Test di website

---

## 🎉 SELESAI!

Sekarang Anda punya sistem hybrid yang:
- ✅ Input sekali di Sheet 2
- ✅ Sheet 1 otomatis update
- ✅ Website baca kedua sheet
- ✅ Tracking lengkap (tanggal, jumlah, keterangan)
- ✅ Bisa akses dari HP

**Selamat! Sistem Anda sudah upgrade! 🚀**
