import { useState, useRef, useEffect } from "react";
import {
  MdNotifications,
  MdKeyboardArrowDown,
  MdLockReset,
  MdLogout,
} from "react-icons/md";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = isAuthenticated
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : { full_name: "", email: "", role: "" };

  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img src="/unand.png" alt="Logo" className="w-8 h-8" />
        <span className="font-bold text-lg text-gray-700">Beasiswa</span>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative">
          <MdNotifications className="text-gray-600 text-2xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 focus:outline-none hover:cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <img
              src="/unand.png"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <MdKeyboardArrowDown
              className={`text-gray-500 transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800">{user.full_name}</p>
              </div>
              <button
                onClick={() => navigate("/admin/change-password")}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
              >
                <MdLockReset className="text-gray-500 text-lg" />
                <span>Ubah Password</span>
              </button>
              <button
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:cursor-pointer"
                onClick={logout}
              >
                <MdLogout className="text-red-500 text-lg" />
                <span className="text-red-500">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
