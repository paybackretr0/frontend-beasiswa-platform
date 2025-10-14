import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("access_token");
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!userData || !allowedRoles.includes(userData.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
