import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { CartProvider } from './context/CartContext';
import TranslationProtectionValidator from './components/TranslationProtectionValidator';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

// Public & Client imports
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import BoutiqueCatalog from './pages/BoutiqueCatalog';
import ProvidersPage from './pages/ProvidersPage';
import BookingPage from './pages/BookingPage';
import HairConsultation from './pages/HairConsultation';
import ClientDashboard from './pages/ClientDashboard';
import ClientAppointments from './pages/ClientAppointments';
import MemberProfile from './pages/MemberProfile';
import ClientSettings from './pages/ClientSettings';
import Gallery from './pages/Gallery';
import LoyaltyProgram from './pages/LoyaltyProgram';
import HelpCenter from './pages/HelpCenter';
import DashboardHome from './pages/DashboardHome';

// Admin imports
import ProductManagement from './pages/admin/ProductManagement';
import ClientManagement from './pages/admin/ClientManagement';
import BookingManagement from './pages/admin/BookingManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import AvailabilityManagement from './pages/admin/AvailabilityManagement';
import Agenda from './pages/admin/Agenda';
import LoyaltyManagement from './pages/admin/LoyaltyManagement';
import SiteSettings from './pages/admin/SiteSettings';
import ContactMessages from './pages/admin/ContactMessages';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';

// Route protégée - vérifie l'authentification
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Home />;
  return user ? children : <Navigate to="/login" />;
};

// Route protégée pour les prestataires uniquement
const ProviderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Home />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'provider') return <Navigate to="/client" />;
  return children;
};

// Route protégée pour les clients uniquement
const ClientRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Home />;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'provider') return <Navigate to="/dashboard" />;
  return children;
};

// Redirection intelligente basée sur le rôle
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <Home />; // show public home while auth resolves to avoid blank screen
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
              <Agenda />
            </ProviderRoute>
          }
        />
        <Route
          path="/dashboard/services"
          element={
            <ProviderRoute>
              <ServiceManagement />
            </ProviderRoute>
          }
        />
        <Route
          path="/dashboard/availabilities"
          element={
            <ProviderRoute>
              <AvailabilityManagement />
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
        <Route
          path="/dashboard/loyalty"
          element={
            <ProviderRoute>
              <LoyaltyManagement />
            </ProviderRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProviderRoute>
              <SiteSettings />
            </ProviderRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <ProviderRoute>
              <ContactMessages />
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
        <Route path="/shop" element={<BoutiqueCatalog />} />
        <Route path="/boutique" element={<BoutiqueCatalog />} />
        <Route path="/client/shop" element={<BoutiqueCatalog />} />
        <Route
          path="/client/appointments"
          element={
            <ClientRoute>
              <ClientAppointments />
            </ClientRoute>
          }
        />

        {/* Client Protected Routes - Profile, Gallery, Rewards */}
        <Route
          path="/profile"
          element={
            <ClientRoute>
              <ClientSettings />
            </ClientRoute>
          }
        />

        <Route path="/gallery" element={<Gallery />} />

        <Route
          path="/rewards"
          element={
            <ClientRoute>
              <LoyaltyProgram />
            </ClientRoute>
          }
        />

        {/* Help Center - Client */}
        <Route
          path="/help"
          element={
            <ClientRoute>
              <HelpCenter />
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
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />

        {/* Page d'accueil publique */}
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SiteSettingsProvider>
          <CartProvider>
            {/* 🛡️ Translation Protection Validator - Active in Development */}
            {process.env.NODE_ENV === 'development' && (
              <TranslationProtectionValidator enabled={true} verbose={false} />
            )}
            <AppContent />
          </CartProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;




