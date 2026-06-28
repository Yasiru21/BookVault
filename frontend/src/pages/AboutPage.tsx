import { useEffect, useRef, useState } from 'react';

import {
  BookOpen, Target, Layers, Code2, Database, Shield,
  Zap, Server, Layout, Key,
  ArrowRight, Award, BookMarked
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../services/bookService';
import styles from './AboutPage.module.css';

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

// ── Intersection Observer hook ────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Data ──────────────────────────────────────────────────────────────────────
// Stats are now generated dynamically in the component

const TECH_STACK = [
  {
    layer: 'Frontend',
    color: '#3b82f6',
    icon: Layout,
    items: [
      { name: 'React 18',        desc: 'Component-based UI with hooks' },
      { name: 'TypeScript',      desc: 'Fully typed for reliability' },
      { name: 'Vite',            desc: 'Lightning-fast dev & build' },
      { name: 'React Query',     desc: 'Intelligent server state caching' },
      { name: 'React Router v6', desc: 'Client-side navigation' },
      { name: 'CSS Modules',     desc: 'Scoped, collision-free styles' },
    ],
  },
  {
    layer: 'Backend',
    color: '#8b5cf6',
    icon: Server,
    items: [
      { name: '.NET 8 Web API',       desc: 'High-performance REST API' },
      { name: 'Entity Framework Core', desc: 'ORM for database access' },
      { name: 'SQLite',               desc: 'Portable, serverless database' },
      { name: 'JWT Auth',             desc: 'Stateless token authentication' },
      { name: 'AutoMapper',           desc: 'DTO ↔ Entity mapping' },
      { name: 'Swagger / OpenAPI',    desc: 'Interactive API documentation' },
    ],
  },
  {
    layer: 'Security & DevEx',
    color: '#10b981',
    icon: Shield,
    items: [
      { name: 'BCrypt',         desc: 'Password hashing' },
      { name: 'CORS Policy',    desc: 'Strict origin control' },
      { name: 'Zod Validation', desc: 'Schema-based form validation' },
      { name: 'ESLint',         desc: 'Code quality enforcement' },
    ],
  },
];

const ARCHITECTURE = [
  { icon: Layout,   label: 'React + Vite',    sub: 'Frontend SPA',        color: '#3b82f6' },
  { icon: Key,      label: 'JWT Auth',         sub: 'Token-based Security', color: '#f59e0b' },
  { icon: Server,   label: '.NET 8 API',       sub: 'REST Endpoints',       color: '#8b5cf6' },
  { icon: Database, label: 'SQLite + EF Core', sub: 'Data Persistence',     color: '#10b981' },
];

const TIMELINE = [
  { phase: 'Phase 1', title: 'Project Setup',      desc: 'React + Vite frontend, .NET 8 Web API backend, SQLite database, JWT authentication scaffolding.' },
  { phase: 'Phase 2', title: 'Core CRUD',          desc: 'Full book management — create, read, update, delete with DTO validation, EF Core migrations and Swagger docs.' },
  { phase: 'Phase 3', title: 'UI/UX Polish',       desc: 'Glassmorphism design system, dark/light theme toggle, animated stats bar, genre filters and 3D card effects.' },
  { phase: 'Phase 4', title: 'Features & Content', desc: 'Hero banner with rotating quotes, Features page, Benefits section, About page, and animated footer.' },
  { phase: 'Phase 5', title: 'Auth & Profiles',    desc: 'User profile page, protected routes (ProtectedRoute component), auth-aware UI hiding CUD buttons for guests and redirecting to login.' },
  { phase: 'Phase 6', title: 'Dynamic Data & Polish', desc: 'Integrated dynamic API-driven statistics using React Query, expanded the seed catalogue with 16+ diverse classical titles, and refined the UI by cleaning up developer tools for a production-ready look.' },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, icon: Icon, active }: { value: number, suffix: string, label: string, icon: any, active: boolean }) {
  const count = useCounter(value, 1600, active);
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}><Icon size={20} /></div>
      <div className={styles.statValue}>{count}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function AboutPage() {
  const { ref: statsRef, visible: statsVisible } = useReveal(0.2);
  const { ref: stackRef, visible: stackVisible } = useReveal(0.08);
  const { ref: archRef,  visible: archVisible  } = useReveal(0.1);
  const { ref: timeRef,  visible: timeVisible  } = useReveal(0.08);

  const { data } = useQuery({
    queryKey: ['booksTotalCount'],
    queryFn: () => getBooks({ page: 1, pageSize: 1 })
  });

  const totalBooks = data?.totalCount ?? 13; // default to 13 while loading

  const dynamicStats = [
    { value: 7,   suffix: '+', label: 'Core Features',     icon: Award },
    { value: totalBooks, suffix: '+', label: 'Books in Catalogue', icon: BookMarked },
    { value: 100, suffix: '%', label: 'TypeScript Typed',  icon: Code2 },
    { value: 10,  suffix: '+', label: 'Technologies Used', icon: Layers },
  ];

  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOrb1} aria-hidden />
        <div className={styles.heroOrb2} aria-hidden />
        <div className="container">
          <span className={styles.badge}><BookOpen size={13} /> About BookVault</span>
          <h1 className={styles.heroTitle}>
            Reimagining how <span className={styles.accent}>libraries work</span>
          </h1>
          <p className={styles.heroSub}>
            BookVault is a full-stack library management system built as a software engineering
            internship project — designed from the ground up with modern technologies,
            clean architecture, and an exceptional user experience.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionText}>
              <span className={styles.sectionLabel}>Our Mission</span>
              <h2 className={styles.sectionTitle}>Making knowledge accessible and organised</h2>
              <p className={styles.sectionBody}>
                Libraries are the foundation of learning, yet many still rely on outdated,
                paper-based cataloguing systems. BookVault was created to change that — bringing
                a modern, digital-first approach to library management that is fast, beautiful,
                and effortless to use.
              </p>
              <p className={styles.sectionBody}>
                Every feature was designed with two people in mind: the <strong>librarian</strong>{' '}
                who needs to manage thousands of records efficiently, and the <strong>reader</strong>{' '}
                who wants to discover their next great book without friction.
              </p>
              <div className={styles.missionPoints}>
                {[
                  { icon: Target,     text: 'Built for real-world library workflows' },
                  { icon: Zap,        text: 'Instant search and real-time filtering' },
                  { icon: Shield,     text: 'Secure authentication and data integrity' },
                  { icon: BookMarked, text: 'Clean, maintainable codebase' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className={styles.missionPoint}>
                    <Icon size={16} className={styles.missionPointIcon} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.missionVisual}>
              <div className={styles.visualCard}>
                <div className={styles.visualHeader}>
                  <div className={styles.visualDot} style={{ background: '#ef4444' }} />
                  <div className={styles.visualDot} style={{ background: '#f59e0b' }} />
                  <div className={styles.visualDot} style={{ background: '#10b981' }} />
                  <span className={styles.visualTitle}>BookVault</span>
                </div>
                <div className={styles.visualBody}>
                  {['The Pragmatic Programmer', 'Clean Code', 'Design Patterns', 'Refactoring', 'SICP'].map((book, i) => (
                    <div key={book} className={styles.visualRow} style={{ animationDelay: `${i * 0.15}s` }}>
                      <BookOpen size={14} className={styles.visualBookIcon} />
                      <span className={styles.visualBookTitle}>{book}</span>
                      <span className={`${styles.visualBadge}`}>
                        {['Tech', 'Tech', 'Tech', 'Tech', 'CS'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Animated Stats ───────────────────────────────────────────── */}
      <section
        ref={statsRef as React.RefObject<HTMLElement>}
        className={`${styles.statsSection} ${statsVisible ? styles.statsSectionVisible : ''}`}
      >
        <div className="container">
          <div className={styles.statsGrid}>
            {dynamicStats.map(s => (
              <StatCard key={s.label} {...s} active={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ── System Architecture ──────────────────────────────────────── */}
      <section
        ref={archRef as React.RefObject<HTMLElement>}
        className={styles.section}
      >
        <div className="container">
          <div className={`${styles.sectionHeading} ${archVisible ? styles.revealVisible : ''}`}
               style={{ transitionDelay: '0ms' }}>
            <span className={styles.sectionLabel}>Architecture</span>
            <h2 className={styles.sectionTitle}>How it all fits together</h2>
            <p className={styles.sectionSub}>
              A clean, layered architecture that separates concerns and enables independent scaling of each component.
            </p>
          </div>

          <div className={styles.archRow}>
            {ARCHITECTURE.map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={node.label} className={styles.archItem}>
                  <div
                    className={`${styles.archCard} ${archVisible ? styles.archCardVisible : ''}`}
                    style={{ '--delay': `${i * 120}ms`, '--accent': node.color } as React.CSSProperties}
                  >
                    <div className={styles.archIcon}><Icon size={26} /></div>
                    <div className={styles.archLabel}>{node.label}</div>
                    <div className={styles.archSub}>{node.sub}</div>
                  </div>
                  {i < ARCHITECTURE.length - 1 && (
                    <ArrowRight size={20} className={styles.archArrow} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────────────── */}
      <section
        ref={stackRef as React.RefObject<HTMLElement>}
        className={`${styles.section} ${styles.stackSection}`}
      >
        <div className="container">
          <div className={`${styles.sectionHeading} ${stackVisible ? styles.revealVisible : ''}`}>
            <span className={styles.sectionLabel}>Technology Stack</span>
            <h2 className={styles.sectionTitle}>Built with modern tools</h2>
            <p className={styles.sectionSub}>
              Every technology was chosen intentionally — for performance, developer experience, and long-term maintainability.
            </p>
          </div>

          <div className={styles.stackGrid}>
            {TECH_STACK.map((layer, li) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.layer}
                  className={`${styles.stackCard} ${stackVisible ? styles.stackCardVisible : ''}`}
                  style={{ '--delay': `${li * 120}ms`, '--accent': layer.color } as React.CSSProperties}
                >
                  <div className={styles.stackHeader}>
                    <div className={styles.stackLayerIcon}><Icon size={18} /></div>
                    <h3 className={styles.stackLayerName}>{layer.layer}</h3>
                  </div>
                  <div className={styles.stackItems}>
                    {layer.items.map(item => (
                      <div key={item.name} className={styles.stackItem}>
                        <div className={styles.stackItemDot} />
                        <div>
                          <div className={styles.stackItemName}>{item.name}</div>
                          <div className={styles.stackItemDesc}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Project Timeline ─────────────────────────────────────────── */}
      <section
        ref={timeRef as React.RefObject<HTMLElement>}
        className={styles.section}
      >
        <div className="container">
          <div className={`${styles.sectionHeading} ${timeVisible ? styles.revealVisible : ''}`}>
            <span className={styles.sectionLabel}>Development Journey</span>
            <h2 className={styles.sectionTitle}>Built phase by phase</h2>
          </div>

          <div className={styles.timeline}>
            {TIMELINE.map((item, i) => (
              <div
                key={item.phase}
                className={`${styles.timelineItem} ${timeVisible ? styles.timelineItemVisible : ''}`}
                style={{ '--delay': `${i * 110}ms` } as React.CSSProperties}
              >
                <div className={styles.timelineLeft}>
                  <div className={styles.timelineDot} />
                  {i < TIMELINE.length - 1 && <div className={styles.timelineLine} />}
                </div>
                <div className={styles.timelineContent}>
                  <span className={styles.timelinePhase}>{item.phase}</span>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
