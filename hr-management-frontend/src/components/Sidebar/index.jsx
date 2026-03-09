import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineViewGrid,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineCash,
  HiOutlineX,
} from "react-icons/hi";

const menuConfig = {
  superadmin: [
    { label: "Dashboard", path: "/dashboard", icon: HiOutlineViewGrid },
    { label: "Perusahaan", path: "/companies", icon: HiOutlineOfficeBuilding },
    { label: "Admin", path: "/admins", icon: HiOutlineUserGroup },
  ],
  admin_perusahaan: [
    { label: "Dashboard", path: "/dashboard", icon: HiOutlineViewGrid },
    { label: "Karyawan", path: "/employees", icon: HiOutlineUsers },
    { label: "Gaji", path: "/salaries", icon: HiOutlineCurrencyDollar },
    { label: "Cuti", path: "/leaves", icon: HiOutlineCalendar },
  ],
  karyawan: [
    { label: "Dashboard", path: "/dashboard", icon: HiOutlineViewGrid },
    {
      label: "Ajukan Cuti",
      path: "/leave-request",
      icon: HiOutlineClipboardList,
    },
    { label: "Gaji Saya", path: "/my-salary", icon: HiOutlineCash },
  ],
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const trigger = useRef(null);
  const sidebar = useRef(null);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  const userRole = user?.role?.toLowerCase();
  const menuItems = menuConfig[userRole] || menuConfig.karyawan;

  const roleBadge = {
    superadmin: {
      label: "Super Admin",
      color: "bg-amber-500/20 text-amber-300",
    },
    admin_perusahaan: { label: "Admin", color: "bg-sky-500/20 text-sky-300" },
    karyawan: {
      label: "Karyawan",
      color: "bg-emerald-500/20 text-emerald-300",
    },
  };
  const badge = roleBadge[userRole] || roleBadge.karyawan;

  return (
    <aside
      ref={sidebar}
      id="sidebar"
      role="navigation"
      aria-label="Menu utama"
      className={`absolute left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-900 duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700/50">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
            <HiOutlineUsers className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            HRMS
          </span>
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup navigasi"
          className="block rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <HiOutlineX className="h-5 w-5" />
        </button>
      </div>

      {/* User Badge */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
            {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.name || user?.username || "User"}
            </p>
            <span
              className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.color}`}
            >
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </p>
        <ul className="flex flex-col gap-0.5">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-600/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700/50 px-5 py-3">
        <p className="text-[11px] text-slate-600">© 2026 HRMS v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
