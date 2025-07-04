import { useState, useEffect } from "react";
import apiClient from "../../services/api";
import EmployeeTable from "../../components/features/employees/EmployeeTable";
import EmployeeModal from "../../components/features/employees/EmployeeModal";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fungsi ini akan mengambil karyawan dari perusahaan admin yang sedang login
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/karyawan"); // Asumsi backend filter otomatis
      setEmployees(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal mengambil data karyawan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveEmployee = async (formData) => {
    const payload = { ...formData };
    if (editingEmployee && !payload.password) {
      delete payload.password;
    }
    // Backend harus bisa mengubah tanggal dari string ke format DateTime
    if (payload.tanggal_bergabung) {
      payload.tanggal_bergabung = new Date(
        payload.tanggal_bergabung
      ).toISOString();
    }

    try {
      if (editingEmployee) {
        await apiClient.put(`/karyawan/${editingEmployee.id}`, payload);
        alert("Data karyawan berhasil diperbarui.");
      } else {
        await apiClient.post("/karyawan", payload); // Endpoint untuk membuat karyawan baru
        alert("Karyawan baru berhasil ditambahkan.");
      }
      handleCloseModal();
      fetchEmployees();
    } catch (error) {
      console.error("Gagal menyimpan data karyawan:", error);
      alert(error.response?.data?.error || "Gagal menyimpan data karyawan.");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Yakin ingin menghapus karyawan ini?")) {
      try {
        await apiClient.delete(`/karyawan/${id}`);
        alert("Karyawan berhasil dihapus.");
        fetchEmployees();
      } catch (error) {
        console.error("Gagal menghapus karyawan:", error);
        alert(error.response?.data?.error || "Gagal menghapus karyawan.");
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-black ">
          Manajemen Karyawan
        </h2>
        <button
          onClick={handleOpenAddModal}
          className="rounded-md bg-primary py-3 px-8 text-center font-medium text-white hover:bg-opacity-90 bg-blue-500"
        >
          Tambah Karyawan
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <EmployeeTable
          employees={employees}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteEmployee}
        />
      )}

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        employeeToEdit={editingEmployee}
      />
    </>
  );
};

export default EmployeePage;
