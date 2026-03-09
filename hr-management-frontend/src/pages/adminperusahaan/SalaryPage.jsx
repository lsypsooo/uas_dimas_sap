import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../../services/api";
import SalaryTable from "../../components/features/salaries/SalaryTable";

const SalaryPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployeesWithSalaries = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/karyawan");
      setEmployees(response.data.data || response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal mengambil data karyawan.");
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesWithSalaries();
  }, []);

  const handleSaveSalary = async (formData) => {
    try {
      await apiClient.post("/gaji", formData);
      toast.success("Data gaji berhasil disimpan.");
      fetchEmployeesWithSalaries();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menyimpan data gaji.");
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Manajemen Gaji Karyawan</h1>
        <p className="page-subtitle">
          Input gaji baru untuk setiap karyawan per periode.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <SalaryTable employees={employees} onSaveSalary={handleSaveSalary} />
      )}
    </>
  );
};

export default SalaryPage;
