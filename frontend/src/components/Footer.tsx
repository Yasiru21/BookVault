import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Linkedin, Instagram, ArrowRight, Mail } from 'lucide-react';
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
      { label: 'Browse Catalog', to: '/',            internal: true },
      { label: 'Add Book',       to: '/books/new',   internal: true },
      { label: 'Features',       to: '/features',    internal: true },
      { label: 'About',          to: '/about',       internal: true },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'API Docs (Swagger)', to: 'http://localhost:5000/swagger', internal: false },
      { label: 'GitHub Repository',  to: 'https://github.com/Yasiru21/BookVault', internal: false },
      { label: 'Sign Up',            to: '/auth/register', internal: true },
      { label: 'Sign In',            to: '/auth/login',    internal: true },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Contact Page',  to: '/contact',                         internal: true },
      { label: 'GitHub',        to: 'https://github.com/Yasiru21',      internal: false },
      { label: 'LinkedIn',      to: 'https://www.linkedin.com/in/yasiru-de-silva-190009307', internal: false },
      { label: 'Email Us',      to: 'mailto:ygimres2@gmail.com',        internal: false },
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
            <a href="mailto:ygimres2@gmail.com" className={styles.contactEmail}>
              <Mail size={14} />
              ygimres2@gmail.com
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
              { Icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/yasiru_gimrez?igsh=bHM5Z3k2OWVjOTAy' },
              { Icon: Linkedin,  label: 'LinkedIn',  href: 'https://www.linkedin.com/in/yasiru-de-silva-190009307' },
              { Icon: Github,    label: 'GitHub',    href: 'https://github.com/Yasiru21' },
            ].map(({ Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={styles.socialBtn}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
