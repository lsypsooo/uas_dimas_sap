// src/pages/UnauthorizedPage.jsx

import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-center">
      <h1 className="text-6xl font-extrabold text-red-600">403</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-800">Akses Ditolak</h2>
      <p className="mt-2 text-gray-600">
        Maaf, Anda tidak memiliki hak untuk mengakses halaman ini.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-md bg-primary px-6 py-2 text-white transition hover:bg-opacity-90"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
