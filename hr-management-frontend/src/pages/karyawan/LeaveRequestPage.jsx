import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../../services/api";
import LeaveRequestForm from "../../components/features/leaves/LeaveRequestForm";
import LeaveHistoryTable from "../../components/features/leaves/LeaveHistoryTable";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineClock,
} from "react-icons/hi";
import {
  useSearchPagination,
  SearchBar,
  Pagination,
} from "../../components/SearchPagination";

const LeaveRequestPage = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const session = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    paginated,
    totalPages,
    total,
    filteredTotal,
  } = useSearchPagination(leaveHistory, ["alasan", "status"]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [historyRes, balanceRes] = await Promise.all([
        apiClient.get("/cuti"),
        apiClient.get("/cuti/balance"),
      ]);
      setLeaveHistory(historyRes.data.data || historyRes.data);
      setLeaveBalance(balanceRes.data);
    } catch {
      toast.error("Gagal mengambil data cuti.");
      setLeaveHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveLeaveRequest = async (formData) => {
    try {
      await apiClient.post("/cuti", {
        ...formData,
        perusahaanId: session.user?.perusahaan?.id,
        karyawanId: session.user?.karyawan?.id,
      });
      toast.success("Pengajuan cuti berhasil dikirim.");
      fetchData();
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
        fetchData();
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

      {/* Leave Balance Cards */}
      {leaveBalance && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <HiOutlineCalendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                Jatah Cuti
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {leaveBalance.jatahCuti}{" "}
                <span className="text-sm font-normal text-slate-500">hari</span>
              </p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <HiOutlineCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                Sisa Cuti
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {leaveBalance.sisa}{" "}
                <span className="text-sm font-normal text-slate-500">hari</span>
              </p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <HiOutlineClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">
                Terpakai / Pending
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {leaveBalance.terpakai}{" "}
                <span className="text-sm font-normal text-slate-500">
                  / {leaveBalance.pending}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <LeaveRequestForm onSave={handleSaveLeaveRequest} />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <>
          <div className="mt-8 mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari riwayat cuti..."
            />
          </div>
          <LeaveHistoryTable
            leaveHistory={paginated}
            onCancel={handleCancelLeave}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            filteredTotal={filteredTotal}
            total={total}
          />
        </>
      )}
    </>
  );
};

export default LeaveRequestPage;
