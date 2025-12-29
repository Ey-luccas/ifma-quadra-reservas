import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import { LoginPage } from '../pages/LoginPage';
import { StudentRegisterPage } from '../pages/StudentRegisterPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';
import { StudentRequestsPage } from '../pages/StudentRequestsPage';
import { NewRequestPage } from '../pages/NewRequestPage';
import { AdminRequestsPage } from '../pages/AdminRequestsPage';
import { AdminGuardsPage } from '../pages/AdminGuardsPage';
import { GuardAgendaPage } from '../pages/GuardAgendaPage';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

function HomeRedirect() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'STUDENT') {
    return <Navigate to="/student/requests" replace />;
  } else if (user.role === 'ADMIN') {
    return <Navigate to="/admin/requests" replace />;
  } else if (user.role === 'GUARD') {
    return <Navigate to="/guard/agenda" replace />;
  }

  return <Navigate to="/login" replace />;
}

function RouterContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Páginas públicas onde a Navbar NÃO deve aparecer
  const publicPages = ['/login', '/register', '/verify-email'];
  const isPublicPage = publicPages.includes(location.pathname);
  
  // Só mostra Navbar se estiver autenticado E não estiver em página pública
  const shouldShowNavbar = isAuthenticated && !isPublicPage;

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<StudentRegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        
        <Route
          path="/student/requests"
          element={
            <PrivateRoute allowedRoles={['STUDENT']}>
              <StudentRequestsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/requests/new"
          element={
            <PrivateRoute allowedRoles={['STUDENT']}>
              <NewRequestPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/admin/requests"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminRequestsPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/admin/guards"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminGuardsPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/guard/agenda"
          element={
            <PrivateRoute allowedRoles={['GUARD']}>
              <GuardAgendaPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );
}

