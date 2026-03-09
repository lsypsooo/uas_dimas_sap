import { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
      const response = await apiClient.get("/cuti");
      setLeaveHistory(response.data.data || response.data);
    } catch {
      toast.error("Gagal mengambil riwayat cuti.");
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
      await apiClient.post("/cuti", {
        ...formData,
        perusahaanId: session.user?.perusahaan?.id,
        karyawanId: session.user?.karyawan?.id,
      });
      toast.success("Pengajuan cuti berhasil dikirim.");
      fetchMyLeaveHistory();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Gagal mengirim pengajuan cuti.",
      );
    }
  };

  const handleCancelLeave = async (id) => {
    if (
      window.confirm("Apakah Anda yakin ingin membatalkan pengajuan cuti ini?")
    ) {
      try {
        await apiClient.delete(`/cuti/${id}`);
        toast.success("Pengajuan cuti berhasil dibatalkan.");
        fetchMyLeaveHistory();
      } catch (error) {
        toast.error(error.response?.data?.error || "Gagal membatalkan cuti.");
      }
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Pengajuan Cuti</h1>
        <p className="page-subtitle">
          Isi formulir di bawah ini untuk mengajukan cuti baru.
        </p>
      </div>

      <LeaveRequestForm onSave={handleSaveLeaveRequest} />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <LeaveHistoryTable
          leaveHistory={leaveHistory}
          onCancel={handleCancelLeave}
        />
      )}
    </>
  );
};

export default LeaveRequestPage;
