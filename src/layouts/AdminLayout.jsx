import Sidebar from "../partials/Sidebar";
import AdminNavbar from "../partials/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[#F5F7FA] overflow-x-hidden">
    {/* Navbar fixed */}
    <div className="fixed top-0 left-0 right-0 z-50">
      <AdminNavbar />
    </div>

    <div className="flex flex-1 pt-16">
      {/* Sidebar fixed */}
      <div className="fixed left-0 top-16 bottom-0 z-40 w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col w-[calc(100%-16rem)]">
        <div className="flex-1 p-8">
          {children}
          <Outlet />
        </div>

        <footer className="w-full py-4 bg-white border-t border-gray-200 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} BeasiswaApp. All rights reserved.
        </footer>
      </main>
    </div>
  </div>
);

export default AdminLayout;
