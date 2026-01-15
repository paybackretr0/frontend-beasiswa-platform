import { Routes, Route } from "react-router-dom";
import BackupAdmin from "../pages/admin/extras/BackupAdmin";
import LogAdmin from "../pages/admin/extras/LogAdmin";
import TemplateCommentAdmin from "../pages/admin/extras/TemplateCommentAdmin";
import RoleRoute from "./guards/RoleRoute";

const ExtraRoutes = () => (
  <Routes>
    <Route
      path="backup-data"
      element={
        <RoleRoute access="extra">
          <BackupAdmin />
        </RoleRoute>
      }
    />
    <Route
      path="log-aktivitas"
      element={
        <RoleRoute access="extra">
          <LogAdmin />
        </RoleRoute>
      }
    />
    <Route
      path="template-komentar"
      element={
        <RoleRoute access="extra">
          <TemplateCommentAdmin />
        </RoleRoute>
      }
    />
  </Routes>
);

export default ExtraRoutes;
