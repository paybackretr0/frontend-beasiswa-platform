import { Route } from "react-router-dom";
import Profile from "../pages/user/Profile";
import History from "../pages/user/History";
import FormApplication from "../pages/user/FormApplication";
import AuthRoute from "./guards/AuthRoute";
import StudentRoute from "./guards/StudentRoute";

const StudentRoutes = () => (
  <>
    <Route
      path="/profile"
      element={
        <AuthRoute>
          <StudentRoute>
            <Profile />
          </StudentRoute>
        </AuthRoute>
      }
    />
    <Route
      path="/history"
      element={
        <AuthRoute>
          <StudentRoute>
            <History />
          </StudentRoute>
        </AuthRoute>
      }
    />
    <Route
      path="/scholarship/:id/apply"
      element={
        <AuthRoute>
          <StudentRoute>
            <FormApplication />
          </StudentRoute>
        </AuthRoute>
      }
    />
  </>
);

export default StudentRoutes;
