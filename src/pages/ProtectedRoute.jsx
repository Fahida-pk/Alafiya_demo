import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const loginTime = sessionStorage.getItem("loginTime");

  console.log("Token:", token);
  console.log("Login Time:", loginTime);

  const FIVE_MINUTES = 5 * 60 * 1000;

  if (!token || !loginTime) {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  const currentTime = Date.now();
  const timeDifference = currentTime - Number(loginTime);

  console.log("Time Difference:", timeDifference);

  if (timeDifference > FIVE_MINUTES) {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;