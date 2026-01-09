import { Navigate } from "react-router-dom";
import { ROLE_ACCESS } from "../../config/roleAccess";

const RoleRoute = ({ children, access }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!ROLE_ACCESS[user?.role]?.[access]) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
