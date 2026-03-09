import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./adminperusahaan/AdminPerusahaanDashboard";

// 1. Import semua komponen dashboard spesifik

import EmployeeDashboard from "./karyawan/EmployeeDashboard";
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";

const DashboardPage = () => {
  const { user } = useAuth();

  // 2. Fungsi untuk memilih dan merender dashboard yang tepat
  const renderDashboardByRole = () => {
    // Gunakan .toLowerCase() untuk perbandingan yang aman
    const role = user?.role?.toLowerCase();

    switch (role) {
      case "superadmin":
        return <SuperAdminDashboard />;

      // PASTIKAN STRING INI SESUAI DENGAN PERAN DI DATABASE ANDA
      case "admin_perusahaan":
        return <AdminDashboard />;

      // Jika peran di database Anda adalah 'admin', ubah case di atas menjadi:
      // case 'admin':
      //   return <AdminDashboard />;

      case "karyawan":
        return <EmployeeDashboard />;

      default:
        // Tampilan fallback jika peran tidak dikenali atau sedang loading
        return (
          <div className="">
            Memuat dashboard... (Peran tidak dikenali: {user?.role})
          </div>
        );
    }
  };

  // 3. Cukup panggil fungsi render di dalam return
  return <>{renderDashboardByRole()}</>;
};

export default DashboardPage;
