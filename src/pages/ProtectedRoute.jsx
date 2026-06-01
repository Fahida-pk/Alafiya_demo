import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const token = sessionStorage.getItem("token");
  const loginTime = sessionStorage.getItem("loginTime");

  console.log("Current Path:", location.pathname);
  console.log("Token:", token);
  console.log("LoginTime:", loginTime);

  if (!token || !loginTime) {
    return <Navigate to="/" replace />;
  }

  const FIVE_MINUTES = 5 * 60 * 1000;

  if (Date.now() - Number(loginTime) > FIVE_MINUTES) {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;