import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * ThemeProvider — wraps the app and injects a `data-theme` attribute on <html>.
 * The active theme is persisted in localStorage so it survives page refreshes.
 * CSS variables for each theme are defined in index.css via [data-theme="light"].
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialise from localStorage, or fall back to system preference
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('lms-theme') as Theme | null;
    if (saved === 'dark' || saved === 'light') return saved;
    // Respect OS preference on first visit
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // Apply the theme attribute to <html> whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lms-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook — access theme state and toggle from any component */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
