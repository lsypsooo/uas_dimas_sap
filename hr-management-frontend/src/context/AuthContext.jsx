// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";

// 1. Membuat "wadah" context itu sendiri
const AuthContext = createContext(null);

// 2. Membuat komponen Provider (INI YANG ANDA CARI)
// Provider inilah yang akan "membungkus" aplikasi kita dan menyediakan data/fungsi ke semua komponen di dalamnya.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const navigate = useNavigate();

  // Efek ini akan memeriksa localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    if (token) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setToken(null);
      }
    }
  }, [token]);

  // Fungsi untuk menangani proses login
  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = response.data;

      // Simpan data ke state React
      setToken(newToken);
      setUser(userData);

      // Simpan data ke localStorage agar tidak hilang saat di-refresh
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // Arahkan ke dashboard jika berhasil
      navigate("/dashboard");
    } catch (error) {
      console.error("Login gagal:", error);
      // Lempar error agar bisa ditangkap oleh halaman Login untuk menampilkan pesan
      throw new Error("Email atau password salah.");
    }
  };

  // Fungsi untuk menangani proses logout
  const logout = () => {
    // Hapus data dari state React
    setToken(null);
    setUser(null);

    // Hapus data dari localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Arahkan kembali ke halaman login
    navigate("/login", { replace: true });
  };

  // Ini adalah data dan fungsi yang akan kita "bagikan"
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token, // akan bernilai true jika ada token, dan false jika null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Membuat Custom Hook (jalan pintas untuk menggunakan context)
// Jadi di komponen lain, kita tinggal panggil `useAuth()`
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};
