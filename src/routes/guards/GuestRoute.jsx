import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "MAHASISWA" ? (
      <Navigate to="/" replace />
    ) : (
      <Navigate to="/admin/dashboard" replace />
    );
  }

  return children;
};

export default GuestRoute;
