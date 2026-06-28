import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy-loaded page components
import BookListPage from './pages/BookListPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import BookDetailPage from './pages/BookDetailPage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

// ─────────────────────────────────────────────────────────────────────────────
// React Query Client Configuration
// staleTime: 60s — data stays fresh for 1 minute before background refetch
// retry: 1 — only retry failed requests once to avoid hammering the API
// ─────────────────────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * ScrollToTop — Utility component to scroll the window to the top on every route change.
 * Must be rendered inside a <BrowserRouter>.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * ThemedToaster — Toaster that adapts its appearance to the current theme.
 * Must be inside ThemeProvider so it can read the theme value.
 */
function ThemedToaster() {
  const { isDark } = useTheme();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: isDark
          ? {
              background: 'rgba(15, 15, 26, 0.95)',
              color: '#f1f0ff',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
            }
          : {
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1e1b4b',
              border: '1px solid rgba(109, 40, 217, 0.15)',
              backdropFilter: 'blur(12px)',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 16px rgba(109, 40, 217, 0.12)',
            },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
  );
}

/**
 * Root application component.
 * Sets up:
 *   - React Query for server state management
 *   - ThemeProvider for dark/light mode
 *   - Auth context for global authentication state
 *   - React Router for client-side navigation
 *   - Toast notifications (react-hot-toast)
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* ── Book Routes ── */}
                  <Route path="/" element={<BookListPage />} />
                  <Route path="/books/new" element={<ProtectedRoute><AddBookPage /></ProtectedRoute>} />
                  <Route path="/books/:id" element={<BookDetailPage />} />
                  <Route path="/books/:id/edit" element={<ProtectedRoute><EditBookPage /></ProtectedRoute>} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* ── Auth Routes ── */}
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />

                  {/* ── Profile Route (protected) ── */}
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                  {/* ── 404 Fallback ── */}
                  <Route
                    path="*"
                    element={
                      <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--color-text-secondary)' }}>
                        <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>404</h1>
                        <p>This page doesn't exist.</p>
                        <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                          Back to Library
                        </a>
                      </div>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>

            {/* Theme-aware toast notifications */}
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            <ThemedToaster />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
