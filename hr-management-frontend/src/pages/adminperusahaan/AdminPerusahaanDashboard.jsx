import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/api";

// 1. Komponen StatCard dimodifikasi agar bisa menjadi link
const StatCard = ({ title, value, icon, linkTo }) => {
  const cardContent = (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7 shadow-default transition-transform transform hover:-translate-y-1 dark:border-strokedark dark:bg-boxdark">
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

  // Jika ada prop 'linkTo', bungkus kartu dengan komponen Link
  if (linkTo) {
    return <Link to={linkTo}>{cardContent}</Link>;
  }

  return cardContent;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ employeeCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Asumsi backend Anda bisa memfilter karyawan berdasarkan admin yang login
    apiClient
      .get("/karyawan")
      .then((response) => {
        const data = response.data.data || response.data;
        setStats((prev) => ({ ...prev, employeeCount: data.length }));
      })
      .catch((err) => console.error("Gagal mengambil data karyawan:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const employeeIcon = (
    <svg
      className="h-6 w-6 text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      ></path>
    </svg>
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 ">
        Dashboard Admin Perusahaan
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
        {/* 2. Berikan prop 'linkTo' ke StatCard */}
        <StatCard
          title="Total Karyawan"
          value={isLoading ? "..." : stats.employeeCount}
          icon={employeeIcon}
          linkTo="/employees" // Kartu ini sekarang bisa diklik
        />
        {/* Anda bisa menambahkan kartu lain di sini nanti */}
      </div>
    </div>
  );
};

export default AdminDashboard;
