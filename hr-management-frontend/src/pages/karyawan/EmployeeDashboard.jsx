import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Komponen untuk tombol aksi cepat
const ActionButton = ({ title, description, linkTo, icon }) => (
  <Link
    to={linkTo}
    className="block rounded-sm border border-stroke bg-white p-6 shadow-default transition-transform transform hover:-translate-y-1 dark:border-strokedark dark:bg-boxdark"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-meta-2 text-primary dark:bg-meta-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-black ">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  </Link>
);

const EmployeeDashboard = () => {
  const { user } = useAuth();

  const leaveIcon = (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      ></path>
    </svg>
  );
  const salaryIcon = (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
      ></path>
    </svg>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-black ">
          Selamat Datang, {user?.username || "Karyawan"}!
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Ini adalah halaman utama Anda.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:gap-7">
        <ActionButton
          title="Ajukan Cuti"
          description="Lihat sisa cuti dan ajukan permohonan baru."
          linkTo="/leave-request"
          icon={leaveIcon}
        />
        <ActionButton
          title="Lihat Gaji"
          description="Lihat rincian slip gaji Anda per periode."
          linkTo="/my-salary"
          icon={salaryIcon}
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
