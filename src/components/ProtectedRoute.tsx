
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) => {
  const { currentUser, userRole } = useAuth();
  
  useEffect(() => {
    if (!currentUser) {
      console.log("User not authenticated, redirecting to login");
    } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole as UserRole)) {
      console.log(`User role ${userRole} not allowed, redirecting to dashboard`);
    }
  }, [currentUser, userRole, allowedRoles]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If roles are specified and the user's role is not included, redirect to dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole as UserRole)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
