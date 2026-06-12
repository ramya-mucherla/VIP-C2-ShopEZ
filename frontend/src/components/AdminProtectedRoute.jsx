import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token || user.role !== "admin") {
    // If user is not authenticated or not an admin, redirect to main login page
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
