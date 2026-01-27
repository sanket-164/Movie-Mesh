import { Navigate } from "react-router-dom";

const Protect = ({ children }: { children: React.ReactNode }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default Protect;
