import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Scholarship from "../pages/Scholarship";
import DetailScholarship from "../pages/DetailScholarship";
import Contact from "../pages/Contact";
import Information from "../pages/Information";
import DetailInformation from "../pages/DetailInformation";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyCode from "../pages/auth/VerifyCode";

import AdminRoutes from "./admin.routes";
import GuestRoute from "./guards/GuestRoute";
import StudentRoutes from "./student.routes";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scholarship" element={<Scholarship />} />
      <Route path="/scholarship/:id" element={<DetailScholarship />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/informations" element={<Information />} />
      <Route path="/informations/:slug" element={<DetailInformation />} />

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
      <Route path="/verify-code" element={<VerifyCode />} />

      {AdminRoutes()}
      {StudentRoutes()}
    </Routes>
  </Router>
);

export default AppRouter;
