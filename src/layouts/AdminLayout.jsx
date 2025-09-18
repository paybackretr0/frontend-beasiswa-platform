import Sidebar from "../partials/Sidebar";
import AdminNavbar from "../partials/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-[#F5F7FA]">
    {/* Fixed Navbar */}
    <div className="fixed top-0 left-0 right-0 z-50">
      <AdminNavbar />
    </div>

    <div className="flex pt-16">
      {" "}
      {/* pt-16 untuk offset navbar height */}
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-16 bottom-0 z-40">
        <Sidebar />
      </div>
      {/* Main Content dengan margin untuk sidebar */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8">
          {children}
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="w-full py-4 bg-white border-t border-gray-200 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} BeasiswaApp. All rights reserved.
        </footer>
      </main>
    </div>
  </div>
);

export default AdminLayout;
