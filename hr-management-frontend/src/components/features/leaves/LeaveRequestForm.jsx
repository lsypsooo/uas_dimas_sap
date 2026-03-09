import { useState } from "react";
import { toast } from "react-toastify";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

const LeaveRequestForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    tanggalMulai: "",
    tanggalSelesai: "",
    alasan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.tanggalMulai ||
      !formData.tanggalSelesai ||
      !formData.alasan
    ) {
      toast.warn("Semua field wajib diisi.");
      return;
    }
    if (new Date(formData.tanggalSelesai) < new Date(formData.tanggalMulai)) {
      toast.warn("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave(formData);
      setFormData({ tanggalMulai: "", tanggalSelesai: "", alasan: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Formulir Pengajuan Cuti
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Isi data di bawah untuk mengajukan cuti baru
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label htmlFor="tanggalMulai" className="label">
              Tanggal Mulai
            </label>
            <input
              id="tanggalMulai"
              type="date"
              name="tanggalMulai"
              value={formData.tanggalMulai}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="tanggalSelesai" className="label">
              Tanggal Selesai
            </label>
            <input
              id="tanggalSelesai"
              type="date"
              name="tanggalSelesai"
              value={formData.tanggalSelesai}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="alasan" className="label">
            Alasan Cuti
          </label>
          <textarea
            id="alasan"
            rows={3}
            name="alasan"
            value={formData.alasan}
            onChange={handleChange}
            className="input resize-none"
            placeholder="Tuliskan alasan cuti Anda..."
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              "Mengirim..."
            ) : (
              <>
                <HiOutlinePaperAirplane className="h-4 w-4 mr-1.5" />
                Ajukan Cuti
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
