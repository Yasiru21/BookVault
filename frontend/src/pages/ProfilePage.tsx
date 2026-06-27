import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, BookOpen, LogOut, ArrowLeft } from 'lucide-react';
import styles from './ProfilePage.module.css';

/**
 * ProfilePage — Displays the signed-in user's profile details.
 * Accessible only to authenticated users (protected by ProtectedRoute).
 */
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Derive initials for the avatar
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className={styles.page}>
      {/* ── Background orbs ── */}
      <div className={styles.orb1} aria-hidden />
      <div className={styles.orb2} aria-hidden />

      <div className={`container ${styles.content}`}>
        {/* Back button */}
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Profile Card */}
        <div className={styles.card}>
          {/* Avatar */}
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.avatarGlow} aria-hidden />
          </div>

          {/* Username + role badge */}
          <div className={styles.identity}>
            <h1 className={styles.username}>{user?.username}</h1>
            <span className={styles.roleBadge}>
              <Shield size={12} />
              {user?.role ?? 'Member'}
            </span>
          </div>

          {/* Info rows */}
          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}><User size={16} /></span>
              <div>
                <span className={styles.infoLabel}>Username</span>
                <span className={styles.infoValue}>{user?.username}</span>
              </div>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoIcon}><Mail size={16} /></span>
              <div>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user?.email}</span>
              </div>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoIcon}><Shield size={16} /></span>
              <div>
                <span className={styles.infoLabel}>Role</span>
                <span className={styles.infoValue}>{user?.role ?? 'Member'}</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className={styles.actions}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              <BookOpen size={15} />
              Browse Books
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
