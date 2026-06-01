import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const loginTime = sessionStorage.getItem("loginTime");

  const FIVE_MINUTES = 5 * 60 * 1000;

  if (!token || !loginTime) {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  if (Date.now() - Number(loginTime) > FIVE_MINUTES) {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;