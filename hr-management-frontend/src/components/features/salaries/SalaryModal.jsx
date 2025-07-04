import { useState, useEffect } from "react";

const SalaryModal = ({ isOpen, onClose, onSave, employee }) => {
  // 1. Dapatkan bulan dan tahun saat ini sebagai default
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() 0-11, jadi +1

  // 2. Sesuaikan initialFormData dengan field dari controller baru
  const initialFormData = {
    jumlah: "",
    bulan: currentMonth,
    tahun: currentYear,
  };
  const [formData, setFormData] = useState(initialFormData);

  // Reset form setiap kali modal dibuka untuk karyawan baru
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Pastikan nilai yang dimasukkan adalah angka untuk field number
    const processedValue = ["jumlah", "bulan", "tahun"].includes(name)
      ? parseInt(value, 10)
      : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.jumlah || !formData.bulan || !formData.tahun) {
      alert("Jumlah, Bulan, dan Tahun wajib diisi.");
      return;
    }
    // Kirim data ke parent, termasuk ID karyawan
    onSave({ ...formData, karyawanId: employee.id });
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
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // 5 tahun terakhir

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
        <h2 className="mb-1 text-xl font-bold text-black ">Buat Gaji Baru</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          untuk {employee?.user?.username}
        </p>

        <form onSubmit={handleSubmit}>
          {/* 3. Ubah total isi form */}
          <div className="mb-4">
            <label className="mb-2 block text-black ">Jumlah Gaji (Rp)</label>
            <input
              type="number"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="mb-2 block text-black ">Bulan</label>
              <select
                name="bulan"
                value={formData.bulan}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black "
                required
              >
                {monthNames.map((month, index) => (
                  <option
                    key={index}
                    value={index + 1}
                    className="text-bodydark2"
                  >
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-black ">Tahun</label>
              <select
                name="tahun"
                value={formData.tahun}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black "
                required
              >
                {years.map((year) => (
                  <option key={year} value={year} className="text-bodydark2">
                    {year}
                  </option>
                ))}
              </select>
            </div>
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
              className="rounded bg-primary py-2 px-4 font-medium text-white hover:bg-opacity-90"
            >
              Simpan Gaji
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryModal;
