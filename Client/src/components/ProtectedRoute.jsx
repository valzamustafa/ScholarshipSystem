import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;


  console.log('Current user:', user);
  console.log('Required roles:', roles);
  console.log('User approved status:', user.approved);

  if (user.role === "provider" && !user.approved) {
    return <Navigate to="/pending-approval" replace />;
  }

  const normalizedUserRole = user.role?.toLowerCase();
  const hasAccess = roles?.some(role => 
    role.toLowerCase() === normalizedUserRole
  );

  if (roles && !hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;