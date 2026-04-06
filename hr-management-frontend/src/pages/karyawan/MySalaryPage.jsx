import { useState, useEffect } from "react";
import apiClient from "../../services/api";
import SalaryHistoryTable from "../../components/features/salaries/SalaryHistoryTable";
import {
  useSearchPagination,
  SearchBar,
  Pagination,
} from "../../components/SearchPagination";

const MySalaryPage = () => {
  const [salaryHistory, setSalaryHistory] = useState([]);
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
  } = useSearchPagination(salaryHistory, ["bulan", "tahun", "jumlah"]);

  useEffect(() => {
    const fetchMySalary = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/gaji/me");
        setSalaryHistory(response.data.data || response.data);
      } catch {
        setSalaryHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMySalary();
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Riwayat Gaji Saya</h1>
        <p className="page-subtitle">
          Berikut adalah daftar gaji yang telah Anda terima.
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
              placeholder="Cari gaji..."
            />
          </div>
          <SalaryHistoryTable salaryHistory={paginated} />
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

export default MySalaryPage;
