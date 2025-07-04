// src/components/features/companies/CompanyModal.jsx

import { useState, useEffect } from "react";

const CompanyModal = ({ isOpen, onClose, onSave, companyToEdit }) => {
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    email: "",
  });

  // useEffect ini akan mengisi form jika kita dalam mode 'edit'
  useEffect(() => {
    if (companyToEdit) {
      setFormData({
        nama: companyToEdit.nama,
        alamat: companyToEdit.alamat,
        telepon: companyToEdit.telepon,
        email: companyToEdit.email,
      });
    } else {
      // Reset form jika kita dalam mode 'tambah'
      setFormData({ nama: "", alamat: "", telepon: "", email: "" });
    }
  }, [companyToEdit, isOpen]); // Dijalankan saat companyToEdit atau isOpen berubah

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.alamat) {
      alert("semua field wajib di isi.");
      return;
    }
    // Kirim data ke parent component (CompanyPage)
    onSave(formData);
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      {/* Modal Content */}
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark text-black">
        <h2 className="mb-4 text-xl font-bold text-black dark:text-black">
          {companyToEdit ? "Edit Perusahaan" : "Tambah Perusahaan Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="text-black">
          <div className="mb-4">
            <label htmlFor="nama" className="mb-2 block text-black ">
              Nama Perusahaan
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="telepon" className="mb-2 block text-black ">
              No telepon
            </label>
            <input
              type="text"
              id="telepon"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-black ">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="alamat" className="mb-2 block text-black ">
              Alamat
            </label>
            <textarea
              rows={3}
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 py-2 px-4 font-medium text-black hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded bg-primary py-2 px-4 font-medium text-black hover:bg-opacity-90"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;
