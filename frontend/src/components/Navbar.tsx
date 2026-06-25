import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, LogOut, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './Navbar.module.css';

/**
 * Top navigation bar component.
 * Shows the app logo, nav links, and auth actions.
 * Collapses to a hamburger menu on mobile.
 */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    setMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navInner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
          <div className={styles.logoIcon}>
            <BookOpen size={20} strokeWidth={2.5} />
          </div>
          <span className={styles.logoText}>LibraryMS</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.navLinks}>
          <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
            All Books
          </Link>
          <Link
            to="/books/new"
            className={`${styles.navLink} ${isActive('/books/new') ? styles.active : ''}`}
          >
            <Plus size={15} />
            Add Book
          </Link>
        </div>

        {/* Desktop Auth Actions */}
        <div className={styles.authActions}>
          {/* Theme Toggle */}
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            id="theme-toggle-btn"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            <span className={styles.themeToggleTrack}>
              <span className={styles.themeToggleThumb}>
                {isDark ? <Moon size={13} /> : <Sun size={13} />}
              </span>
            </span>
          </button>

          {isAuthenticated ? (
            <>
              <div className={styles.userChip}>
                <User size={13} />
                <span>{user?.username}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                <LogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/auth/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            All Books
          </Link>
          <Link to="/books/new" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Add Book
          </Link>
          <div className={styles.mobileDivider} />
          {/* Theme toggle row in mobile menu */}
          <button
            className={styles.mobileThemeRow}
            onClick={toggleTheme}
            id="theme-toggle-mobile-btn"
          >
            {isDark ? <Moon size={15} /> : <Sun size={15} />}
            <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </button>
          <div className={styles.mobileDivider} />
          {isAuthenticated ? (
            <button className={`btn btn-secondary ${styles.mobileBtn}`} onClick={handleLogout}>
              <LogOut size={15} /> Sign Out
            </button>
          ) : (
            <>
              <Link to="/auth/login" className={`btn btn-secondary ${styles.mobileBtn}`} onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link to="/auth/register" className={`btn btn-primary ${styles.mobileBtn}`} onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
