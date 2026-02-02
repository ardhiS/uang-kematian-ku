import { bulanList, IURAN_AMOUNT } from './wargaData';

// URL CSV langsung dari Google Sheets yang sudah dipublikasikan
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDyeE0k15VRkO0HHp7di6fDFbPgHNhmAvP-HfFlzrJpIYXJUd3CR1doN6l0G7txw/pub?gid=177051850&single=true&output=csv';

// Parse CSV string ke array
const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV dengan handling untuk quoted strings
    const row = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    result.push(row);
  }

  return result;
};

// Fetch dan parse data dari Google Sheets
export const fetchGoogleSheetsData = async () => {
  try {
    const response = await fetch(SHEET_CSV_URL);

    if (!response.ok) {
      throw new Error('Gagal mengambil data dari Google Sheets');
    }

    const csvText = await response.text();
    const data = parseCSV(csvText);

    // Parse data ke format yang dibutuhkan
    return parseSheetData(data);
  } catch (error) {
    console.error('Error fetching Google Sheets:', error);
    throw error;
  }
};

// Parse data sheet ke format warga dan payments
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
  let tahun = 2026;
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

  // Parse data warga mulai dari baris setelah header
  const startRow = headerRowIndex + 1;

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
      namaFull.toLowerCase().includes('saldo')
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

  return {
    wargaData,
    paymentData,
    tahun,
    ringkasan: {
      totalPerbulan,
      uangLelahPerbulan,
      saldoUangKematian,
    },
  };
};

export default fetchGoogleSheetsData;
