import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

import ServiceManagement from './pages/ServiceManagement';
import AvailabilityManagement from './pages/AvailabilityManagement';
import Agenda from './pages/Agenda';
import DashboardHome from './pages/DashboardHome';
import BookingPage from './pages/BookingPage';
import ClientAppointments from './pages/ClientAppointments';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/agenda"
          element={
            <PrivateRoute>
              <Agenda />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/services"
          element={
            <PrivateRoute>
              <ServiceManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/availabilities"
          element={
            <PrivateRoute>
              <AvailabilityManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/b/:slug"
          element={<BookingPage />}
        />
        <Route
          path="/dashboard/client"
          element={
            <PrivateRoute>
              <ClientAppointments />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
