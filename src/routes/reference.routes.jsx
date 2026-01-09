import { Route } from "react-router-dom";
import Fakultas from "../pages/admin/references/Fakultas";
import Departemen from "../pages/admin/references/Departemen";
import ProgramStudi from "../pages/admin/references/ProgramStudi";
import RoleRoute from "./guards/RoleRoute";

const ReferenceRoutes = () => (
  <>
    <Route
      path="fakultas"
      element={
        <RoleRoute access="reference">
          <Fakultas />
        </RoleRoute>
      }
    />
    <Route
      path="departemen"
      element={
        <RoleRoute access="reference">
          <Departemen />
        </RoleRoute>
      }
    />
    <Route
      path="program-studi"
      element={
        <RoleRoute access="reference">
          <ProgramStudi />
        </RoleRoute>
      }
    />
  </>
);

export default ReferenceRoutes;
