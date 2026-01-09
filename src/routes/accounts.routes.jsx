import { Route } from "react-router-dom";
import PimpinanDitmawa from "../pages/admin/accounts/PimpinanDitmawa";
import PimpinanFakultas from "../pages/admin/accounts/PimpinanFakultas";
import Verifikator from "../pages/admin/accounts/Verifikator";
import Mahasiswa from "../pages/admin/accounts/Mahasiswa";
import RoleRoute from "./guards/RoleRoute";

const AccountsRoutes = () => (
  <>
    <Route
      path="pimpinan-dir"
      element={
        <RoleRoute access="accounts">
          <PimpinanDitmawa />
        </RoleRoute>
      }
    />
    <Route
      path="pimpinan-fak"
      element={
        <RoleRoute access="accounts">
          <PimpinanFakultas />
        </RoleRoute>
      }
    />
    <Route
      path="verifikator"
      element={
        <RoleRoute access="accounts">
          <Verifikator />
        </RoleRoute>
      }
    />
    <Route
      path="mahasiswa"
      element={
        <RoleRoute access="accounts">
          <Mahasiswa />
        </RoleRoute>
      }
    />
  </>
);

export default AccountsRoutes;
