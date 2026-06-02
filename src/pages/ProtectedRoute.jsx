import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const loginTime = sessionStorage.getItem("loginTime");

  console.log("Token:", token);
  console.log("LoginTime:", loginTime);

  const FIVE_MINUTES = 5 * 60 * 1000;

  if (!token || !loginTime) {
    console.log("No token or loginTime found");
    return <Navigate to="/" replace />;
  }

  if (Date.now() - Number(loginTime) > FIVE_MINUTES) {
    console.log("Session Expired");
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;