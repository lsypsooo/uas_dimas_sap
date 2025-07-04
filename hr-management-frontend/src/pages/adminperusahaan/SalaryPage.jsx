import { useState, useEffect } from "react";
import apiClient from "../../services/api";
import SalaryTable from "../../components/features/salaries/SalaryTable";
// Kita tidak lagi memerlukan SalaryModal di halaman ini
// import SalaryModal from '../../components/features/salaries/SalaryModal';

const SalaryPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk modal tidak lagi diperlukan
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployeesWithSalaries = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/karyawan");
      setEmployees(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal mengambil data karyawan:", error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesWithSalaries();
  }, []);

  // Fungsi handle modal tidak lagi diperlukan
  // const handleOpenManageModal = (employee) => { ... };
  // const handleCloseModal = () => { ... };

  // Fungsi ini sekarang akan dipanggil langsung dari tabel
  const handleSaveSalary = async (formData) => {
    try {
      await apiClient.post("/gaji", formData);
      alert("Data gaji berhasil disimpan.");
      // Tidak perlu menutup modal, cukup refresh data tabel
      fetchEmployeesWithSalaries();
    } catch (error) {
      console.error("Gagal menyimpan data gaji:", error);
      alert(error.response?.data?.error || "Gagal menyimpan data gaji.");
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Manajemen Gaji Karyawan
        </h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Input gaji baru untuk setiap karyawan per periode.
        </p>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        // Berikan fungsi handleSaveSalary ke SalaryTable melalui prop onSaveSalary
        <SalaryTable employees={employees} onSaveSalary={handleSaveSalary} />
      )}

      {/* Komponen SalaryModal tidak lagi dirender di sini */}
    </>
  );
};

export default SalaryPage;
