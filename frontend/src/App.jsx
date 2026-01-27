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
import ClientDashboard from './pages/ClientDashboard';
import ProvidersPage from './pages/ProvidersPage';
import Home from './pages/Home';
import ClientsManagement from './pages/ClientsManagement';
import MemberProfile from './pages/MemberProfile';
import HairConsultation from './pages/HairConsultation';
import BoutiqueCatalog from './pages/BoutiqueCatalog';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin imports
import ProductManagement from './pages/admin/ProductManagement';
import ClientManagement from './pages/admin/ClientManagement';
import BookingManagement from './pages/admin/BookingManagement';

// Route protégée - vérifie l'authentification
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

// Route protégée pour les prestataires uniquement
const ProviderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'provider') return <Navigate to="/client" />;
  return children;
};

// Route protégée pour les clients uniquement
const ClientRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'provider') return <Navigate to="/dashboard" />;
  return children;
};

// Redirection intelligente basée sur le rôle
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Home />;
  return user.role === 'provider' ? <Navigate to="/dashboard" /> : <Navigate to="/client" />;
};

function AppContent() {
  const { user } = useAuth();

  // Redirection après login basée sur le rôle
  const getRedirectPath = () => {
    if (!user) return '/login';
    return user.role === 'provider' ? '/dashboard' : '/client';
  };

  return (
    <div className="min-h-screen font-sans">
      <Routes>
        <Route path="/login" element={user ? <Navigate to={getRedirectPath()} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={getRedirectPath()} /> : <Register />} />

        <Route path="/" element={<Home />} />

        {/* Routes Prestataire */}
        <Route
          path="/dashboard"
          element={
            <ProviderRoute>
              <DashboardHome />
            </ProviderRoute>
          }
        />
        <Route
          path="/dashboard/agenda"
          element={
            <ProviderRoute>
              <BookingManagement />
            </ProviderRoute>
          }
        />
        <Route
          path="/dashboard/clients"
          element={
            <ProviderRoute>
              <ClientManagement />
            </ProviderRoute>
          }
        />
        <Route
          path="/dashboard/products"
          element={
            <ProviderRoute>
              <ProductManagement />
            </ProviderRoute>
          }
        />

        {/* Routes Client */}
        <Route
          path="/client"
          element={
            <ClientRoute>
              <MemberProfile />
            </ClientRoute>
          }
        />
        <Route
          path="/client/consultation"
          element={
            <ClientRoute>
              <HairConsultation />
            </ClientRoute>
          }
        />
        <Route
          path="/client/shop"
          element={
            <ClientRoute>
              <BoutiqueCatalog />
            </ClientRoute>
          }
        />
        <Route
          path="/client/appointments"
          element={
            <ClientRoute>
              <ClientAppointments />
            </ClientRoute>
          }
        />

        {/* Route publique de réservation */}
        <Route
          path="/b/:slug"
          element={<BookingPage />}
        />

        {/* Liste des prestataires */}
        <Route
          path="/providers"
          element={<ProvidersPage />}
        />

        <Route
          path="/faq"
          element={<FAQ />}
        />
        <Route
          path="/about"
          element={<About />}
        />
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* Redirection racine basée sur le rôle */}
        <Route path="/" element={<RoleBasedRedirect />} />
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
