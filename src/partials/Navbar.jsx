import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdNotifications,
  MdKeyboardArrowDown,
  MdPerson,
  MdLogout,
} from "react-icons/md";
import { logout } from "../services/authService";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount] = useState(3);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = isAuthenticated
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : { full_name: "", email: "", role: "" };

  const isAdminRole = [
    "SUPERADMIN",
    "PIMPINAN_DITMAWA",
    "PIMPINAN_FAKULTAS",
    "VERIFIKATOR",
  ].includes(user.role);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/70">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-3">
        {/* Logo */}
        <div className="font-bold text-xl">
          <NavLink to="/" className="no-underline text-gray-800">
            BeasiswaApp
          </NavLink>
        </div>

        {/* Menu Tengah */}
        <div className="flex gap-8">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600 transition-colors"
                }
              >
                Beranda
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600 transition-colors"
                }
              >
                Kontak
              </NavLink>
              <NavLink
                to="/scholarship"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600 transition-colors"
                }
              >
                Beasiswa
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600 transition-colors"
                }
              >
                Riwayat
              </NavLink>
              {isAdminRole && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-800 hover:text-blue-600 transition-colors"
                  }
                >
                  Dashboard
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600 transition-colors"
                }
              >
                Beranda
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600 transition-colors"
                }
              >
                Kontak
              </NavLink>
              <NavLink
                to="/scholarship"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600 transition-colors"
                }
              >
                Beasiswa
              </NavLink>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Notification */}
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <MdNotifications className="text-xl" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {user.full_name ? user.full_name.charAt(0) : "U"}
                  </div>
                  <MdKeyboardArrowDown
                    className={`text-gray-500 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">
                        {user.full_name}
                      </p>
                      <p
                        className="text-sm text-gray-500 truncate max-w-[200px]"
                        title={user.email}
                      >
                        {user.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <MdPerson className="text-gray-500" />
                        <span>Profil Saya</span>
                      </button>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <MdLogout className="text-red-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-8 items-center">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600 transition-colors"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? "bg-blue-700 text-white px-4 py-2 rounded"
                    : "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                }
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
