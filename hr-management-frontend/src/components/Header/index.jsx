import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import {
  HiOutlineMenu,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineChevronDown,
} from "react-icons/hi";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/companies": "Manajemen Perusahaan",
  "/admins": "Manajemen Admin",
  "/employees": "Manajemen Karyawan",
  "/salaries": "Manajemen Gaji",
  "/leaves": "Manajemen Cuti",
  "/leave-request": "Pengajuan Cuti",
  "/my-salary": "Riwayat Gaji",
  "/profile": "Profil Saya",
};

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const pageTitle = pageTitles[location.pathname] || "HR Management";

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            aria-label="Buka menu navigasi"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <HiOutlineMenu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            ref={trigger}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-left lg:block">
              <p className="text-sm font-medium text-slate-700">
                {user?.name || user?.username || "User"}
              </p>
            </div>
            <HiOutlineChevronDown
              className={`hidden h-4 w-4 text-slate-400 transition-transform lg:block ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div
              ref={dropdown}
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/50"
            >
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-medium text-slate-900">
                  {user?.name || user?.username}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || user?.role}
                </p>
              </div>
              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                <HiOutlineUser className="h-4 w-4 text-slate-400" />
                Profil Saya
              </Link>
              <div className="border-t border-slate-100">
                <button
                  onClick={logout}
                  role="menuitem"
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <HiOutlineLogout className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
