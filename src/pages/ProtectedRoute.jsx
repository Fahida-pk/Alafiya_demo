import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const loginTime = sessionStorage.getItem("loginTime");

  const FIVE_MINUTES = 5 * 60 * 1000;

  useEffect(() => {
    const updateActivity = () => {
      sessionStorage.setItem("loginTime", Date.now().toString());
    };

    window.addEventListener("click", updateActivity);
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);

    return () => {
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
    };
  }, []);

  if (!token || !loginTime) {
    return <Navigate to="/" replace />;
  }

  if (Date.now() - Number(loginTime) > FIVE_MINUTES) {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;