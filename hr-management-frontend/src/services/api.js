// src/services/api.js
import axios from "axios";

// Buat instance axios dengan konfigurasi dasar
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ini bagian penting: Interceptor
// Setiap kali aplikasi akan mengirim request, fungsi ini akan dijalankan LEBIH DULU.
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem("authToken");

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Kembalikan config yang sudah dimodifikasi
    return config;
  },
  (error) => {
    // Jika ada error saat konfigurasi request, tolak promise-nya
    return Promise.reject(error);
  },
);

// Response interceptor: handle token expired (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
