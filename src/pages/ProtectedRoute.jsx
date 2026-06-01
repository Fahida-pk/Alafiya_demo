import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  const token = sessionStorage.getItem("token");
  const loginTime = sessionStorage.getItem("loginTime");

  const FIVE_MINUTES = 5 * 60 * 1000;

  if (!token || !loginTime) {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  const currentTime = Date.now();
  const timeDifference = currentTime - Number(loginTime);

  if (timeDifference > FIVE_MINUTES) {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;