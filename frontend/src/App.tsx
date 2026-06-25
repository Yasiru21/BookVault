import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';

// Lazy-loaded page components
import BookListPage from './pages/BookListPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

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
            <Navbar />
            <main>
              <Routes>
                {/* ── Book Routes ── */}
                <Route path="/" element={<BookListPage />} />
                <Route path="/books/new" element={<AddBookPage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                <Route path="/books/:id/edit" element={<EditBookPage />} />

                {/* ── Auth Routes ── */}
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />

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

            {/* Theme-aware toast notifications */}
            <ThemedToaster />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
      {/* React Query DevTools — only visible in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
