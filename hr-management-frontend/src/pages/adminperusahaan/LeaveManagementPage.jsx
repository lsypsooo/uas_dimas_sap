import { useState, useEffect } from "react";
import apiClient from "../../services/api";
import LeaveRequestTable from "../../components/features/leaves/LeaveRequestTable";

const LeaveManagementPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil semua pengajuan cuti dari backend
  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    try {
      // Asumsi endpoint /cuti akan mengembalikan semua cuti di perusahaan admin
      const response = await apiClient.get("/cuti");
      setLeaveRequests(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengajuan cuti:", error);
      setLeaveRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Fungsi untuk mengubah status pengajuan cuti
  const handleUpdateStatus = async (id, status) => {
    const action = status === "Disetujui" ? "menyetujui" : "menolak";
    if (
      !window.confirm(`Apakah Anda yakin ingin ${action} pengajuan cuti ini?`)
    ) {
      return;
    }

    try {
      // Asumsi endpoint untuk update status adalah seperti ini
      await apiClient.put(`/cuti/${id}/status`, { status });
      alert(`Pengajuan cuti berhasil di${action}.`);
      fetchLeaveRequests(); // Refresh data tabel
    } catch (error) {
      console.error(`Gagal ${action} pengajuan cuti:`, error);
      alert(error.response?.data?.error || `Gagal ${action} pengajuan cuti.`);
    }
  };

  const handleApprove = (id) => {
    handleUpdateStatus(id, "Disetujui");
  };

  const handleReject = (id) => {
    handleUpdateStatus(id, "Ditolak");
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black ">
          Manajemen Pengajuan Cuti
        </h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Setujui atau tolak pengajuan cuti dari karyawan Anda.
        </p>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <LeaveRequestTable
          leaveRequests={leaveRequests}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
};

export default LeaveManagementPage;
