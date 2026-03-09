import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { HiOutlinePlus } from "react-icons/hi";
import apiClient from "../../services/api";
import CompanyTable from "../../components/features/companies/CompanyTable";
import CompanyModal from "../../components/features/companies/CompanyModal";

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/perusahaan");
      setCompanies(response.data);
    } catch {
      toast.error("Gagal mengambil data perusahaan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const handleSaveCompany = async (formData) => {
    try {
      if (editingCompany) {
        await apiClient.put(`/perusahaan/${editingCompany.id}`, formData);
        toast.success("Perusahaan berhasil diperbarui.");
      } else {
        await apiClient.post("/perusahaan/create", formData);
        toast.success("Perusahaan berhasil ditambahkan.");
      }
      handleCloseModal();
      fetchCompanies();
    } catch {
      toast.error("Gagal menyimpan perusahaan.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus perusahaan ini?")) {
      try {
        await apiClient.delete(`/perusahaan/${id}`);
        toast.success("Perusahaan berhasil dihapus.");
        fetchCompanies();
      } catch {
        toast.error("Gagal menghapus perusahaan.");
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Manajemen Perusahaan</h1>
          <p className="page-subtitle">Kelola data perusahaan terdaftar.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn-primary">
          <HiOutlinePlus className="h-5 w-5" />
          Tambah Perusahaan
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <CompanyTable
          companies={companies}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCompany}
        companyToEdit={editingCompany}
      />
    </>
  );
};

export default CompanyPage;
