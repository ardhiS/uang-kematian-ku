import Papa from 'papaparse';
import { z } from 'zod';
import { bulanList, IURAN_AMOUNT } from './wargaData';

// Get Google Sheets URL from environment variable
const SHEET_CSV_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

// Validate that environment variable is set
if (!SHEET_CSV_URL) {
  throw new Error(
    'VITE_GOOGLE_SHEETS_URL is not defined. Please create a .env file with your Google Sheets URL.',
  );
}

// Cache keys
const CACHE_KEY = 'uang_kematian_data';
const CACHE_TIMESTAMP_KEY = 'uang_kematian_data_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Zod schemas for validation
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

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 second
const TIMEOUT = 30000; // 30 seconds

/**
 * Fetch with timeout
 */
const fetchWithTimeout = (url, timeout = TIMEOUT) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout),
    ),
  ]);
};

/**
 * Retry fetch with exponential backoff
 */
const retryWithBackoff = async (fn, retries = MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastRetry = i === retries - 1;
      if (isLastRetry) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = INITIAL_DELAY * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${retries} after ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Get cached data from localStorage
 */
const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (!cached || !timestamp) {
      return null;
    }

    const age = Date.now() - parseInt(timestamp);
    if (age > CACHE_DURATION) {
      // Cache expired
      return null;
    }

    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Save data to localStorage cache
 */
const setCachedData = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error saving cache:', error);
  }
};

/**
 * Validate warga data
 */
const validateWargaData = (wargaList) => {
  const validWarga = [];
  const errors = [];

  wargaList.forEach((warga, index) => {
    try {
      const validated = WargaSchema.parse(warga);
      validWarga.push(validated);
    } catch (error) {
      errors.push({
        index,
        warga,
        error: error.message,
      });
    }
  });

  if (errors.length > 0) {
    console.warn('Data validation warnings for warga:', errors);
  }

  return validWarga;
};

/**
 * Validate payment data
 */
const validatePaymentData = (paymentData) => {
  const validPayments = {};
  const errors = [];

  Object.entries(paymentData).forEach(([wargaId, payments]) => {
    validPayments[wargaId] = {};

    Object.entries(payments).forEach(([bulan, payment]) => {
      try {
        const validated = PaymentSchema.parse(payment);
        validPayments[wargaId][bulan] = validated;
      } catch (error) {
        errors.push({
          wargaId,
          bulan,
          payment,
          error: error.message,
        });
        // Use default value on error
        validPayments[wargaId][bulan] = {
          lunas: false,
          tanggalBayar: null,
          jumlah: IURAN_AMOUNT,
        };
      }
    });
  });

  if (errors.length > 0) {
    console.warn('Data validation warnings for payments:', errors);
  }

  return validPayments;
};

/**
 * Parse data sheet ke format warga dan payments
 */
