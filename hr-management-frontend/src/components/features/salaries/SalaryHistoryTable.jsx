import { HiOutlineCash } from "react-icons/hi";

const SalaryHistoryTable = ({ salaryHistory }) => {
  if (!Array.isArray(salaryHistory) || salaryHistory.length === 0) {
    return (
      <div className="card p-10 text-center">
        <HiOutlineCash className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-500">
          Belum ada riwayat gaji yang tercatat untuk Anda.
        </p>
      </div>
    );
  }

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Periode
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Jumlah Gaji
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {salaryHistory.map((gaji) => (
              <tr
                key={gaji.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {monthNames[gaji.bulan - 1]} {gaji.tahun}
                </td>
                <td className="px-6 py-4 text-slate-900">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(gaji.jumlah)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    {gaji.status || "Dibayarkan"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryHistoryTable;
