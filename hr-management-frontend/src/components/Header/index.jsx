// src/components/Header/index.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // menutup dropdown saat diklik di luarnya
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
  });

  return (
    <header className="sticky top-0 z-30 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {/* */}
        </div>

        {/* Placeholder untuk Search Form */}
        <div className="hidden sm:block">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* */}
          <div className="relative">
            <Link
              ref={trigger}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-4"
              to="#"
            >
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                  {user ? user.name : "User"}
                </span>
                <span className="block text-xs">
                  {user ? user.role : "Role"}
                </span>
              </span>

              <span className="h-12 w-12 rounded-full bg-gray-300">
                {/* Placeholder untuk foto profil */}
              </span>
            </Link>

            {/* */}
            <div
              ref={dropdown}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setDropdownOpen(false)}
              className={`absolute right-0 mt-4 flex w-60 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
                dropdownOpen === true ? "block" : "hidden"
              }`}
            >
              <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7 dark:border-strokedark">
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    My Profile
                  </Link>
                </li>
              </ul>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                Log Out
              </button>
            </div>
            {/* */}
          </div>
          {/* */}
        </div>
      </div>
    </header>
  );
};

export default Header;
