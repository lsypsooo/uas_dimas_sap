import { Link } from "react-router-dom";
import { HiOutlineLockClosed } from "react-icons/hi2";

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
        <HiOutlineLockClosed className="h-10 w-10" />
      </div>
      <h1 className="text-7xl font-extrabold text-red-600">403</h1>
      <h2 className="mt-3 text-2xl font-bold text-slate-800">Akses Ditolak</h2>
      <p className="mt-2 max-w-md text-slate-500">
        Maaf, Anda tidak memiliki hak untuk mengakses halaman ini.
      </p>
      <Link to="/dashboard" className="btn btn-primary mt-8">
        Kembali ke Dashboard
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
