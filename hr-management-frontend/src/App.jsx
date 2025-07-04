// src/App.jsx

import { Routes, Route, Navigate } from "react-router-dom";

// Import Halaman
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/UnauthorizedPage"; // Impor halaman baru
import CompanyPage from "./pages/superadmin/CompanyPage";
import UserAdminPage from "./pages/superadmin/UserAdminPage";
// Import Layout & Pelindung Rute
import DefaultLayout from "./layout/defaultLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import EmployeePage from "./pages/adminperusahaan/EmployeePage";
import SalaryPage from "./pages/adminperusahaan/SalaryPage";
import LeaveManagementPage from "./pages/adminperusahaan/LeaveManagementPage";
import MySalaryPage from "./pages/karyawan/MySalaryPage";
import LeaveRequestPage from "./pages/karyawan/LeaveRequestPage";

function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Grup Rute Terproteksi yang menggunakan Layout */}
      <Route element={<DefaultLayout />}>
        {/* --- Rute Khusus SuperAdmin --- */}
        <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/admins" element={<UserAdminPage />} />
          {/* Tambahkan rute lain khusus SuperAdmin di sini */}
        </Route>

        {/* --- Rute Khusus Admin Perusahaan --- */}
        <Route element={<ProtectedRoute allowedRoles={["admin perusahaan"]} />}>
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/salaries" element={<SalaryPage />} />
          <Route path="/leaves" element={<LeaveManagementPage />} />
          {/* Tambahkan rute lain khusus Admin di sini */}
        </Route>

        {/* --- Rute Khusus Karyawan --- */}
        <Route element={<ProtectedRoute allowedRoles={["karyawan"]} />}>
          <Route path="/my-salary" element={<MySalaryPage />} />
          <Route path="/leave-request" element={<LeaveRequestPage />} />
          {/* <Route path="/leave-request" element={<LeaveRequestPage />} /> */}
          {/* Tambahkan rute lain khusus Karyawan di sini */}
        </Route>

        {/* --- Rute untuk SEMUA Peran yang Sudah Login --- */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["superadmin", "admin perusahaan", "karyawan"]}
            />
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
        </Route>

        {/* Rute default saat mengakses "/" */}
        <Route index element={<Navigate to="/dashboard" />} />
      </Route>

      {/* Rute jika halaman tidak ditemukan (harus paling bawah) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
