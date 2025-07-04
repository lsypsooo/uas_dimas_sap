import { useState, useEffect } from "react";
import apiClient from "../../services/api";
import LeaveRequestForm from "../../components/features/leaves/LeaveRequestForm";
import LeaveHistoryTable from "../../components/features/leaves/LeaveHistoryTable";
import { useAuth } from "../../context/AuthContext";

const LeaveRequestPage = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const session = useAuth();
  const fetchMyLeaveHistory = async () => {
    setIsLoading(true);
    try {
      // Panggil endpoint utama, backend akan filter berdasarkan role
      const response = await apiClient.get("/cuti");
      setLeaveHistory(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal mengambil riwayat cuti:", error);
      setLeaveHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaveHistory();
  }, []);

  const handleSaveLeaveRequest = async (formData) => {
    try {
      // Controller createCuti tidak butuh karyawanId dari frontend
      // karena ia akan mengambilnya dari req.user
      await apiClient.post("/cuti", {
        ...formData,
        perusahaanId: session.user.perusahaan.id,
        karyawanId: session.user.karyawan.id,
      });
      alert("Pengajuan cuti berhasil dikirim.");
      fetchMyLeaveHistory();
    } catch (error) {
      console.error("Gagal mengirim pengajuan cuti:", error);
      alert(error.response?.data?.error || "Gagal mengirim pengajuan cuti.");
    }
  };

  // Fungsi baru untuk membatalkan cuti
  const handleCancelLeave = async (id) => {
    if (
      window.confirm("Apakah Anda yakin ingin membatalkan pengajuan cuti ini?")
    ) {
      try {
        await apiClient.delete(`/cuti/${id}`);
        alert("Pengajuan cuti berhasil dibatalkan.");
        fetchMyLeaveHistory();
      } catch (error) {
        console.error("Gagal membatalkan cuti:", error);
        alert(error.response?.data?.error || "Gagal membatalkan cuti.");
      }
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black ">Pengajuan Cuti</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Isi formulir di bawah ini untuk mengajukan cuti baru.
        </p>
      </div>

      <LeaveRequestForm onSave={handleSaveLeaveRequest} />

      {isLoading ? (
        <p className="text-center mt-8">Memuat riwayat...</p>
      ) : (
        <LeaveHistoryTable
          leaveHistory={leaveHistory}
          onCancel={handleCancelLeave} // Kirim fungsi cancel ke tabel
        />
      )}
    </>
  );
};

export default LeaveRequestPage;
