import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { HiOutlinePlus } from "react-icons/hi";
import apiClient from "../../services/api";
import EmployeeTable from "../../components/features/employees/EmployeeTable";
import EmployeeModal from "../../components/features/employees/EmployeeModal";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/karyawan");
      setEmployees(response.data.data || response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal mengambil data karyawan.");
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
    if (payload.tanggal_bergabung) {
      payload.tanggal_bergabung = new Date(
        payload.tanggal_bergabung,
      ).toISOString();
    }

    try {
      if (editingEmployee) {
        await apiClient.put(`/karyawan/${editingEmployee.id}`, payload);
        toast.success("Data karyawan berhasil diperbarui.");
      } else {
        await apiClient.post("/karyawan", payload);
        toast.success("Karyawan baru berhasil ditambahkan.");
      }
      handleCloseModal();
      fetchEmployees();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Gagal menyimpan data karyawan.",
      );
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Yakin ingin menghapus karyawan ini?")) {
      try {
        await apiClient.delete(`/karyawan/${id}`);
        toast.success("Karyawan berhasil dihapus.");
        fetchEmployees();
      } catch (error) {
        toast.error(error.response?.data?.error || "Gagal menghapus karyawan.");
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Manajemen Karyawan</h1>
          <p className="page-subtitle">Kelola data karyawan perusahaan.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn-primary">
          <HiOutlinePlus className="h-5 w-5" />
          Tambah Karyawan
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
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
