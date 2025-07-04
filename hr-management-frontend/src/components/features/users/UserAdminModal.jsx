import { useState, useEffect } from "react";
import apiClient from "../../../services/api";

const UserAdminModal = ({ isOpen, onClose, onSave, userToEdit }) => {
  // Menggunakan 'username' dan 'perusahaanId' sesuai controller
  const initialFormData = {
    username: "",
    email: "",
    password: "",
    perusahaanId: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (isOpen) {
      apiClient
        .get("/perusahaan")
        .then((response) => {
          setCompanies(response.data);
        })
        .catch((error) =>
          console.error("Gagal mengambil daftar perusahaan:", error)
        );
    }
  }, [isOpen]);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        username: userToEdit.username,
        email: userToEdit.email,
        password: "",
        role: "ADMIN_PERUSAHAAN",
        perusahaanId: userToEdit.perusahaanId,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- VALIDASI DITAMBAHKAN DI SINI ---
    if (!formData.username || !formData.email || !formData.perusahaanId) {
      alert("Username, Email, dan Perusahaan harus diisi.");
      return; // Hentikan proses jika validasi gagal
    }
    // Pastikan password diisi saat membuat user baru
    if (!userToEdit && !formData.password) {
      alert("Password harus diisi untuk user baru.");
      return; // Hentikan proses
    }
    // --- AKHIR VALIDASI ---

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
        <h2 className="mb-4 text-xl font-bold text-black  ">
          {userToEdit ? "Edit User Admin" : "Tambah User Admin Baru"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-black  ">Username</label>
            <input
              type="text"
              name="username" // Menggunakan 'username'
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-black  ">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-black  ">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary"
              placeholder={userToEdit ? "Isi untuk mengubah" : ""}
              required={!userToEdit}
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-black  ">Pilih Perusahaan</label>
            <select
              name="perusahaanId" // Menggunakan 'perusahaanId'
              value={formData.perusahaanId}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary text-black  "
              required
            >
              <option value="" className="text-bodydark2">
                -- Pilih Perusahaan --
              </option>
              {companies.map((company) => (
                <option
                  key={company.id}
                  value={company.id}
                  className="text-bodydark2"
                >
                  {company.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 py-2 px-4 font-medium text-black hover:bg-gray-400 dark:bg-gray-600   dark:hover:bg-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded bg-primary py-2 px-4 font-medium text-white hover:bg-opacity-90"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAdminModal;
