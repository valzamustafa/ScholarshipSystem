import { useAuth } from '../context/useAuth';

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (user.role === "Provider" && !user.approved) {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
};

export default ProtectedRoute;
