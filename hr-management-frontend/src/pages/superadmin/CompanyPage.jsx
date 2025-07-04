// src/pages/CompanyPage.jsx

import { useState, useEffect } from "react";

import apiClient from "../../services/api";
import CompanyTable from "../../components/features/companies/CompanyTable";
import CompanyModal from "../../components/features/companies/CompanyModal";

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Tambahkan state untuk mengelola modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null); // null untuk mode 'tambah', object untuk mode 'edit'

  const fetchCompanies = async () => {
    // ... (fungsi ini tidak berubah)
    setIsLoading(true);
    try {
      const response = await apiClient.get("/perusahaan");
      setCompanies(response.data);
      console.log(companies);
    } catch (error) {
      console.error("Gagal mengambil data perusahaan:", error);
      alert("Gagal mengambil data perusahaan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 3. Buat fungsi-fungsi untuk handle modal
  const handleOpenAddModal = () => {
    setEditingCompany(null); // Pastikan mode 'edit' mati
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company) => {
    setEditingCompany(company); // Set data perusahaan yang akan diedit
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null); // Selalu reset saat ditutup
  };

  const handleSaveCompany = async (formData) => {
    try {
      if (editingCompany) {
        // Mode Edit: Panggil API PUT
        await apiClient.put(`/perusahaan/${editingCompany.id}`, formData);
        alert("Perusahaan berhasil diperbarui.");
      } else {
        // Mode Tambah: Panggil API POST
        await apiClient.post("/perusahaan/create", formData);
        alert("Perusahaan berhasil ditambahkan.");
      }
      handleCloseModal(); // Tutup modal setelah berhasil
      fetchCompanies(); // Ambil ulang data untuk memperbarui tabel
    } catch (error) {
      console.error("Gagal menyimpan perusahaan:", error);
      alert("Gagal menyimpan perusahaan.");
    }
  };

  const handleDelete = async (id) => {
    // ... (fungsi ini tidak berubah)
    if (window.confirm("Apakah Anda yakin ingin menghapus perusahaan ini?")) {
      try {
        await apiClient.delete(`/perusahaan/${id}`);
        alert("Perusahaan berhasil dihapus.");
        fetchCompanies();
      } catch (error) {
        console.error("Gagal menghapus perusahaan:", error);
        alert("Gagal menghapus perusahaan.");
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Manajemen Perusahaan
        </h2>
        {/* 4. Hubungkan tombol Tambah ke fungsi modal */}
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-8 text-center font-medium text-white hover:bg-opacity-90 text-black bg-green-500"
        >
          Tambah Perusahaan
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        // 5. Hubungkan tabel ke fungsi edit modal
        <CompanyTable
          companies={companies}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      {/* 6. Render komponen modal */}
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
