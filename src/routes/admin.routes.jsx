import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import ApplicationsAdmin from "../pages/admin/applications/ApplicationsAdmin";
import ReportsAdmin from "../pages/admin/reports/ReportsAdmin";
import InfoScholarship from "../pages/admin/info-scholarships/InfoScholarship";

import AccountsRoutes from "./accounts.routes";
import ScholarshipRoutes from "./scholarship.routes";
import ReferenceRoutes from "./reference.routes";
import WebsiteRoutes from "./website.routes";
import ExtraRoutes from "./extra.routes";

import AuthRoute from "./guards/AuthRoute";
import RoleRoute from "./guards/RoleRoute";

const AdminRoutes = () => (
  <Route
    path="/admin/*"
    element={
      <AuthRoute>
        <AdminLayout />
      </AuthRoute>
    }
  >
    <Route path="dashboard" element={<AdminDashboard />} />

    <Route
      path="registration"
      element={
        <RoleRoute access="registration">
          <ApplicationsAdmin />
        </RoleRoute>
      }
    />

    <Route
      path="report"
      element={
        <RoleRoute access="report">
          <ReportsAdmin />
        </RoleRoute>
      }
    />

    <Route
      path="informasi-beasiswa"
      element={
        <RoleRoute access="infoScholarship">
          <InfoScholarship />
        </RoleRoute>
      }
    />

    <Route path="accounts/*" element={<AccountsRoutes />} />
    <Route path="scholarship/*" element={<ScholarshipRoutes />} />
    <Route path="reference/*" element={<ReferenceRoutes />} />
    <Route path="website/*" element={<WebsiteRoutes />} />
    <Route path="extra/*" element={<ExtraRoutes />} />
  </Route>
);

export default AdminRoutes;
