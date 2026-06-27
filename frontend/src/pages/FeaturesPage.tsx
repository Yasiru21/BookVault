import { useEffect, useRef, useState } from 'react';
import {
  BookOpen, Search, Shield, Tag, BarChart3, Smartphone,
  CheckCircle2, Zap, Lock, DollarSign, RefreshCw, Users
} from 'lucide-react';
import styles from './FeaturesPage.module.css';

// ── Intersection Observer hook for scroll animations ──────────────────────────
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    num: '01',
    icon: BookOpen,
    title: 'Smart Book Catalogue',
    desc: 'Maintain a comprehensive digital record of every book — title, author, genre, ISBN, year and description — all structured for fast retrieval and easy editing.',
    color: '#2563eb',
  },
  {
    num: '02',
    icon: Search,
    title: 'Instant Search & Filter',
    desc: 'Find any book in milliseconds with real-time full-text search and one-click genre filters. No page reloads, no waiting — powered by React Query caching.',
    color: '#7c3aed',
  },
  {
    num: '03',
    icon: Shield,
    title: 'Secure Authentication',
    desc: 'Industry-standard JWT-based login and registration system protects your library data. Tokens are stored securely and every API call is authorised.',
    color: '#059669',
  },
  {
    num: '04',
    icon: Tag,
    title: 'Genre Classification',
    desc: 'Organise your entire collection by genre with visual pill filters. Readers and librarians can jump directly to Fiction, Technology, Business or any custom category.',
    color: '#d97706',
  },
  {
    num: '05',
    icon: BarChart3,
    title: 'Live Library Statistics',
    desc: 'Real-time dashboard counters show total books, unique authors and genre breadth — giving librarians instant insight into collection growth.',
    color: '#db2777',
  },
  {
    num: '06',
    icon: Smartphone,
    title: 'Fully Responsive Design',
    desc: 'BookVault looks and works perfectly on desktop, tablet and mobile. A fluid grid layout and glassmorphism UI adapt seamlessly to every screen size.',
    color: '#0891b2',
  },
];

