import { Routes, Route } from "react-router-dom";
import PimpinanDir from "../pages/admin/accounts/PimpinanDitmawa";
import PimpinanFak from "../pages/admin/accounts/PimpinanFakultas";
import Verifikator from "../pages/admin/accounts/Verifikator";
import Validator from "../pages/admin/accounts/ValidatorDitmawa";
import Mahasiswa from "../pages/admin/accounts/Mahasiswa";
import RoleRoute from "./guards/RoleRoute";

const AccountsRoutes = () => (
  <Routes>
    <Route
      path="pimpinan-dir"
      element={
        <RoleRoute access="accounts">
          <PimpinanDir />
        </RoleRoute>
      }
    />
    <Route
      path="pimpinan-fak"
      element={
        <RoleRoute access="accounts">
          <PimpinanFak />
        </RoleRoute>
      }
    />
    <Route
      path="validator"
      element={
        <RoleRoute access="accounts">
          <Validator />
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
  </Routes>
);

export default AccountsRoutes;
