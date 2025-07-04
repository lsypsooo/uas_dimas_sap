import { useState } from "react";

const LeaveRequestForm = ({ onSave }) => {
  // 1. Sesuaikan initialFormData dengan field dari controller
  const [formData, setFormData] = useState({
    tanggalMulai: "",
    tanggalSelesai: "",
    alasan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.tanggalMulai ||
      !formData.tanggalSelesai ||
      !formData.alasan
    ) {
      alert("Semua field wajib diisi.");
      return;
    }
    if (new Date(formData.tanggalSelesai) < new Date(formData.tanggalMulai)) {
      alert("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }
    onSave(formData);
    // Reset form setelah berhasil
    setFormData({ tanggalMulai: "", tanggalSelesai: "", alasan: "" });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-xl font-semibold text-black  mb-4">
        Formulir Pengajuan Cuti
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="mb-2 block text-black ">Tanggal Mulai</label>
            {/* 2. Ganti nama field */}
            <input
              type="date"
              name="tanggalMulai"
              value={formData.tanggalMulai}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black "
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-black ">Tanggal Selesai</label>
            {/* 2. Ganti nama field */}
            <input
              type="date"
              name="tanggalSelesai"
              value={formData.tanggalSelesai}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black "
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-black ">Alasan Cuti</label>
          {/* 2. Ganti nama field */}
          <textarea
            rows={3}
            name="alasan"
            value={formData.alasan}
            onChange={handleChange}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5"
            required
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded bg-primary py-3 px-8 font-medium text-white hover:bg-opacity-90"
          >
            Ajukan Cuti
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
