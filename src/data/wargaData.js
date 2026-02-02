// Data warga KP Ciletuh RT 05/01
export const initialWargaData = [
  { id: 1, nama: 'Basuni Rahmat', alias: '' },
  { id: 2, nama: 'Samsul Azis', alias: '' },
  { id: 3, nama: 'Asep Kande', alias: 'Cecep Nurdin' },
  { id: 4, nama: 'Agus Rohmeh', alias: '' },
  { id: 5, nama: 'Dedih Wahyudin', alias: 'Eva' },
  { id: 6, nama: 'Indah Pematasari', alias: '' },
  { id: 7, nama: 'Evi Rahmawati', alias: '' },
  { id: 8, nama: 'Parizalmidi', alias: '' },
  { id: 9, nama: 'Yana Suryana', alias: '' },
  { id: 10, nama: 'Hasanudin', alias: 'Cacan' },
  { id: 11, nama: 'Dade', alias: '' },
  { id: 12, nama: 'Pa Jati', alias: '' },
  { id: 13, nama: 'Udin Bin Duki', alias: '' },
  { id: 14, nama: 'Herman', alias: 'Moncos' },
  { id: 15, nama: 'Samsu', alias: 'Acu' },
  { id: 16, nama: 'Empat Fatimah', alias: '' },
  { id: 17, nama: 'Dede Supriyatna', alias: 'Ede' },
  { id: 18, nama: 'Pian Sopian', alias: '' },
  { id: 19, nama: 'Sahya', alias: '' },
  { id: 20, nama: 'Ridwanudin', alias: 'Ucung' },
];

export const bulanList = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const IURAN_AMOUNT = 10000;

// Helper function untuk format currency
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function untuk generate initial payment data
export const generateInitialPayments = (wargaList, tahun) => {
  const payments = {};

  wargaList.forEach((warga) => {
    payments[warga.id] = {};
    bulanList.forEach((bulan) => {
      payments[warga.id][bulan] = {
        lunas: false,
        tanggalBayar: null,
        jumlah: IURAN_AMOUNT,
      };
    });
  });

  // Set some initial payments based on the image (Januari 2026)
  const paidInJanuari = [1, 2, 3, 5, 9, 10, 11, 15, 19, 20]; // IDs of those who paid in January
  paidInJanuari.forEach((id) => {
    if (payments[id]) {
      payments[id]['Januari'] = {
        lunas: true,
        tanggalBayar: `2026-01-15`,
        jumlah: IURAN_AMOUNT,
      };
    }
  });

  return payments;
};
