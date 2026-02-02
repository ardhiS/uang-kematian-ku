import { bulanList, formatRupiah, IURAN_AMOUNT } from '../data/wargaData';
import './PaymentTable.css';

function PaymentTable({ wargaList, payments, tahun, readOnly = false }) {
  const getDisplayName = (warga) => {
    if (warga.alias) {
      return `${warga.nama} (${warga.alias})`;
    }
    return warga.nama;
  };

  const isLunas = (wargaId, bulan) => {
    return payments[wargaId]?.[bulan]?.lunas || false;
  };

  // Calculate statistics
  const getTotalLunas = (wargaId) => {
    return bulanList.filter((bulan) => isLunas(wargaId, bulan)).length;
  };

  const getTotalBelumLunas = (wargaId) => {
    return bulanList.length - getTotalLunas(wargaId);
  };

  const getTotalPembayaranWarga = (wargaId) => {
    return getTotalLunas(wargaId) * IURAN_AMOUNT;
  };

  const getTotalPembayaranBulan = (bulan) => {
    return (
      wargaList.filter((warga) => isLunas(warga.id, bulan)).length *
      IURAN_AMOUNT
    );
  };

  const getTotalWargaLunasBulan = (bulan) => {
    return wargaList.filter((warga) => isLunas(warga.id, bulan)).length;
  };

  return (
    <div className='payment-table-container'>
      <div className='table-wrapper'>
        <table className='payment-table'>
          <thead>
            <tr>
              <th rowSpan='2' className='sticky-col no-col'>
                No
              </th>
              <th rowSpan='2' className='sticky-col nama-col'>
                Nama Warga
              </th>
              <th colSpan={bulanList.length} className='tahun-header'>
                {tahun}
              </th>
              <th rowSpan='2' className='total-col'>
                Total Bayar
              </th>
            </tr>
            <tr>
              {bulanList.map((bulan) => (
                <th key={bulan} className='bulan-header'>
                  {bulan}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wargaList.map((warga, index) => (
              <tr key={warga.id}>
                <td className='sticky-col no-col'>{index + 1}</td>
                <td className='sticky-col nama-col'>{getDisplayName(warga)}</td>
                {bulanList.map((bulan) => (
                  <td
                    key={bulan}
                    className={`payment-cell ${isLunas(warga.id, bulan) ? 'lunas' : 'belum-lunas'} ${readOnly ? 'readonly' : ''}`}
                    title={
                      isLunas(warga.id, bulan) ? 'Sudah Lunas' : 'Belum Lunas'
                    }
                  >
                    {isLunas(warga.id, bulan)
                      ? formatRupiah(IURAN_AMOUNT)
                      : '-'}
                  </td>
                ))}
                <td className='total-cell'>
                  {formatRupiah(getTotalPembayaranWarga(warga.id))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className='summary-row'>
              <td colSpan='2' className='sticky-col summary-label'>
                Total per Bulan
              </td>
              {bulanList.map((bulan) => (
                <td key={bulan} className='summary-cell'>
                  <div className='summary-amount'>
                    {formatRupiah(getTotalPembayaranBulan(bulan))}
                  </div>
                  <div className='summary-count'>
                    {getTotalWargaLunasBulan(bulan)} warga
                  </div>
                </td>
              ))}
              <td className='grand-total'>
                {formatRupiah(
                  wargaList.reduce(
                    (total, warga) => total + getTotalPembayaranWarga(warga.id),
                    0,
                  ),
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default PaymentTable;
