import { useState } from "react";
import { toast } from "react-toastify";
import { HiOutlineCurrencyDollar } from "react-icons/hi";

const SalaryTable = ({ employees, onSaveSalary }) => {
  const [manualInputs, setManualInputs] = useState({});

  const handleInputChange = (employeeId, field, value) => {
    setManualInputs((prevInputs) => ({
      ...prevInputs,
      [employeeId]: {
        ...prevInputs[employeeId],
        [field]: value,
      },
    }));
  };

  const handleSaveClick = (employeeId) => {
    const inputData = manualInputs[employeeId];
    if (
      !inputData ||
      !inputData.jumlah ||
      !inputData.bulan ||
      !inputData.tahun
    ) {
      toast.warn("Jumlah, Bulan, dan Tahun harus diisi.");
      return;
    }
    onSaveSalary({
      karyawanId: employeeId,
      jumlah: parseInt(inputData.jumlah, 10),
      bulan: parseInt(inputData.bulan, 10),
      tahun: parseInt(inputData.tahun, 10),
    });
    setManualInputs((prev) => ({ ...prev, [employeeId]: {} }));
  };

  if (!Array.isArray(employees) || employees.length === 0) {
    return (
      <div className="card p-10 text-center">
        <HiOutlineCurrencyDollar className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-500">
          Data karyawan tidak ditemukan. Tambahkan karyawan terlebih dahulu.
        </p>
      </div>
    );
  }

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
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Nama Karyawan
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Gaji Terakhir
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Input Gaji Baru (Rp)
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Bulan
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Tahun
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((employee) => {
              const latestSalary = employee.gajis?.[0];
              const currentInput = manualInputs[employee.id] || {};

              return (
                <tr
                  key={employee.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">
                      {employee.user?.username || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {employee.jabatan || ""}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-900">
                      {latestSalary?.jumlah
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(latestSalary.jumlah)
                        : "Belum diatur"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {latestSalary
                        ? `${monthNames[latestSalary.bulan - 1]} ${latestSalary.tahun}`
                        : ""}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      placeholder="e.g., 5000000"
                      value={currentInput.jumlah || ""}
                      onChange={(e) =>
                        handleInputChange(employee.id, "jumlah", e.target.value)
                      }
                      className="input"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={currentInput.bulan || ""}
                      onChange={(e) =>
                        handleInputChange(employee.id, "bulan", e.target.value)
                      }
                      className="input"
                    >
                      <option value="">Pilih Bulan</option>
                      {monthNames.map((month, index) => (
                        <option key={index} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={currentInput.tahun || ""}
                      onChange={(e) =>
                        handleInputChange(employee.id, "tahun", e.target.value)
                      }
                      className="input"
                    >
                      <option value="">Pilih Tahun</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSaveClick(employee.id)}
                      className="btn-primary !py-2 !px-4 !text-xs"
                    >
                      Simpan
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryTable;
