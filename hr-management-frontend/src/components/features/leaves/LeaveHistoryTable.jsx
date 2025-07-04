import React from "react";

// Komponen StatusBadge disesuaikan dengan status baru
const StatusBadge = ({ status }) => {
  const baseClasses =
    "rounded-full py-1 px-3 text-xs font-medium text-white capitalize";
  let colorClass = "bg-gray-400";
  switch (status?.toLowerCase()) {
    case "approved":
    case "disetujui":
      colorClass = "bg-green-500";
      break;
    case "rejected":
    case "ditolak":
      colorClass = "bg-red-500";
      break;
    case "pending":
    case "menunggu":
      colorClass = "bg-yellow-500";
      break;
  }
  return (
    <span className={`${baseClasses} ${colorClass}`}>{status || "N/A"}</span>
  );
};

const LeaveHistoryTable = ({ leaveHistory, onCancel }) => {
  if (!Array.isArray(leaveHistory) || leaveHistory.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="font-medium text-gray-600 dark:text-gray-400">
          Anda belum pernah mengajukan cuti.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black ">
          Riwayat Pengajuan Cuti Anda
        </h4>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Tanggal Mulai
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Tanggal Selesai
              </th>
              <th className="min-w-[250px] py-4 px-4 font-medium text-black ">
                Alasan
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black ">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black ">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.map((request) => (
              <tr key={request.id}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">
                    {new Date(request.tanggalMulai).toLocaleDateString("id-ID")}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">
                    {new Date(request.tanggalSelesai).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">{request.alasan}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <StatusBadge status={request.status} />
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {/* Tampilkan tombol cancel hanya jika status PENDING */}
                  {request.status?.toLowerCase() === "pending" ? (
                    <button
                      onClick={() => onCancel(request.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Batalkan
                    </button>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistoryTable;
