import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role?.toUpperCase();

    if (role === "MAHASISWA") {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default GuestRoute;
