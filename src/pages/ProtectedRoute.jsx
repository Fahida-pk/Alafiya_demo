import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  // localStorage il token undo check cheyyunnu
  const token = localStorage.getItem("token");

  // token illenkil login page ilek redirect
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;