const BENEFITS = [
  {
    icon: Zap,
    title: 'Saves Time',
    color: '#f59e0b',
    items: [
      'Instant search replaces manual card catalogues',
      'Bulk operations reduce repetitive data entry',
      'Auto-filled metadata speeds up book registration',
      'One-click editing with real-time validation',
    ],
  },
  {
    icon: Lock,
    title: 'Secure & Reliable',
    color: '#10b981',
    items: [
      'JWT authentication on every API request',
      'Role-based access control for librarians',
      'SQLite database with transaction integrity',
      'Automatic session management & logout',
    ],
  },
  {
    icon: DollarSign,
    title: 'Cost Effective',
    color: '#3b82f6',
    items: [
      'Eliminates paper-based cataloguing costs',
      'Open-source stack with zero licence fees',
      'Reduced manual labour through automation',
      'Single platform replaces multiple tools',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Always Up-to-Date',
    color: '#8b5cf6',
    items: [
      'React Query keeps data fresh automatically',
      'Background refetch on window focus',
      'Optimistic UI updates for instant feedback',
      'Stale-while-revalidate caching strategy',
    ],
  },
  {
    icon: Users,
    title: 'User Friendly',
    color: '#ef4444',
    items: [
      'Clean, intuitive interface for all skill levels',
      'Keyboard-navigable for accessibility',
      'Clear error messages guide every action',
      'Dark and light mode for visual comfort',
    ],
  },
  {
    icon: Smartphone,
    title: 'Access Anywhere',
    color: '#06b6d4',
    items: [
      'Fully responsive on desktop, tablet & mobile',
      'Runs in any modern browser — no install needed',
      'Progressive UI with fast load times',
      'Optimised for slow network conditions',
    ],
  },
];

// ── Section heading helper ────────────────────────────────────────────────────
function SectionHeading({ label, title, sub }: { label: string; title: string; sub: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${styles.heading} ${visible ? styles.headingVisible : ''}`}
    >
      <span className={styles.headingLabel}>{label}</span>
      <h2 className={styles.headingTitle}>{title}</h2>
      <div className={styles.headingBar} />
      <p className={styles.headingSub}>{sub}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FeaturesPage() {
  const featRef = useRef<HTMLElement>(null);
  const [featVisible, setFeatVisible] = useState(false);
  const benRef  = useRef<HTMLElement>(null);
  const [benVisible,  setBenVisible]  = useState(false);

  useEffect(() => {
    const makeObs = (setter: (v: boolean) => void) =>
      new IntersectionObserver(([e]) => { if (e.isIntersecting) { setter(true); } }, { threshold: 0.06 });
    const o1 = makeObs(setFeatVisible);
    const o2 = makeObs(setBenVisible);
    if (featRef.current) o1.observe(featRef.current);
    if (benRef.current)  o2.observe(benRef.current);
    return () => { o1.disconnect(); o2.disconnect(); };
  }, []);

  return (
    <div className={styles.page}>

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOrb1} aria-hidden />
        <div className={styles.heroOrb2} aria-hidden />
        <div className="container">
          <div className={styles.heroBadge}>
            <BookOpen size={14} /> Platform Overview
          </div>
          <h1 className={styles.heroTitle}>
            Built for <span className={styles.heroAccent}>modern libraries</span>
          </h1>
          <p className={styles.heroSub}>
            Discover the powerful features and tangible benefits that make BookVault the
            smartest way to manage your book collection.
          </p>
        </div>
      </section>

      {/* ── Key Features ─────────────────────────────────────────────── */}
      <section
        ref={featRef as React.RefObject<HTMLElement>}
        className={styles.section}
      >
        <div className="container">
          <SectionHeading
            label="Key Features"
            title="Everything your library needs"
            sub="A full-featured system designed to handle every aspect of library management — from discovery to security."
          />

          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.num}
                  className={`${styles.featureCard} ${featVisible ? styles.featureCardVisible : ''}`}
                  style={{ '--delay': `${i * 90}ms`, '--accent': f.color } as React.CSSProperties}
                >
                  <div className={styles.featureTop}>
                    <span className={styles.featureNum}>{f.num}</span>
                    <div className={styles.featureIconWrap}>
                      <Icon size={22} />
                    </div>
                  </div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                  <div className={styles.featureAccentBar} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────── */}
      <section
        ref={benRef as React.RefObject<HTMLElement>}
        className={`${styles.section} ${styles.benefitsSection}`}
      >
        <div className="container">
          <SectionHeading
            label="Benefits"
            title="Why choose BookVault?"
            sub="Real advantages that save time, reduce cost, and improve the experience for every librarian and reader."
          />

          <div className={styles.benefitGrid}>
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className={`${styles.benefitCard} ${benVisible ? styles.benefitCardVisible : ''}`}
                  style={{ '--delay': `${i * 80}ms`, '--accent': b.color } as React.CSSProperties}
                >
                  <div className={styles.benefitHeader}>
                    <div className={styles.benefitIconWrap}>
                      <Icon size={20} />
                    </div>
                    <h3 className={styles.benefitTitle}>{b.title}</h3>
                  </div>
                  <ul className={styles.benefitList}>
                    {b.items.map(item => (
                      <li key={item} className={styles.benefitItem}>
                        <CheckCircle2 size={15} className={styles.checkIcon} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className={styles.ctaOrb} aria-hidden />
            <h2 className={styles.ctaTitle}>Ready to modernise your library?</h2>
            <p className={styles.ctaSub}>Join BookVault and experience a smarter way to manage books.</p>
            <div className={styles.ctaBtns}>
              <a href="/books/new" className="btn btn-primary">Add Your First Book</a>
              <a href="/" className="btn btn-secondary">Browse Catalogue</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
