import { useAuth } from "../context/AuthContext";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

const roleLabel = {
  superadmin: "Super Admin",
  admin_perusahaan: "Admin Perusahaan",
  karyawan: "Karyawan",
};

const ProfilePage = () => {
  const { user } = useAuth();

  const fields = [
    { icon: HiOutlineUser, label: "Nama", value: user?.name },
    { icon: HiOutlineEnvelope, label: "Email", value: user?.email },
    { icon: HiOutlineIdentification, label: "Username", value: user?.username },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="page-title">Profil Saya</h1>
      <p className="page-subtitle mb-6">Informasi akun Anda</p>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold text-white ring-4 ring-white/30">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-white">
            {user?.name || "User"}
          </h2>
          <span className="mt-1 inline-block rounded-full bg-white/20 px-3 py-0.5 text-sm font-medium text-white">
            {roleLabel[user?.role] || user?.role || "Role"}
          </span>
        </div>

        {/* Details */}
        <div className="divide-y divide-slate-100">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-sm font-medium text-slate-800 truncate">
                  {value || "-"}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <HiOutlineShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Role
              </p>
              <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                {roleLabel[user?.role] || user?.role || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
