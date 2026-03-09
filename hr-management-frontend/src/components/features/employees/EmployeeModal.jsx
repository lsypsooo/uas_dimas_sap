import { useState, useEffect, useRef } from "react";
import { HiOutlineX } from "react-icons/hi";

const EmployeeModal = ({ isOpen, onClose, onSave, employeeToEdit }) => {
  const initialFormData = {
    nama: "",
    email: "",
    password: "",
    jabatan: "",
    departemen: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        nama: employeeToEdit.user?.username || "",
        email: employeeToEdit.user?.email || "",
        password: "",
        jabatan: employeeToEdit.jabatan || "",
        departemen: employeeToEdit.departemen || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [employeeToEdit, isOpen]);

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
      aria-label={employeeToEdit ? "Edit Karyawan" : "Tambah Karyawan Baru"}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="card w-full max-w-lg p-0 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {employeeToEdit ? "Edit Karyawan" : "Tambah Karyawan Baru"}
          </h2>
          <button onClick={onClose} className="btn-ghost !p-1.5 !rounded-lg">
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
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
              placeholder={employeeToEdit ? "Isi untuk mengubah" : ""}
              required={!employeeToEdit}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Jabatan</label>
              <input
                type="text"
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Departemen</label>
              <input
                type="text"
                name="departemen"
                value={formData.departemen}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
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

export default EmployeeModal;
