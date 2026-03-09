import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { HiOutlineX } from "react-icons/hi";

const SalaryModal = ({ isOpen, onClose, onSave, employee }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const initialFormData = {
    jumlah: "",
    bulan: currentMonth,
    tahun: currentYear,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) setFormData(initialFormData);
  }, [isOpen]);

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
    const processedValue = ["jumlah", "bulan", "tahun"].includes(name)
      ? parseInt(value, 10)
      : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jumlah || !formData.bulan || !formData.tahun) {
      toast.warn("Jumlah, Bulan, dan Tahun wajib diisi.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave({ ...formData, karyawanId: employee.id });
    } finally {
      setIsSaving(false);
    }
  };

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Buat Gaji Baru"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="card w-full max-w-lg p-0 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Buat Gaji Baru
            </h2>
            <p className="text-sm text-slate-500">
              untuk {employee?.user?.username}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost !p-1.5 !rounded-lg">
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Jumlah Gaji (Rp)</label>
            <input
              type="number"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Bulan</label>
              <select
                name="bulan"
                value={formData.bulan}
                onChange={handleChange}
                className="input"
                required
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Tahun</label>
              <select
                name="tahun"
                value={formData.tahun}
                onChange={handleChange}
                className="input"
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Batal
            </button>
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? "Menyimpan..." : "Simpan Gaji"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryModal;
