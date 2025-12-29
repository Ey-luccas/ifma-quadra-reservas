import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, Role } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

