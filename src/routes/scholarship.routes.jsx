import { Route, Routes } from "react-router-dom";
import ScholarshipAdmin from "../pages/admin/scholarships/ScholarshipAdmin";
import ScholarshipAdd from "../pages/admin/scholarships/create/ScholarshipAdd";
import ScholarshipDetail from "../pages/admin/scholarships/ScholarshipDetail";
import ScholarshipEdit from "../pages/admin/scholarships/edit/ScholarshipEdit";
import CreateScholarshipForm from "../pages/admin/scholarships/form/CreateScholarshipForm";
import PreviewScholarshipForm from "../pages/admin/scholarships/form/PreviewScholarshipForm";
import EditScholarshipForm from "../pages/admin/scholarships/form/EditScholarshipForm";
import RoleRoute from "./guards/RoleRoute";

const ScholarshipRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <RoleRoute access="scholarship">
          <ScholarshipAdmin />
        </RoleRoute>
      }
    />
    <Route
      path="add"
      element={
        <RoleRoute access="scholarship">
          <ScholarshipAdd />
        </RoleRoute>
      }
    />
    <Route
      path=":id"
      element={
        <RoleRoute access="scholarship">
          <ScholarshipDetail />
        </RoleRoute>
      }
    />
    <Route
      path="edit/:id"
      element={
        <RoleRoute access="scholarship">
          <ScholarshipEdit />
        </RoleRoute>
      }
    />
    <Route
      path=":id/form/create"
      element={
        <RoleRoute access="scholarship">
          <CreateScholarshipForm />
        </RoleRoute>
      }
    />
    <Route
      path=":id/form/preview"
      element={
        <RoleRoute access="scholarship">
          <PreviewScholarshipForm />
        </RoleRoute>
      }
    />
    <Route
      path=":id/form/edit"
      element={
        <RoleRoute access="scholarship">
          <EditScholarshipForm />
        </RoleRoute>
      }
    />
  </Routes>
);

export default ScholarshipRoutes;
