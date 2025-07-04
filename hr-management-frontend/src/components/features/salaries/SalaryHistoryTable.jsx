import React from "react";

const SalaryHistoryTable = ({ salaryHistory }) => {
  if (!Array.isArray(salaryHistory) || salaryHistory.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-10 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="font-medium text-black ">
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
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] py-4 px-4 font-medium text-black  xl:pl-11">
                Periode
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black ">
                Jumlah Gaji
              </th>
              <th className="py-4 px-4 font-medium text-black ">Status</th>
            </tr>
          </thead>
          <tbody>
            {salaryHistory.map((gaji) => (
              <tr key={gaji.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black ">
                    {monthNames[gaji.bulan - 1]} {gaji.tahun}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(gaji.jumlah)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {/* Anda bisa menambahkan field status di backend jika perlu */}
                  <p className="inline-flex rounded-full bg-green-100 py-1 px-3 text-sm font-medium text-green-700">
                    Dibayarkan
                  </p>
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
