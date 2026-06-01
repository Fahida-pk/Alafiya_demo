import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const loginTime = sessionStorage.getItem("loginTime");

  const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

  if (
    !token ||
    !loginTime ||
    Date.now() - Number(loginTime) > TWO_DAYS
  ) {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;