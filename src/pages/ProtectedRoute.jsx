import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  const user = sessionStorage.getItem("token");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;