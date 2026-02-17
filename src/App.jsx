import { useState, useEffect } from 'react';
import PaymentTable from './components/PaymentTable';
import Statistics from './components/Statistics';
import { fetchGoogleSheetsData } from './data/googleSheets';
import { formatRupiah, IURAN_AMOUNT } from './data/wargaData';
import './App.css';

function App() {
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [wargaList, setWargaList] = useState([]);
  const [payments, setPayments] = useState({});
  const [ringkasan, setRingkasan] = useState({
    totalPerbulan: 0,
    uangLelahPerbulan: 0,
    saldoUangKematian: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch data dari Google Sheets
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        wargaData,
        paymentData,
        tahun: sheetTahun,
        ringkasan: sheetRingkasan,
        isFromCache = false,
      } = await fetchGoogleSheetsData();
      setWargaList(wargaData);
      setPayments(paymentData);
      setTahun(sheetTahun);
      setRingkasan(
        sheetRingkasan || {
          totalPerbulan: 0,
          uangLelahPerbulan: 0,
          saldoUangKematian: 0,
        },
      );

      // Update timestamp with cache indicator
      const timestamp = new Date().toLocaleString('id-ID');
      setLastUpdate(isFromCache ? `${timestamp} (dari cache)` : timestamp);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Gagal memuat data dari Google Sheets.');
    } finally {
      setLoading(false);
    }
  };

  // Load data saat pertama kali
  useEffect(() => {
    loadData();
  }, []);

  // Filter warga based on search
  const filteredWarga = wargaList.filter(
    (warga) =>
      warga.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warga.alias.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Refresh data
  const handleRefresh = () => {
    loadData();
  };

  return (
    <div className='app-container'>
      <header className='app-header'>
        <div className='header-content'>
          <div className='logo-section'>
            <div className='logo-icon'>🏘️</div>
            <div className='logo-text'>
              <h1>Data Iuran Uang Kematian</h1>
              <p>KP Ciletuh RT 05/01</p>
            </div>
          </div>
          <div className='header-info'>
            <div className='year-display'>
              <span className='year-label'>Tahun</span>
              <span className='year-value'>{tahun}</span>
            </div>
            <button
              className='btn-refresh'
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? '⏳' : '🔄'} Refresh Data
            </button>
          </div>
        </div>
      </header>

      <main className='app-main'>
        {/* Loading State */}
        {loading && (
          <div className='loading-container'>
            <div className='loading-spinner-large'></div>
            <p>Memuat data dari Google Sheets...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className='error-container'>
            <div className='error-icon'>⚠️</div>
            <h3>Terjadi Kesalahan</h3>
            <p>{error}</p>
            <button className='btn-retry' onClick={handleRefresh}>
              🔄 Coba Lagi
            </button>
          </div>
        )}

        {/* Data Loaded */}
        {!loading && !error && (
          <>
            <div className='legend-section'>
              <div className='legend-info'>
                Iuran per bulan: <strong>{formatRupiah(IURAN_AMOUNT)}</strong>
              </div>
              {lastUpdate && (
                <div className='last-update'>
                  Terakhir diperbarui: {lastUpdate}
                </div>
              )}
            </div>

            <div className='action-bar'>
              <div className='search-box'>
                <span className='search-icon'>🔍</span>
                <input
                  type='text'
                  placeholder='Cari nama warga...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className='clear-search'
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className='data-source-info'>
                <span className='source-icon'>📊</span>
                <span>Data dari Google Sheets (Read Only)</span>
              </div>
            </div>

            <PaymentTable
              wargaList={filteredWarga}
              payments={payments}
              tahun={tahun}
              readOnly={true}
            />

            <Statistics
              wargaList={wargaList}
              payments={payments}
              tahun={tahun}
              ringkasan={ringkasan}
            />
          </>
        )}
      </main>

      <footer className='app-footer'>
        <p>© {tahun} RT 05/01 KP Ciletuh - Sistem Iuran Uang Kematian</p>
        <p className='footer-note'>
          Data bersumber dari Google Sheets | Untuk perubahan data hubungi Admin
        </p>
      </footer>
    </div>
  );
}

export default App;
