import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout, AuthLayout } from '@/layouts';
import { Loading } from '@/components/ui';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('@/pages').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('@/pages').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/pages').then(m => ({ default: m.ResetPasswordPage })));
const SettingsPage = lazy(() => import('@/pages').then(m => ({ default: m.SettingsPage })));
// Store pages
const StorePage = lazy(() => import('@/pages').then(m => ({ default: m.StorePage })));
const DeckDetailPage = lazy(() => import('@/pages').then(m => ({ default: m.DeckDetailPage })));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Redirect authenticated users to Store
const HomeRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/store" replace />;
  }

  return <HomePage />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={
          <Suspense fallback={<Loading fullScreen />}>
            <HomeRedirect />
          </Suspense>
        } />
        <Route path="/settings" element={
          <Suspense fallback={<Loading fullScreen />}>
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/store" element={
          <Suspense fallback={<Loading fullScreen />}>
            <StorePage />
          </Suspense>
        } />
        <Route path="/store/:id" element={
          <Suspense fallback={<Loading fullScreen />}>
            <DeckDetailPage />
          </Suspense>
        } />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          <Suspense fallback={<Loading fullScreen />}>
            <LoginPage />
          </Suspense>
        } />
        <Route path="/register" element={
          <Suspense fallback={<Loading fullScreen />}>
            <RegisterPage />
          </Suspense>
        } />
        <Route path="/forgot-password" element={
          <Suspense fallback={<Loading fullScreen />}>
            <ForgotPasswordPage />
          </Suspense>
        } />
        <Route path="/reset-password" element={
          <Suspense fallback={<Loading fullScreen />}>
            <ResetPasswordPage />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
    </BrowserRouter>
  )
}

export default App
