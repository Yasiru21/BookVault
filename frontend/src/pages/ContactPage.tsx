import { useState, useEffect, useRef } from 'react';
import {
  Mail, Phone, ExternalLink, Github, Linkedin,
  Instagram, Facebook, MessageCircle, ChevronDown,
  Send, BookOpen, MapPin
} from 'lucide-react';
import styles from './ContactPage.module.css';

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

// ── Contact Channels ─────────────────────────────────────────────────────────
const CONTACTS = [
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    value: 'ygimres2@gmail.com',
    href: 'mailto:ygimres2@gmail.com',
    color: '#2563eb',
    description: 'Send me an email anytime',
  },
  {
    id: 'whatsapp',
    icon: Phone,
    label: 'WhatsApp',
    value: '+94 71 715 1905',
    href: 'https://wa.me/94717151905',
    color: '#25d366',
    description: 'Chat on WhatsApp',
  },
  {
    id: 'facebook',
    icon: Facebook,
    label: 'Facebook',
    value: 'Yasiru Gimres',
    href: 'https://www.facebook.com/yasiru.gimres.7?mibextid=ZbWKwL',
    color: '#1877f2',
    description: 'Connect on Facebook',
  },
  {
    id: 'instagram',
    icon: Instagram,
    label: 'Instagram',
    value: '@yasiru_gimrez',
    href: 'https://www.instagram.com/yasiru_gimrez?igsh=bHM5Z3k2OWVjOTAy',
    color: '#e1306c',
    description: 'Follow on Instagram',
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Yasiru De Silva',
    href: 'https://www.linkedin.com/in/yasiru-de-silva-190009307',
    color: '#0a66c2',
    description: 'Connect professionally',
  },
  {
    id: 'github',
    icon: Github,
    label: 'GitHub',
    value: 'Yasiru21',
    href: 'https://github.com/Yasiru21',
    color: '#6e40c9',
    description: 'See my projects',
  },
];

// ── FAQs ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'What is BookVault?',
    a: 'BookVault is a full-stack Library Management System built with React + TypeScript (frontend) and C# .NET 8 Web API + SQLite (backend). It lets users browse, search, and manage book records with full CRUD operations.',
  },
  {
    q: 'Do I need to create an account to view books?',
    a: 'No! Anyone can browse the catalogue, search books, filter by genre, and view full book details without signing in. An account is only required for creating, editing, or deleting books.',
  },
  {
    q: 'How do I run the project locally?',
    a: 'Clone the repository from GitHub, start the .NET backend with "dotnet run" in the backend/LibraryAPI folder (runs on port 5000), then install frontend dependencies with "npm install" and start with "npm run dev" (runs on port 5173).',
  },
  {
    q: 'What technologies does BookVault use?',
    a: 'Frontend: React 18, TypeScript, Vite, React Query, React Router v6, CSS Modules. Backend: C# .NET 8 Web API, Entity Framework Core, SQLite, JWT Authentication, AutoMapper, and Swagger for API documentation.',
  },
  {
    q: 'Is the source code available?',
    a: 'Yes! The full source code is publicly available on GitHub at github.com/Yasiru21/BookVault. Feel free to explore, fork, or contribute!',
  },
  {
    q: 'How is authentication implemented?',
    a: 'We use JWT (JSON Web Tokens) for stateless authentication. When you register or log in, the backend generates a signed token. The frontend stores this token in localStorage and sends it as a Bearer header on every API call that requires authorization.',
  },
  {
    q: 'Can I report bugs or suggest features?',
    a: 'Absolutely! Open an issue on the GitHub repository or reach out directly via email at ygimres2@gmail.com. All feedback is welcome.',
  },
];

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`${styles.faqItem} ${open ? styles.faqOpen : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button className={styles.faqQuestion} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <ChevronDown size={18} className={`${styles.faqChevron} ${open ? styles.faqChevronOpen : ''}`} />
      </button>
      <div className={styles.faqAnswer}>
        <p>{a}</p>
      </div>
    </div>
  );
}

// ── Section Heading ───────────────────────────────────────────────────────────
function SectionHeading({ label, title, sub }: { label: string; title: string; sub: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${styles.heading} ${visible ? styles.headingVisible : ''}`}
    >
      <span className={styles.headingLabel}>{label}</span>
      <h2 className={styles.headingTitle}>{title}</h2>
      <p className={styles.headingSub}>{sub}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ContactPage() {
  const { ref: contactRef, visible: contactVisible } = useReveal(0.05);
  const { ref: faqRef, visible: faqVisible } = useReveal(0.05);

  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOrb1} aria-hidden />
        <div className={styles.heroOrb2} aria-hidden />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.badge}>
            <MessageCircle size={12} /> Get in Touch
          </div>
          <h1 className={styles.heroTitle}>
            Contact <span className={styles.heroAccent}>BookVault</span>
          </h1>
          <p className={styles.heroSub}>
            Have a question, suggestion, or just want to say hi?<br />
            Reach out through any of the channels below — I'd love to hear from you.
          </p>

          {/* Quick info pills */}
          <div className={styles.heroPills}>
            <span className={styles.heroPill}><MapPin size={13} /> Sri Lanka</span>
            <span className={styles.heroPill}><BookOpen size={13} /> BookVault Project</span>
            <span className={styles.heroPill}><Send size={13} /> Fast Response</span>
          </div>
        </div>
      </section>

      {/* ── Contact Channels ─────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <SectionHeading
            label="📬 Contact Channels"
            title="Reach Me Anywhere"
            sub="Pick your preferred platform — I'm active across all of them."
          />
          <div
            ref={contactRef as React.RefObject<HTMLDivElement>}
            className={`${styles.contactGrid} ${contactVisible ? styles.contactGridVisible : ''}`}
          >
            {CONTACTS.map((c) => (
              <a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactCard}
                style={{ '--card-color': c.color } as React.CSSProperties}
              >
                <div className={styles.contactIconWrap}>
                  <c.icon size={24} />
                </div>
                <div className={styles.contactInfo}>
                  <span className={styles.contactLabel}>{c.label}</span>
                  <span className={styles.contactValue}>{c.value}</span>
                  <span className={styles.contactDesc}>{c.description}</span>
                </div>
                <ExternalLink size={14} className={styles.contactExternal} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.faqSection}`}>
        <div className="container">
          <SectionHeading
            label="❓ FAQs"
            title="Frequently Asked Questions"
            sub="Everything you need to know about BookVault."
          />
          <div
            ref={faqRef as React.RefObject<HTMLDivElement>}
            className={`${styles.faqList} ${faqVisible ? styles.faqListVisible : ''}`}
          >
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
