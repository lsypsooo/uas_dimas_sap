import React, { useState } from "react";

const SalaryTable = ({ employees, onSaveSalary }) => {
  // State untuk menyimpan nilai dari input manual untuk setiap karyawan
  const [manualInputs, setManualInputs] = useState({});

  // Fungsi untuk menangani perubahan pada input manual
  const handleInputChange = (employeeId, field, value) => {
    setManualInputs((prevInputs) => ({
      ...prevInputs,
      [employeeId]: {
        ...prevInputs[employeeId],
        [field]: value,
      },
    }));
  };

  // Fungsi yang dipanggil saat tombol "Simpan" diklik
  const handleSaveClick = (employeeId) => {
    const inputData = manualInputs[employeeId];
    if (
      !inputData ||
      !inputData.jumlah ||
      !inputData.bulan ||
      !inputData.tahun
    ) {
      alert("Jumlah, Bulan, dan Tahun harus diisi.");
      return;
    }
    // Panggil fungsi onSaveSalary dari parent dengan data lengkap
    onSaveSalary({
      karyawanId: employeeId,
      jumlah: parseInt(inputData.jumlah, 10),
      bulan: parseInt(inputData.bulan, 10),
      tahun: parseInt(inputData.tahun, 10),
    });
    // Kosongkan input setelah disimpan
    setManualInputs((prev) => ({ ...prev, [employeeId]: {} }));
  };

  if (!Array.isArray(employees) || employees.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-10 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="font-medium text-black ">
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
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black  xl:pl-11">
                Nama Karyawan
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Gaji Terakhir
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black ">
                Input Gaji Baru (Rp)
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Bulan
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black ">
                Tahun
              </th>
              <th className="py-4 px-4 font-medium text-black ">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const latestSalary = employee.gaji?.[0];
              const currentInput = manualInputs[employee.id] || {};

              return (
                <tr key={employee.id}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black ">
                      {employee.user?.username || "N/A"}
                    </h5>
                    <p className="text-sm">{employee.jabatan || ""}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black ">
                      {latestSalary?.jumlah
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(latestSalary.jumlah)
                        : "Belum diatur"}
                    </p>
                    <p className="text-sm">
                      {latestSalary
                        ? `${monthNames[latestSalary.bulan - 1]} ${
                            latestSalary.tahun
                          }`
                        : ""}
                    </p>
                  </td>
                  {/* Kolom Input Manual */}
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <input
                      type="number"
                      placeholder="e.g., 5000000"
                      value={currentInput.jumlah || ""}
                      onChange={(e) =>
                        handleInputChange(employee.id, "jumlah", e.target.value)
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3"
                    />
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <select
                      value={currentInput.bulan || ""}
                      onChange={(e) =>
                        handleInputChange(employee.id, "bulan", e.target.value)
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black "
                    >
                      <option value="">Pilih Bulan</option>
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
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <select
                      value={currentInput.tahun || ""}
                      onChange={(e) =>
                        handleInputChange(employee.id, "tahun", e.target.value)
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black "
                    >
                      <option value="">Pilih Tahun</option>
                      {years.map((year) => (
                        <option
                          key={year}
                          value={year}
                          className="text-bodydark2"
                        >
                          {year}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <button
                      onClick={() => handleSaveClick(employee.id)}
                      className="rounded bg-primary py-2 px-4 font-medium text-black hover:bg-opacity-90"
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
