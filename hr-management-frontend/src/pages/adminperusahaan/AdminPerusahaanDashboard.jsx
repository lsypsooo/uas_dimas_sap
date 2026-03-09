import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
} from "react-icons/hi";
import apiClient from "../../services/api";

const StatCard = ({ title, value, icon: Icon, linkTo, color }) => {
  const colorMap = {
    primary: "bg-primary-50 text-primary-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  const card = (
    <div className="card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color] || colorMap.primary}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="mt-4">
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        <p className="text-sm text-slate-500">{title}</p>
      </div>
    </div>
  );

  return linkTo ? <Link to={linkTo}>{card}</Link> : card;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ employeeCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/karyawan")
      .then((response) => {
        const data = response.data.data || response.data;
        setStats((prev) => ({ ...prev, employeeCount: data.length }));
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Gagal mengambil data karyawan.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-title">Dashboard Admin Perusahaan</h1>
      <p className="page-subtitle mb-6">Ringkasan data perusahaan Anda.</p>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Karyawan"
            value={stats.employeeCount}
            icon={HiOutlineUsers}
            linkTo="/employees"
            color="primary"
          />
          <StatCard
            title="Manajemen Gaji"
            value="Kelola"
            icon={HiOutlineCurrencyDollar}
            linkTo="/salaries"
            color="emerald"
          />
          <StatCard
            title="Pengajuan Cuti"
            value="Kelola"
            icon={HiOutlineCalendar}
            linkTo="/leaves"
            color="amber"
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
