import React from "react";

// Komponen StatusBadge disesuaikan dengan status baru dari controller
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
    case "pending": // Diubah dari 'menunggu'
      colorClass = "bg-yellow-500";
      break;
  }

  return (
    <span className={`${baseClasses} ${colorClass}`}>{status || "N/A"}</span>
  );
};

const LeaveRequestTable = ({ leaveRequests, onApprove, onReject }) => {
  if (!Array.isArray(leaveRequests) || leaveRequests.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-10 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="font-medium text-black ">
          Belum ada pengajuan cuti dari karyawan.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[200px] py-4 px-4 font-medium text-black  xl:pl-11">
                Nama Karyawan
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black ">
                Tanggal Mulai
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black ">
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
            {leaveRequests.map((request) => (
              <tr key={request.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black ">
                    {request.karyawan?.user?.username || "N/A"}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {/* PERBAIKAN 1: Menggunakan 'tanggalMulai' */}
                  <p className="text-black ">
                    {new Date(request.tanggalMulai).toLocaleDateString("id-ID")}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {/* PERBAIKAN 1: Menggunakan 'tanggalSelesai' */}
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
                  {/* PERBAIKAN 2: Memeriksa status 'pending' */}
                  {request.status?.toLowerCase() === "pending" ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onApprove(request.id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => onReject(request.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Tolak
                      </button>
                    </div>
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

export default LeaveRequestTable;
