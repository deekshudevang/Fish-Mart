import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import CMS from './pages/CMS';

function AdminLayout({ children }) {
  return (
    <div className="admin-bg min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-500">
        <AdminNavbar />
        <main className="p-6 lg:p-12 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { admin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout><Dashboard /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <AdminLayout><Products /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AdminLayout><Orders /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminLayout><Users /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cms"
        element={
          <ProtectedRoute>
            <AdminLayout><CMS /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AdminLayout><Analytics /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={admin ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
