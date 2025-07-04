import { useState, useEffect } from "react";

const EmployeeModal = ({ isOpen, onClose, onSave, employeeToEdit }) => {
  // 1. Sesuaikan initialFormData dengan field dari controller baru
  const initialFormData = {
    nama: "",
    email: "",
    password: "",
    jabatan: "",
    departemen: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  // Mengisi form jika dalam mode edit
  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        nama: employeeToEdit.user?.username || "", // Backend menggunakan 'username' di dalam 'user'
        email: employeeToEdit.user?.email || "",
        password: "", // Selalu kosongkan password saat edit
        jabatan: employeeToEdit.jabatan || "",
        departemen: employeeToEdit.departemen || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
        <h2 className="mb-4 text-xl font-bold text-black">
          {employeeToEdit ? "Edit Karyawan" : "Tambah Karyawan Baru"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* 2. Sesuaikan semua field di form */}
          <div className="mb-4">
            <label className="mb-2 block text-black">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-black">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5"
              placeholder={employeeToEdit ? "Isi untuk mengubah" : ""}
              required={!employeeToEdit}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-black">Jabatan</label>
            <input
              type="text"
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-black ">Departemen</label>
            <input
              type="text"
              name="departemen"
              value={formData.departemen}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 py-2 px-4 font-medium text-black hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded bg-primary py-2 px-4 font-medium text-white hover:bg-opacity-90 bg-green-400"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
