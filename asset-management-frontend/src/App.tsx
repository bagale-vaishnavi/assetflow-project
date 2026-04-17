import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Layout from './components/layout/Layout';

import Dashboard from './pages/dashboard/Dashboard';
import AssetsPage from './pages/assets/AssetsPage';
import MyRequests from './pages/requests/MyRequests';
import AllRequests from './pages/requests/AllRequests';
import Notifications from './pages/notifications/Notifications';
import UsersPage from './pages/admin/UsersPage';
import AssignAsset from './pages/admin/AssignAsset';

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoutes />}>
            <Route index element={<Dashboard />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="requests/my" element={<MyRequests />} />
            <Route path="requests/all" element={<AllRequests />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="admin/users" element={<UsersPage />} />
            <Route path="admin/assign-asset" element={<AssignAsset />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;