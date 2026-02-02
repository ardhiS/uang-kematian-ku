import * as XLSX from 'xlsx';
import { bulanList, IURAN_AMOUNT, formatRupiah } from '../data/wargaData';
import './ExcelImport.css';

function ExcelExport({ wargaList, payments, tahun }) {
  const handleExport = () => {
    // Buat data untuk export
    const exportData = [];

    // Header row 1 - Title
    exportData.push([
      `DATA IURAN UANG KEMATIAN WARGA KP CILETUH RT 05/01 TAHUN ${tahun}`,
    ]);
    exportData.push([]); // Empty row
    exportData.push(['Warna Kuning = Sudah Lunas']);
    exportData.push(['Warna Putih = Belum Lunas']);
    exportData.push([]); // Empty row

    // Header row 2 - Column headers
    const headerRow = ['No', 'Nama Warga', ...bulanList, 'Total Bayar'];
    exportData.push(headerRow);

    // Data rows
    wargaList.forEach((warga, index) => {
      const row = [
        index + 1,
        warga.alias ? `${warga.nama} (${warga.alias})` : warga.nama,
      ];

      let totalBayar = 0;
      bulanList.forEach((bulan) => {
        const isLunas = payments[warga.id]?.[bulan]?.lunas;
        if (isLunas) {
          row.push(IURAN_AMOUNT);
          totalBayar += IURAN_AMOUNT;
        } else {
          row.push('');
        }
      });

      row.push(totalBayar);
      exportData.push(row);
    });

    // Summary row
    const summaryRow = ['', 'Total per Bulan'];
    let grandTotal = 0;
    bulanList.forEach((bulan) => {
      const total = wargaList.reduce((sum, warga) => {
        return sum + (payments[warga.id]?.[bulan]?.lunas ? IURAN_AMOUNT : 0);
      }, 0);
      summaryRow.push(total);
      grandTotal += total;
    });
    summaryRow.push(grandTotal);
    exportData.push(summaryRow);

    // Buat workbook dan worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(exportData);

    // Set column widths
    ws['!cols'] = [
      { wch: 5 }, // No
      { wch: 25 }, // Nama
      ...bulanList.map(() => ({ wch: 12 })), // Bulan
      { wch: 15 }, // Total
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data Uang Kematian');

    // Export file
    XLSX.writeFile(wb, `Iuran_Uang_Kematian_${tahun}.xlsx`);
  };

  return (
    <button className='btn-export-excel' onClick={handleExport}>
      📤 Export ke Excel
    </button>
  );
}

export default ExcelExport;
