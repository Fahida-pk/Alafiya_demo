import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // login check
  const user = localStorage.getItem("token");
  // അല്ലെങ്കിൽ sessionStorage use cheyyunnengil:
  // const user = sessionStorage.getItem("token");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;