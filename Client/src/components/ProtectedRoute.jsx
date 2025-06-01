import { useAuth } from "../context/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

if (loading) {
  console.log('ProtectedRoute: Loading...');
  return <Spinner animation="border" variant="primary" />;
}

if (!user) {
  console.log('ProtectedRoute: No user, redirecting to login');
  return <Navigate to="/login" state={{ from: location }} replace />;
}

  if (user.role === "provider" && !user.approved) {
    return <Navigate to="/pending-approval" replace />;
  }
if (user.role === "provider" && location.pathname === "/") {
  return <Navigate to="/provider" replace />;
}


  const hasAccess = !roles || roles.some(role => 
    role.toLowerCase() === user.role.toLowerCase()
  );

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
