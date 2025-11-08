import { Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public pages
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';

// Auth pages
import AdminLogin from './pages/AdminLogin';

// Admin pages
import AdminFeatures from './pages/admin/AdminFeatures';
import AdminLetters from './pages/admin/AdminLetters';
import AdminUsers from './pages/admin/AdminUsers';

export function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>
              <Home />
            </main>
          </div>
        }
      />
      <Route
        path="/about"
        element={
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>
              <About />
            </main>
          </div>
        }
      />
      <Route
        path="/contact"
        element={
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>
              <Contact />
            </main>
          </div>
        }
      />

      {/* Hidden admin login route */}
      <Route path="/admin-portal" element={<AdminLogin />} />

      {/* Protected admin routes */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/letters"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <AdminLetters />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/features"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <AdminFeatures />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">404 - Page Not Found</h1>
              <p className="text-gray-600">The page you're looking for doesn't exist.</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
