import { HiOutlineCalendar, HiOutlineCheck, HiOutlineX } from "react-icons/hi";

const StatusBadge = ({ status }) => {
  const config = {
    approved: "bg-emerald-50 text-emerald-700",
    disetujui: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    ditolak: "bg-red-50 text-red-700",
    pending: "bg-amber-50 text-amber-700",
  };
  const colorClass =
    config[status?.toLowerCase()] || "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colorClass}`}
    >
      {status || "N/A"}
    </span>
  );
};

const LeaveRequestTable = ({ leaveRequests, onApprove, onReject }) => {
  if (!Array.isArray(leaveRequests) || leaveRequests.length === 0) {
    return (
      <div className="card p-10 text-center">
        <HiOutlineCalendar className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-500">
          Belum ada pengajuan cuti dari karyawan.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Nama Karyawan
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Tanggal Mulai
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Tanggal Selesai
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Alasan
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Status
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaveRequests.map((request) => (
              <tr
                key={request.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {request.karyawan?.user?.username || "N/A"}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(request.tanggalMulai).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(request.tanggalSelesai).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 text-slate-600 max-w-[250px] truncate">
                  {request.alasan}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-6 py-4">
                  {request.status?.toLowerCase() === "pending" ? (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onApprove(request.id)}
                        className="btn-ghost !p-2 !text-emerald-600 hover:!bg-emerald-50"
                        title="Setujui"
                      >
                        <HiOutlineCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onReject(request.id)}
                        className="btn-ghost !p-2 !text-red-600 hover:!bg-red-50"
                        title="Tolak"
                      >
                        <HiOutlineX className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-right block">-</span>
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
