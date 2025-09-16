import { NavLink } from "react-router-dom";

const Navbar = () => (
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
      </div>

      {/* Login/Sign Up */}
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
          to="/signup"
          className={({ isActive }) =>
            isActive
              ? "bg-blue-700 text-white px-4 py-2 rounded"
              : "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          }
        >
          Sign Up
        </NavLink>
      </div>
    </div>
  </nav>
);

export default Navbar;
