import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { bulanList, IURAN_AMOUNT } from '../data/wargaData';
import './ExcelImport.css';

function ExcelImport({ onImportData, currentTahun }) {
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const parseExcelData = (worksheet) => {
    // Konversi worksheet ke JSON dengan header
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Cari baris yang berisi header bulan (Januari, Februari, dst)
    let headerRowIndex = -1;
    let namaColIndex = -1;
    let bulanColIndexes = {};

    for (let i = 0; i < Math.min(jsonData.length, 15); i++) {
      const row = jsonData[i];
      if (!row) continue;

      for (let j = 0; j < row.length; j++) {
        const cell = String(row[j] || '').trim();

        // Cek apakah ini kolom Nama Warga
        if (
          cell.toLowerCase().includes('nama') ||
          cell.toLowerCase().includes('warga')
        ) {
          namaColIndex = j;
          headerRowIndex = i;
        }

        // Cek apakah ini kolom bulan
        bulanList.forEach((bulan) => {
          if (cell.toLowerCase() === bulan.toLowerCase()) {
            bulanColIndexes[bulan] = j;
            headerRowIndex = i;
          }
        });
      }
    }

    // Jika header tidak ditemukan, coba dengan pendekatan lain
    if (namaColIndex === -1) {
      // Asumsikan kolom A atau B adalah nama
      namaColIndex = 1; // Kolom B
      headerRowIndex = 6; // Row 7 biasanya header
    }

    // Parse data warga mulai dari baris setelah header
    const wargaData = [];
    const paymentData = {};

    for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || !row[namaColIndex]) continue;

      const namaFull = String(row[namaColIndex]).trim();
      if (!namaFull || namaFull.length < 2) continue;

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
          const value = row[colIndex];
          // Cek apakah ada nilai (berarti sudah bayar)
          if (typeof value === 'number' && value > 0) {
            lunas = true;
          } else if (
            typeof value === 'string' &&
            (value.includes('10') || value.toLowerCase().includes('lunas'))
          ) {
            lunas = true;
          }
        }

        paymentData[wargaId][bulan] = {
          lunas: lunas,
          tanggalBayar: lunas ? `${currentTahun}-01-01` : null,
          jumlah: IURAN_AMOUNT,
        };
      });
    }

    return { wargaData, paymentData };
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Ambil sheet pertama (Data Uang Kematian)
      const sheetName =
        workbook.SheetNames.find((name) =>
          name.toLowerCase().includes('kematian'),
        ) || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const { wargaData, paymentData } = parseExcelData(worksheet);

      if (wargaData.length > 0) {
        setPreviewData({
          wargaData,
          paymentData,
          fileName: file.name,
          sheetName,
          totalWarga: wargaData.length,
        });
        setShowPreview(true);
      } else {
        setImportResult({
          success: false,
          message: 'Tidak dapat menemukan data warga dalam file Excel.',
        });
      }
    } catch (error) {
      console.error('Error parsing Excel:', error);
      setImportResult({
        success: false,
        message: `Error membaca file: ${error.message}`,
      });
    }

    setImporting(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    if (previewData) {
      onImportData(previewData.wargaData, previewData.paymentData);
      setImportResult({
        success: true,
        message: `Berhasil import ${previewData.totalWarga} data warga dari Excel!`,
      });
      setShowPreview(false);
      setPreviewData(null);
    }
  };

  const handleCancelImport = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  const countLunas = (wargaId) => {
    if (!previewData) return 0;
    return bulanList.filter(
      (bulan) => previewData.paymentData[wargaId]?.[bulan]?.lunas,
    ).length;
  };

  return (
    <div className='excel-import'>
      <input
        type='file'
        ref={fileInputRef}
        accept='.xlsx,.xls'
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <button
        className='btn-import-excel'
        onClick={() => fileInputRef.current?.click()}
        disabled={importing}
      >
        {importing ? (
          <>
            <span className='loading-spinner'></span>
            Memproses...
          </>
        ) : (
          <>📥 Import dari Excel</>
        )}
      </button>

      {importResult && (
        <div
          className={`import-result ${importResult.success ? 'success' : 'error'}`}
        >
          {importResult.success ? '✅' : '❌'} {importResult.message}
          <button
            className='close-result'
            onClick={() => setImportResult(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className='modal-overlay'>
          <div className='modal-content preview-modal'>
            <h3>📊 Preview Data Excel</h3>

            <div className='preview-info'>
              <p>
                <strong>File:</strong> {previewData.fileName}
              </p>
              <p>
                <strong>Sheet:</strong> {previewData.sheetName}
              </p>
              <p>
                <strong>Total Warga:</strong> {previewData.totalWarga} orang
              </p>
            </div>

            <div className='preview-table-wrapper'>
              <table className='preview-table'>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Warga</th>
                    <th>Alias</th>
                    <th>Bulan Lunas</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.wargaData.slice(0, 10).map((warga, index) => (
                    <tr key={warga.id}>
                      <td>{index + 1}</td>
                      <td>{warga.nama}</td>
                      <td>{warga.alias || '-'}</td>
                      <td>{countLunas(warga.id)} bulan</td>
                    </tr>
                  ))}
                  {previewData.wargaData.length > 10 && (
                    <tr>
                      <td colSpan='4' className='more-data'>
                        ... dan {previewData.wargaData.length - 10} warga
                        lainnya
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className='modal-actions'>
              <button className='btn-cancel' onClick={handleCancelImport}>
                Batal
              </button>
              <button className='btn-confirm' onClick={handleConfirmImport}>
                ✅ Import Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExcelImport;