const parseSheetData = (data) => {
  const wargaData = [];
  const paymentData = {};

  // Cari baris header (yang mengandung nama bulan)
  let headerRowIndex = -1;
  let namaColIndex = -1;
  let bulanColIndexes = {};

  for (let i = 0; i < Math.min(data.length, 15); i++) {
    const row = data[i];
    if (!row) continue;

    for (let j = 0; j < row.length; j++) {
      const cell = String(row[j] || '')
        .trim()
        .replace(/"/g, '');

      // Cek apakah ini kolom Nama Warga
      if (
        cell.toLowerCase().includes('nama') &&
        cell.toLowerCase().includes('warga')
      ) {
        namaColIndex = j;
        headerRowIndex = i;
      }

      // Cek apakah ini kolom bulan
      bulanList.forEach((bulan) => {
        if (cell.toLowerCase() === bulan.toLowerCase()) {
          bulanColIndexes[bulan] = j;
          if (headerRowIndex === -1) headerRowIndex = i;
        }
      });
    }
  }

  // Jika header tidak ditemukan dengan "Nama Warga", coba kolom B
  if (namaColIndex === -1) {
    namaColIndex = 1; // Kolom B (index 1)
  }

  // Cari tahun dari data
  let tahun = new Date().getFullYear(); // Use current year as default
  for (let i = 0; i < Math.min(data.length, 10); i++) {
    const row = data[i];
    if (!row) continue;
    for (let j = 0; j < row.length; j++) {
      const cell = String(row[j] || '');
      const yearMatch = cell.match(/20\d{2}/);
      if (yearMatch) {
        tahun = parseInt(yearMatch[0]);
        break;
      }
    }
  }

  // okeee
  // Parse data warga mulai dari baris setelah header
  const startRow = headerRowIndex + 1;

  // BATASAN: Hanya baca sampai nomor 162 (Ustd Ading)
  const MAX_ROW_NUMBER = 162;

  for (let i = startRow; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[namaColIndex]) continue;

    const namaFull = String(row[namaColIndex]).trim().replace(/"/g, '');

    // Skip jika bukan nama valid atau baris summary
    if (
      !namaFull ||
      namaFull.length < 2 ||
      namaFull.toLowerCase().includes('total') ||
      namaFull.toLowerCase().includes('nama') ||
      namaFull.toLowerCase().includes('uang lelah') ||
      namaFull.toLowerCase().includes('saldo') ||
      namaFull.toLowerCase().includes('pengeluaran') ||
      namaFull.toLowerCase().includes('beli') ||
      namaFull.toLowerCase().includes('gorol')
    ) {
      continue;
    }

    // Parse nama dan alias (format: "Nama (Alias)" atau "Nama")
    let nama = namaFull;
    let alias = '';
    const aliasMatch = namaFull.match(/(.+?)\s*\((.+?)\)/);
    if (aliasMatch) {
      nama = aliasMatch[1].trim();
      alias = aliasMatch[2].trim();
    }

    const wargaId = wargaData.length + 1;

    // STOP jika sudah mencapai batas maksimal
    if (wargaId > MAX_ROW_NUMBER) {
      console.log(`Stopped at row ${i}: Reached max row number ${MAX_ROW_NUMBER}`);
      break;
    }

    wargaData.push({
      id: wargaId,
      nama: nama,
      alias: alias,
    });

    // Parse pembayaran per bulan
    paymentData[wargaId] = {};
    bulanList.forEach((bulan) => {
      const colIndex = bulanColIndexes[bulan];
      let lunas = false;

      if (colIndex !== undefined && row[colIndex]) {
        const value = String(row[colIndex])
          .trim()
          .replace(/"/g, '')
          .replace(/,/g, '');

        // Cek apakah ada nilai (berarti sudah bayar)
        if (value) {
          const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
          if (!isNaN(numValue) && numValue > 0) {
            lunas = true;
          }
        }
      }

      paymentData[wargaId][bulan] = {
        lunas: lunas,
        tanggalBayar: lunas ? `${tahun}-01-01` : null,
        jumlah: IURAN_AMOUNT,
      };
    });
  }

  // Cari data ringkasan (Uang Lelah dan Saldo)
  let uangLelahPerbulan = 0;
  let saldoUangKematian = 0;
  let totalPerbulan = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[namaColIndex]) continue;

    const cellText = String(row[namaColIndex]).trim().toLowerCase();

    // Cari "Total Perbulan"
    if (cellText.includes('total') && cellText.includes('perbulan')) {
      // Ambil total dari kolom C (index 2)
      if (row[2]) {
        const value = String(row[2]).replace(/[^\d]/g, '');
        totalPerbulan = parseInt(value) || 0;
      }
    }

    // Cari "Uang Lelah perbulan - 10%"
    if (cellText.includes('uang lelah')) {
      // Ambil nilai dari kolom C (index 2)
      if (row[2]) {
        const value = String(row[2]).replace(/[^\d]/g, '');
        uangLelahPerbulan = parseInt(value) || 0;
      }
    }

    // Cari "Saldo UANG KEMATIAN"
    if (cellText.includes('saldo') && cellText.includes('kematian')) {
      // Ambil nilai dari kolom C (index 2)
      if (row[2]) {
        const value = String(row[2]).replace(/[^\d]/g, '');
        saldoUangKematian = parseInt(value) || 0;
      }
    }
  }

  // Validate data before returning
  const validatedWarga = validateWargaData(wargaData);
  const validatedPayments = validatePaymentData(paymentData);

  // Validate ringkasan
  let validatedRingkasan;
  try {
    validatedRingkasan = RingkasanSchema.parse({
      totalPerbulan,
      uangLelahPerbulan,
      saldoUangKematian,
    });
  } catch (error) {
    console.warn('Ringkasan validation warning:', error);
    validatedRingkasan = {
      totalPerbulan: 0,
      uangLelahPerbulan: 0,
      saldoUangKematian: 0,
    };
  }

  return {
    wargaData: validatedWarga,
    paymentData: validatedPayments,
    tahun,
    ringkasan: validatedRingkasan,
  };
};

/**
 * Fetch dan parse data dari Google Sheets dengan retry dan caching
 */
export const fetchGoogleSheetsData = async () => {
  try {
    // Try to fetch fresh data with retry
    const data = await retryWithBackoff(async () => {
      const response = await fetchWithTimeout(SHEET_CSV_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Google Sheets (${response.status} ${response.statusText})`,
        );
      }

      const csvText = await response.text();

      // Parse CSV with papaparse
      const parseResult = Papa.parse(csvText, {
        skipEmptyLines: true,
      });

      if (parseResult.errors.length > 0) {
        console.warn('CSV parsing warnings:', parseResult.errors);
      }

      if (!parseResult.data || parseResult.data.length === 0) {
        throw new Error('No data found in CSV');
      }

      return parseResult.data;
    });

    // Parse data ke format yang dibutuhkan
    const parsedData = parseSheetData(data);

    // Cache the successful result
    setCachedData(parsedData);

    return parsedData;
  } catch (error) {
    console.error('Error fetching Google Sheets:', error);

    // Try to use cached data as fallback
    const cachedData = getCachedData();
    if (cachedData) {
      console.log('Using cached data as fallback');
      return {
        ...cachedData,
        isFromCache: true,
      };
    }

    // If no cache available, throw a user-friendly error
    let errorMessage = 'Gagal memuat data dari Google Sheets.';

    if (error.message.includes('timeout')) {
      errorMessage +=
        ' Koneksi terlalu lambat. Silakan periksa koneksi internet Anda dan coba lagi.';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage +=
        ' Tidak dapat terhubung ke server. Pastikan Anda terhubung ke internet.';
    } else if (error.message.includes('404')) {
      errorMessage +=
        ' Spreadsheet tidak ditemukan. Pastikan URL Google Sheets sudah benar dan spreadsheet dipublikasikan.';
    } else if (error.message.includes('403')) {
      errorMessage +=
        ' Akses ditolak. Pastikan spreadsheet sudah dipublikasikan dan dapat diakses publik.';
    } else {
      errorMessage += ` Detail: ${error.message}`;
    }

    throw new Error(errorMessage);
  }
};

export default fetchGoogleSheetsData;
