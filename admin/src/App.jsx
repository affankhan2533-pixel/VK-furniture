import React, { Suspense, lazy, useState, useEffect } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  Outlet, 
  useLocation
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import './App.css';

// Lazy load pages for modern code splitting
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Enquiries = lazy(() => import('./pages/Enquiries'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading spinner fallback during suspense load
const LoadingSpinner = () => (
  <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4 select-none">
    <div className="w-8 h-8 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin" />
    <p className="text-[10px] font-mono tracking-widest text-[#D4AF75]/40 uppercase animate-pulse">Loading workspace...</p>
  </div>
);

// ScrollToTop helper on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
  }, [pathname]);
  return null;
};

// Route Auth Guard
const RequireAuth = () => {
  const token = localStorage.getItem('vk_admin_token');
  const sessionAuth = sessionStorage.getItem('vk_admin_authenticated');
  
  if (!token && sessionAuth !== 'true') {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// Layout wrapping the protected workspace pages
const WorkspaceLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] text-[#E2E8F0] overflow-hidden">
      {/* ScrollToTop on routing */}
      <ScrollToTop />

      {/* Sidebar Navigation Drawer */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Navbar */}
        <Navbar 
          toggleSidebar={toggleSidebar} 
          searchVal={searchVal} 
          setSearchVal={setSearchVal} 
        />

        {/* Dynamic page outlet container */}
        <main className="flex-1 overflow-y-auto bg-[#0B0F19] custom-scrollbar">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet context={{ searchVal }} />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  // Read theme color from localStorage and apply to document element
  useEffect(() => {
    const saved = localStorage.getItem('vk_admin_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.accentColor) {
          document.documentElement.style.setProperty('--vk-gold-accent', settings.accentColor);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      {/* Toast Notification Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0E121E',
            color: '#E2E8F0',
            border: '1px solid rgba(176, 141, 87, 0.3)',
            borderRadius: '16px',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#D4AF75',
              secondary: '#0E121E',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0E121E',
            },
          },
        }}
      />

      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        } />

        {/* Protected Dashboard Workspace Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<WorkspaceLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
