import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { HiOutlineX } from "react-icons/hi";

const CompanyModal = ({ isOpen, onClose, onSave, companyToEdit }) => {
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (companyToEdit) {
      setFormData({
        nama: companyToEdit.nama,
        alamat: companyToEdit.alamat,
        telepon: companyToEdit.telepon,
        email: companyToEdit.email,
      });
    } else {
      setFormData({ nama: "", alamat: "", telepon: "", email: "" });
    }
  }, [companyToEdit, isOpen]);

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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.alamat) {
      toast.warn("Semua field wajib diisi.");
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
      aria-label={companyToEdit ? "Edit Perusahaan" : "Tambah Perusahaan Baru"}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="card w-full max-w-lg p-0 shadow-xl animate-in fade-in"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {companyToEdit ? "Edit Perusahaan" : "Tambah Perusahaan Baru"}
          </h2>
          <button onClick={onClose} className="btn-ghost !p-1.5 !rounded-lg">
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nama" className="label">
              Nama Perusahaan
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="telepon" className="label">
              No Telepon
            </label>
            <input
              type="text"
              id="telepon"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="alamat" className="label">
              Alamat
            </label>
            <textarea
              rows={3}
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="input"
              required
            />
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

export default CompanyModal;
