import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Scholarship from "../pages/Scholarship";
import Contact from "../pages/Contact";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import VerifyCode from "../pages/auth/VerifyCode";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import PimpinanDitmawa from "../pages/admin/accounts/PimpinanDitmawa";
import PimpinanFakultas from "../pages/admin/accounts/PimpinanFakultas";
import Verifikator from "../pages/admin/accounts/Verifikator";
import Mahasiswa from "../pages/admin/accounts/Mahasiswa";
import ScholarshipAdmin from "../pages/admin/scholarships/ScholarshipAdmin";
import ApplicationsAdmin from "../pages/admin/applications/ApplicationsAdmin";
import ReportsAdmin from "../pages/admin/reports/ReportsAdmin";
import NewsAdmin from "../pages/admin/websites/NewsAdmin";
import ArticleAdmin from "../pages/admin/websites/ArticleAdmin";
import Fakultas from "../pages/admin/references/Fakultas";
import Departemen from "../pages/admin/references/Departemen";
import BackupAdmin from "../pages/admin/extras/BackupAdmin";
import LogAdmin from "../pages/admin/extras/LogAdmin";
import Profile from "../pages/user/Profile";
import History from "../pages/user/History";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ChangePassword from "../pages/admin/ChangePassword";
import ScholarshipAdd from "../pages/admin/scholarships/create/ScholarshipAdd";
import ScholarshipDetail from "../pages/admin/scholarships/ScholarshipDetail";
import ScholarshipEdit from "../pages/admin/scholarships/edit/ScholarshipEdit";
import CreateScholarshipForm from "../pages/admin/scholarships/form/CreateScholarshipForm";
import PreviewScholarshipForm from "../pages/admin/scholarships/form/PreviewScholarshipForm";
import EditScholarshipForm from "../pages/admin/scholarships/form/EditScholarshipForm";
import DetailScholarship from "../pages/DetailScholarship";
import FormApplication from "../pages/user/FormApplication";
import Information from "../pages/Information";
import DetailInformation from "../pages/DetailInformation";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scholarship" element={<Scholarship />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/informations" element={<Information />} />
      <Route path="/informations/:slug" element={<DetailInformation />} />

      <Route path="/scholarship/:id" element={<DetailScholarship />} />
      <Route
        path="/scholarship/:id/apply"
        element={
          <ProtectedRoute>
            <FormApplication />
          </ProtectedRoute>
        }
      />

      <Route path="/verify-code" element={<VerifyCode />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <SignUp />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute
            allowedRoles={[
              "SUPERADMIN",
              "VERIFIKATOR",
              "PIMPINAN_FAKULTAS",
              "PIMPINAN_DITMAWA",
            ]}
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="accounts/pimpinan-dir" element={<PimpinanDitmawa />} />
        <Route path="accounts/pimpinan-fak" element={<PimpinanFakultas />} />
        <Route path="accounts/verifikator" element={<Verifikator />} />
        <Route path="accounts/mahasiswa" element={<Mahasiswa />} />

        <Route path="scholarship" element={<ScholarshipAdmin />} />
        <Route path="scholarship/add" element={<ScholarshipAdd />} />
        <Route path="scholarship/:id" element={<ScholarshipDetail />} />
        <Route path="scholarship/edit/:id" element={<ScholarshipEdit />} />
        <Route
          path="scholarship/:id/form/create"
          element={<CreateScholarshipForm />}
        />
        <Route
          path="scholarship/:id/form/preview"
          element={<PreviewScholarshipForm />}
        />
        <Route
          path="scholarship/:id/form/edit"
          element={<EditScholarshipForm />}
        />

        <Route path="registration" element={<ApplicationsAdmin />} />
        <Route path="report" element={<ReportsAdmin />} />
        <Route path="website/berita" element={<NewsAdmin />} />
        <Route path="website/artikel" element={<ArticleAdmin />} />
        <Route path="reference/fakultas" element={<Fakultas />} />
        <Route path="reference/departemen" element={<Departemen />} />
        <Route path="extra/backup-data" element={<BackupAdmin />} />
        <Route path="extra/log-aktivitas" element={<LogAdmin />} />
      </Route>
      <Route
        path="/admin/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default AppRouter;
