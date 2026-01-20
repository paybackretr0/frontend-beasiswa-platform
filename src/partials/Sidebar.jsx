import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { ROLE_ACCESS } from "../config/roleAccess";
import { ADMIN_MENUS } from "../config/adminMenus";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const allowedMenus = ADMIN_MENUS.filter(
    (menu) => ROLE_ACCESS[role]?.[menu.key]
  );

  useEffect(() => {
    const activeParent = allowedMenus.find(
      (menu) =>
        menu.submenu &&
        menu.submenu.some((sub) => location.pathname.startsWith(sub.to))
    );
    setOpenMenu(activeParent ? activeParent.key : null);
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
          {allowedMenus.map((menu) => {
            const Icon = menu.icon;
            const isOpen = openMenu === menu.key;

            return (
              <li key={menu.key}>
                {menu.submenu ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenMenu(isOpen ? null : menu.key)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-r-md text-left cursor-pointer transition ${
                        isMenuActive(menu)
                          ? "text-[#2D60FF] font-medium border-l-4 border-[#2D60FF] pl-6"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#2D60FF] pl-4"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{menu.label}</span>
                      {isOpen ? (
                        <MdExpandLess className="ml-auto" />
                      ) : (
                        <MdExpandMore className="ml-auto" />
                      )}
                    </button>

                    {isOpen && (
                      <ul className="ml-10 mt-1 space-y-1">
                        {menu.submenu.map((sub) => (
                          <li key={sub.to}>
                            <NavLink
                              to={sub.to}
                              className={({ isActive }) =>
                                `block px-4 py-2 rounded transition ${
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
                      `flex items-center gap-3 px-4 py-2.5 rounded-r-md transition ${
                        isActive
                          ? "text-[#2D60FF] font-medium border-l-4 border-[#2D60FF] pl-6"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#2D60FF] pl-4"
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span>{menu.label}</span>
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
