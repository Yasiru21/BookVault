import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Linkedin, Twitter, ArrowRight, Mail } from 'lucide-react';
import styles from './Footer.module.css';

// ── Scroll-triggered animation hook ─────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const NAV_COLS = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Catalog', to: '/', internal: true },
      { label: 'Add Book',       to: '/books/new', internal: true },
      { label: 'Features',       to: '#' },
      { label: 'Integrations',   to: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', to: '#' },
      { label: 'API Reference',  to: '#' },
      { label: 'Help Center',    to: '#' },
      { label: 'System Status',  to: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',  to: '#' },
      { label: 'Careers',   to: '#' },
      { label: 'Security',  to: '#' },
      { label: 'Contact',   to: '#' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const { ref: footerRef, inView } = useInView(0.1);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setEmail('');
  };

  return (
    <footer
      ref={footerRef as React.RefObject<HTMLElement>}
      className={`${styles.footer} ${inView ? styles.visible : ''}`}
    >
      {/* Ambient decorative orb */}
      <div className={styles.orb} aria-hidden />

      <div className={`container ${styles.inner}`}>

        {/* ── Row 1: Brand + Newsletter ─────────────────────────────────── */}
        <div className={styles.topRow}>

          {/* Brand */}
          <div className={`${styles.brand} ${styles.colBase}`} style={{ '--delay': '0ms' } as React.CSSProperties}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}><BookOpen size={22} strokeWidth={2} /></span>
              <span className={styles.logoText}>BookVault</span>
            </Link>
            <p className={styles.tagline}>
              Next-generation library management. Organize, track and share your
              entire reading world — all in one place.
            </p>
            <a href="mailto:support@bookvault.dev" className={styles.contactEmail}>
              <Mail size={14} />
              support@bookvault.dev
            </a>
          </div>

          {/* Newsletter */}
          <div className={`${styles.newsletter} ${styles.colBase}`} style={{ '--delay': '100ms' } as React.CSSProperties}>
            <span className={styles.newsletterBadge}>Newsletter</span>
            <h3 className={styles.newsletterHeading}>Stay up to date</h3>
            <p className={styles.newsletterSub}>
              Feature releases, library tips and curated reads — straight to your inbox.
            </p>
            <form className={styles.form} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.emailInput}
                required
              />
              <button type="submit" className={`${styles.subBtn} ${sent ? styles.sent : ''}`}>
                {sent ? '✓ Sent!' : <><span>Subscribe</span><ArrowRight size={15} /></>}
              </button>
            </form>
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className={styles.divider} />

        {/* ── Row 2: Nav Columns ───────────────────────────────────────── */}
        <div className={styles.navRow}>
          {NAV_COLS.map((col, ci) => (
            <div
              key={col.title}
              className={`${styles.navCol} ${styles.colBase}`}
              style={{ '--delay': `${(ci + 2) * 80}ms` } as React.CSSProperties}
            >
              <h4 className={styles.colTitle}>{col.title}</h4>
              <ul className={styles.linkList}>
                {col.links.map(link => (
                  <li key={link.label}>
                    {link.internal
                      ? <Link to={link.to!} className={styles.navLink}>{link.label}</Link>
                      : <a href={link.to} className={styles.navLink}>{link.label}</a>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className={styles.divider} />

        {/* ── Row 3: Bottom bar ────────────────────────────────────────── */}
        <div className={styles.bottomRow}>
          <span className={styles.copyright}>© {year} BookVault Inc. All rights reserved.</span>
          <nav className={styles.legal} aria-label="Legal links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </nav>
          <div className={styles.socials}>
            {[
              { Icon: Twitter,  label: 'Twitter'  },
              { Icon: Linkedin, label: 'LinkedIn'  },
              { Icon: Github,   label: 'GitHub'    },
            ].map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label} className={styles.socialBtn}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
