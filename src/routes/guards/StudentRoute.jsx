import { Navigate } from "react-router-dom";

const StudentRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role !== "MAHASISWA") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default StudentRoute;
