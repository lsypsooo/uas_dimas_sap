// src/services/api.js
import axios from "axios";

// Buat instance axios dengan konfigurasi dasar
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // PASTIKAN PORT INI SESUAI DENGAN BACKEND ANDA
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
  }
);

export default apiClient;
