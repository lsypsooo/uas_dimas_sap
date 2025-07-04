// src/pages/superadmin/SuperAdminDashboard.jsx

import { useState, useEffect } from "react";
import apiClient from "../../services/api";

// Komponen untuk kartu statistik (Tidak ada perubahan)
const StatCard = ({ title, value, icon }) => (
  <div className="rounded-sm border border-stroke bg-white py-6 px-7 shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
      {icon}
    </div>
    <div className="mt-4 flex items-end justify-between">
      <div>
        <h4 className="text-title-md font-bold text-black ">{value}</h4>
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  // 1. Siapkan state untuk statistik, loading, dan error
  const [stats, setStats] = useState({ totalCompanies: 0, totalAdmins: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Gunakan useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Panggil endpoint untuk mendapatkan semua perusahaan
        const companyResponse = await apiClient.get("/perusahaan");

        // Hitung jumlah perusahaan dari panjang array data
        const responseData = companyResponse.data.data || companyResponse.data; // Cek mana yang ada datanya
        const totalCompanies = responseData.length;
        setStats({
          totalCompanies: totalCompanies,
          //...
        });
        // Update state dengan data yang baru
        // Karena kita belum punya endpoint untuk admin, kita isi '0' dulu
        setStats({
          totalCompanies: totalCompanies,
          totalAdmins: 0, // Ganti nanti jika sudah ada endpointnya
        });
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // `[]` memastikan ini hanya berjalan sekali

  // -- Definisi Ikon (Tidak ada perubahan) --
  const companyIcon = (
    <svg
      className="h-6 w-6 text-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m-1 4h1m-5-4h1m-1 4h1m-1-4h1m-1 4h1"
      />
    </svg>
  );
  const adminIcon = (
    <svg
      className="h-6 w-6 text-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  // 3. Tampilkan status loading atau error jika ada
  if (isLoading) {
    return <div className="">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Gagal memuat data dashboard.</div>;
  }

  // 4. Tampilkan UI dengan data dinamis
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 ">Dashboard SuperAdmin</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
        <StatCard
          title="Total Perusahaan"
          value={stats.totalCompanies}
          icon={companyIcon}
        />
        <StatCard
          title="Total Admin"
          value={stats.totalAdmins > 0 ? stats.totalAdmins : "-"} // Tampilkan strip jika 0
          icon={adminIcon}
        />
      </div>
      <div className="mt-8">
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-xl font-semibold ">Aktivitas Terkini</h3>
          <p className="mt-4 dark:text-gray-400">
            Area ini bisa digunakan untuk menampilkan log aktivitas, seperti
            perusahaan yang baru ditambahkan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
