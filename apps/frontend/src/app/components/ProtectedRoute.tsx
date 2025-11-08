import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireTrustedDevice?: boolean; // For future implementation
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireTrustedDevice = false,
}: ProtectedRouteProps) {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated admin - redirect to admin login
  if (!isAuthenticated && requireAdmin) {
    return <Navigate to="/admin-portal" state={{ from: location }} replace />;
  }

  // Authenticated but not admin when admin is required
  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mb-4 text-gray-600">You don't have permission to access this page.</p>
          <button
            onClick={() => (window.location.href = '/')}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // TODO: Future implementation for trusted device check
  if (requireTrustedDevice) {
    // This will be implemented when trusted device functionality is added
    console.log('Trusted device check not yet implemented');
  }

  // All checks passed - render the protected content
  return <>{children}</>;
}

export default ProtectedRoute;
