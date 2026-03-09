import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { HiOutlineX } from "react-icons/hi";
import apiClient from "../../../services/api";

const UserAdminModal = ({ isOpen, onClose, onSave, userToEdit }) => {
  const initialFormData = {
    username: "",
    email: "",
    password: "",
    perusahaanId: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [companies, setCompanies] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      apiClient
        .get("/perusahaan")
        .then((response) => setCompanies(response.data))
        .catch(() => toast.error("Gagal mengambil daftar perusahaan."));
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

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.perusahaanId) {
      toast.warn("Username, Email, dan Perusahaan harus diisi.");
      return;
    }
    if (!userToEdit && !formData.password) {
      toast.warn("Password harus diisi untuk user baru.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={userToEdit ? "Edit User Admin" : "Tambah User Admin Baru"}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="card w-full max-w-lg p-0 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {userToEdit ? "Edit User Admin" : "Tambah User Admin Baru"}
          </h2>
          <button onClick={onClose} className="btn-ghost !p-1.5 !rounded-lg">
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder={userToEdit ? "Isi untuk mengubah" : ""}
              required={!userToEdit}
            />
          </div>
          <div>
            <label className="label">Pilih Perusahaan</label>
            <select
              name="perusahaanId"
              value={formData.perusahaanId}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">-- Pilih Perusahaan --</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Batal
            </button>
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAdminModal;
