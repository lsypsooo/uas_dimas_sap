// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-800">
        Halaman Tidak Ditemukan
      </h2>
      <p className="mt-2 text-gray-600">
        Maaf, halaman yang Anda cari tidak ada.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-md bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
