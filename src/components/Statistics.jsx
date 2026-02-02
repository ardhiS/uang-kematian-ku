import { useState } from 'react';
import { formatRupiah, IURAN_AMOUNT, bulanList } from '../data/wargaData';
import './Statistics.css';

function Statistics({ wargaList, payments, tahun, ringkasan = {} }) {
  const [showDetail, setShowDetail] = useState(false);

  const {
    totalPerbulan = 0,
    uangLelahPerbulan = 0,
    saldoUangKematian = 0,
  } = ringkasan;

  const getTotalLunas = () => {
    let count = 0;
    wargaList.forEach((warga) => {
      bulanList.forEach((bulan) => {
        if (payments[warga.id]?.[bulan]?.lunas) {
          count++;
        }
      });
    });
    return count;
  };

  const getTotalBelumLunas = () => {
    const totalCells = wargaList.length * bulanList.length;
    return totalCells - getTotalLunas();
  };

  const getTotalPemasukan = () => {
    return getTotalLunas() * IURAN_AMOUNT;
  };

  const getPersentaseLunas = () => {
    const total = wargaList.length * bulanList.length;
    return total > 0 ? ((getTotalLunas() / total) * 100).toFixed(1) : 0;
  };

  const getWargaLunasPerBulan = (bulan) => {
    return wargaList.filter((warga) => payments[warga.id]?.[bulan]?.lunas)
      .length;
  };

  const getWargaFullLunas = () => {
    return wargaList.filter((warga) =>
      bulanList.every((bulan) => payments[warga.id]?.[bulan]?.lunas),
    ).length;
  };

  return (
    <div className='statistics-container'>
      <div className='stats-grid'>
        <div className='stat-card total-pemasukan'>
          <div className='stat-icon'>💰</div>
          <div className='stat-content'>
            <h3>Total Pemasukan</h3>
            <p className='stat-value'>{formatRupiah(getTotalPemasukan())}</p>
          </div>
        </div>

        <div className='stat-card total-lunas'>
          <div className='stat-icon'>✅</div>
          <div className='stat-content'>
            <h3>Pembayaran Lunas</h3>
            <p className='stat-value'>
              {getTotalLunas()} <span className='stat-unit'>transaksi</span>
            </p>
          </div>
        </div>

        <div className='stat-card total-belum'>
          <div className='stat-icon'>⏳</div>
          <div className='stat-content'>
            <h3>Belum Lunas</h3>
            <p className='stat-value'>
              {getTotalBelumLunas()}{' '}
              <span className='stat-unit'>transaksi</span>
            </p>
          </div>
        </div>

        <div className='stat-card persentase'>
          <div className='stat-icon'>📊</div>
          <div className='stat-content'>
            <h3>Persentase Lunas</h3>
            <p className='stat-value'>{getPersentaseLunas()}%</p>
            <div className='progress-bar'>
              <div
                className='progress-fill'
                style={{ width: `${getPersentaseLunas()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ringkasan Keuangan dari Google Sheets */}
      <div className='financial-summary'>
        <h4>💵 Ringkasan Keuangan</h4>
        <div className='summary-grid'>
          <div className='summary-item'>
            <span className='summary-label'>Total Perbulan</span>
            <span className='summary-value positive'>
              {formatRupiah(totalPerbulan)}
            </span>
          </div>
          <div className='summary-item deduction'>
            <span className='summary-label'>Uang Lelah Perbulan (10%)</span>
            <span className='summary-value negative'>
              - {formatRupiah(uangLelahPerbulan)}
            </span>
          </div>
          <div className='summary-item total'>
            <span className='summary-label'>Saldo UANG KEMATIAN</span>
            <span className='summary-value highlight'>
              {formatRupiah(saldoUangKematian)}
            </span>
          </div>
        </div>
      </div>

      <div className='stats-info'>
        <div className='info-item'>
          <span className='info-label'>Total Warga:</span>
          <span className='info-value'>{wargaList.length} orang</span>
        </div>
        <div className='info-item'>
          <span className='info-label'>Iuran per Bulan:</span>
          <span className='info-value'>{formatRupiah(IURAN_AMOUNT)}</span>
        </div>
        <div className='info-item'>
          <span className='info-label'>Warga Lunas Penuh:</span>
          <span className='info-value'>{getWargaFullLunas()} orang</span>
        </div>
        <div className='info-item'>
          <span className='info-label'>Target Tahunan:</span>
          <span className='info-value'>
            {formatRupiah(wargaList.length * bulanList.length * IURAN_AMOUNT)}
          </span>
        </div>
      </div>

      <button
        className='btn-toggle-detail'
        onClick={() => setShowDetail(!showDetail)}
      >
        {showDetail ? 'Sembunyikan Detail' : 'Lihat Detail per Bulan'}
        <span className={`arrow ${showDetail ? 'up' : 'down'}`}>▼</span>
      </button>

      {showDetail && (
        <div className='monthly-detail'>
          <h4>Detail Pembayaran per Bulan - {tahun}</h4>
          <div className='monthly-grid'>
            {bulanList.map((bulan) => (
              <div key={bulan} className='monthly-card'>
                <div className='monthly-name'>{bulan}</div>
                <div className='monthly-stats'>
                  <div className='monthly-paid'>
                    <span className='paid-count'>
                      {getWargaLunasPerBulan(bulan)}
                    </span>
                    <span className='paid-label'>Lunas</span>
                  </div>
                  <div className='monthly-unpaid'>
                    <span className='unpaid-count'>
                      {wargaList.length - getWargaLunasPerBulan(bulan)}
                    </span>
                    <span className='unpaid-label'>Belum</span>
                  </div>
                </div>
                <div className='monthly-amount'>
                  {formatRupiah(getWargaLunasPerBulan(bulan) * IURAN_AMOUNT)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Statistics;
