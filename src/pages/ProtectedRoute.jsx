import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const loginTime = sessionStorage.getItem("loginTime");

  console.log("TOKEN =", token);
  console.log("LOGIN TIME =", loginTime);

  if (!token || !loginTime) {
    console.log("REDIRECT TO LOGIN");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;