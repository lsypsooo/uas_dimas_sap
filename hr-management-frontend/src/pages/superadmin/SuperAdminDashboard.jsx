import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/api";
import { HiOutlineOfficeBuilding, HiOutlineUserGroup } from "react-icons/hi";

const StatCard = ({ title, value, icon, linkTo, color }) => {
  const content = (
    <div className="card p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
  return linkTo ? <Link to={linkTo}>{content}</Link> : content;
};

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({ totalCompanies: 0, totalAdmins: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [companyRes, usersRes] = await Promise.all([
          apiClient.get("/perusahaan"),
          apiClient.get("/users"),
        ]);
        const companies = companyRes.data.data || companyRes.data;
        const users = usersRes.data.data || usersRes.data;
        const adminCount = Array.isArray(users)
          ? users.filter((u) => u.role?.toLowerCase() === "admin_perusahaan")
              .length
          : 0;
        setStats({
          totalCompanies: Array.isArray(companies) ? companies.length : 0,
          totalAdmins: adminCount,
        });
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="text-red-600 font-medium">Gagal memuat data dashboard.</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary mt-4"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Dashboard Super Admin</h1>
        <p className="page-subtitle">Ringkasan data sistem HR Management</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Perusahaan"
          value={stats.totalCompanies}
          icon={
            <HiOutlineOfficeBuilding className="h-6 w-6 text-primary-600" />
          }
          color="bg-primary-50"
          linkTo="/companies"
        />
        <StatCard
          title="Total Admin"
          value={stats.totalAdmins}
          icon={<HiOutlineUserGroup className="h-6 w-6 text-emerald-600" />}
          color="bg-emerald-50"
          linkTo="/admins"
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
