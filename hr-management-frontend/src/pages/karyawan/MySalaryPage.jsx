import { useState, useEffect } from "react";
import apiClient from "../../services/api";
import SalaryHistoryTable from "../../components/features/salaries/SalaryHistoryTable";

const MySalaryPage = () => {
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMySalary = async () => {
      setIsLoading(true);
      try {
        // Asumsi endpoint ini ada di backend untuk mengambil gaji user yg login
        const response = await apiClient.get("/gaji/my");
        setSalaryHistory(response.data.data || response.data);
      } catch (error) {
        console.error("Gagal mengambil riwayat gaji:", error);
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
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Riwayat Gaji Saya
        </h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Berikut adalah daftar gaji yang telah Anda terima.
        </p>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <SalaryHistoryTable salaryHistory={salaryHistory} />
      )}
    </>
  );
};

export default MySalaryPage;
