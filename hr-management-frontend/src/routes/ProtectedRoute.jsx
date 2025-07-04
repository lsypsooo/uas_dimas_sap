import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Atau spinner loading
  }

  if (!isAuthenticated) {
    // Jika tidak terautentikasi, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    // Jika peran tidak sesuai, redirect ke halaman tidak ada akses atau dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Jika terautentikasi dan peran sesuai, tampilkan konten anak-anak
  return <Outlet />;
};

export default ProtectedRoute;
