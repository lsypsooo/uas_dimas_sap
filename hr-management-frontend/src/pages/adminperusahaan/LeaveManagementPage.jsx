import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../../services/api";
import LeaveRequestTable from "../../components/features/leaves/LeaveRequestTable";
import {
  useSearchPagination,
  SearchBar,
  Pagination,
} from "../../components/SearchPagination";

const LeaveManagementPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    paginated,
    totalPages,
    total,
    filteredTotal,
  } = useSearchPagination(leaveRequests, [
    "karyawan.user.username",
    "alasan",
    "status",
  ]);

  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/cuti");
      setLeaveRequests(response.data.data || response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Gagal mengambil data pengajuan cuti.",
      );
      setLeaveRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const action = status === "APPROVED" ? "menyetujui" : "menolak";
    if (
      !window.confirm(`Apakah Anda yakin ingin ${action} pengajuan cuti ini?`)
    ) {
      return;
    }

    try {
      await apiClient.put(`/cuti/${id}/status`, { status });
      toast.success(`Pengajuan cuti berhasil di${action}.`);
      fetchLeaveRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.error || `Gagal ${action} pengajuan cuti.`,
      );
    }
  };

  const handleApprove = (id) => handleUpdateStatus(id, "APPROVED");
  const handleReject = (id) => handleUpdateStatus(id, "REJECTED");

  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Manajemen Pengajuan Cuti</h1>
        <p className="page-subtitle">
          Setujui atau tolak pengajuan cuti dari karyawan Anda.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari pengajuan cuti..."
            />
          </div>
          <LeaveRequestTable
            leaveRequests={paginated}
            onApprove={handleApprove}
            onReject={handleReject}
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

export default LeaveManagementPage;
