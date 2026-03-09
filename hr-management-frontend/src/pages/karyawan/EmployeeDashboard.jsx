import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineCalendar, HiOutlineCash } from "react-icons/hi";

const ActionButton = ({ title, description, linkTo, icon: Icon, color }) => {
  const colorMap = {
    primary: "bg-primary-50 text-primary-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <Link
      to={linkTo}
      className="card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color] || colorMap.primary}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </Link>
  );
};

const EmployeeDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">
          Selamat Datang, {user?.username || "Karyawan"}!
        </h1>
        <p className="page-subtitle">Ini adalah halaman utama Anda.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ActionButton
          title="Ajukan Cuti"
          description="Lihat sisa cuti dan ajukan permohonan baru."
          linkTo="/leave-request"
          icon={HiOutlineCalendar}
          color="primary"
        />
        <ActionButton
          title="Lihat Gaji"
          description="Lihat rincian slip gaji Anda per periode."
          linkTo="/my-salary"
          icon={HiOutlineCash}
          color="emerald"
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
