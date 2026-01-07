import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdAssignment,
  MdBarChart,
  MdWeb,
  MdMenuBook,
  MdMoreHoriz,
  MdExpandMore,
  MdExpandLess,
  MdInfo,
  MdChat,
} from "react-icons/md";

const roleAccess = {
  SUPERADMIN: [
    "Dashboard",
    "Kelola Akun",
    "Beasiswa",
    "Pendaftaran",
    "Pelaporan",
    "Website",
    "Referensi",
    "Tambahan",
  ],
  VERIFIKATOR: ["Dashboard", "Pendaftaran"],
  PIMPINAN_DITMAWA: [
    "Dashboard",
    "Pendaftaran",
    "Pelaporan",
    "Informasi Beasiswa",
    "Chat",
  ],
  PIMPINAN_FAKULTAS: ["Dashboard", "Pelaporan", "Informasi Beasiswa"],
  MAHASISWA: [],
};

const menus = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: <MdDashboard size={20} />,
  },
  {
    label: "Kelola Akun",
    to: "/admin/accounts",
    icon: <MdPeople size={20} />,
    submenu: [
      { label: "Pimpinan Dir.", to: "/admin/accounts/pimpinan-dir" },
      { label: "Pimpinan Fak.", to: "/admin/accounts/pimpinan-fak" },
      { label: "Verifikator", to: "/admin/accounts/verifikator" },
      { label: "Mahasiswa", to: "/admin/accounts/mahasiswa" },
    ],
  },
  { label: "Beasiswa", to: "/admin/scholarship", icon: <MdSchool size={20} /> },
  {
    label: "Pendaftaran",
    to: "/admin/registration",
    icon: <MdAssignment size={20} />,
  },
  { label: "Pelaporan", to: "/admin/report", icon: <MdBarChart size={20} /> },
  {
    label: "Informasi Beasiswa",
    to: "/admin/informasi-beasiswa",
    icon: <MdInfo size={20} />,
  },
  {
    label: "Website",
    to: "/admin/website",
    icon: <MdWeb size={20} />,
    submenu: [
      { label: "Berita", to: "/admin/website/berita" },
      { label: "Artikel", to: "/admin/website/artikel" },
    ],
  },
  {
    label: "Referensi",
    to: "/admin/reference",
    icon: <MdMenuBook size={20} />,
    submenu: [
      { label: "Fakultas", to: "/admin/reference/fakultas" },
      { label: "Departemen", to: "/admin/reference/departemen" },
      { label: "Program Studi", to: "/admin/reference/program-studi" },
    ],
  },
  {
    label: "Tambahan",
    to: "/admin/extra",
    icon: <MdMoreHoriz size={20} />,
    submenu: [
      { label: "Backup Data", to: "/admin/extra/backup-data" },
      { label: "Log Aktivitas", to: "/admin/extra/log-aktivitas" },
    ],
  },
];

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toUpperCase() || "SUPERADMIN";

  const allowedMenus = menus.filter((menu) =>
    roleAccess[role]?.includes(menu.label)
  );

  useEffect(() => {
    const found = allowedMenus.find(
      (menu) =>
        menu.submenu &&
        menu.submenu.some((sub) => location.pathname.startsWith(sub.to))
    );
    if (found) {
      setOpenMenu(found.to);
    } else {
      setOpenMenu(null);
    }
  }, [location.pathname]);

  const isMenuActive = (menu) => {
    if (menu.submenu) {
      return menu.submenu.some((sub) => location.pathname.startsWith(sub.to));
    }
    return location.pathname.startsWith(menu.to);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-2">
          {allowedMenus.map((menu) => (
            <li key={menu.to}>
              {menu.submenu ? (
                <>
                  <button
                    type="button"
                    className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 rounded-r-md transition-all duration-200 text-left ${
                      isMenuActive(menu)
                        ? "text-[#2D60FF] font-medium border-l-4 border-[#2D60FF] pl-6"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#2D60FF] pl-4"
                    }`}
                    onClick={() =>
                      setOpenMenu(openMenu === menu.to ? null : menu.to)
                    }
                  >
                    {menu.icon}
                    <span>{menu.label}</span>
                    {openMenu === menu.to ? (
                      <MdExpandLess className="ml-auto" />
                    ) : (
                      <MdExpandMore className="ml-auto" />
                    )}
                  </button>

                  {openMenu === menu.to && (
                    <ul className="ml-10 mt-1 space-y-1">
                      {menu.submenu.map((sub) => (
                        <li key={sub.to}>
                          <NavLink
                            to={sub.to}
                            className={({ isActive }) =>
                              `block px-4 py-2 rounded transition-all duration-200 ${
                                isActive
                                  ? "text-[#2D60FF] font-medium"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-[#2D60FF]"
                              }`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={menu.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-r-md transition-all duration-200 ${
                      isActive
                        ? "text-[#2D60FF] font-medium border-l-4 border-[#2D60FF] pl-6"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#2D60FF] pl-4"
                    }`
                  }
                >
                  {menu.icon}
                  <span>{menu.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
