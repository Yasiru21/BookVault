import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, BookOpenCheck } from 'lucide-react';
import styles from './HeroBanner.module.css';

const QUOTES = [
  { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "Not all those who wander are lost — but all great readers are found.", author: "BookVault" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "One must always be careful of books, and what is inside them.", author: "Cassandra Clare" },
  { text: "So many books, so little time.", author: "Frank Zappa" },
  { text: "Reading gives us someplace to go when we have to stay where we are.", author: "Mason Cooley" },
];

function getGreeting(name: string): string {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name} ☀️`;
  if (h < 17) return `Good afternoon, ${name} 🌤️`;
  return `Good evening, ${name} 🌙`;
}

export default function HeroBanner() {
  const { user } = useAuth();
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [fade, setFade] = useState(true);

  // Rotate quote every 8 seconds with a cross-fade
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIdx(i => (i + 1) % QUOTES.length);
        setFade(true);
      }, 400);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const quote = QUOTES[quoteIdx];
  const displayName = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : 'Reader';

  return (
    <div className={styles.banner}>
      {/* Decorative animated circles */}
      <div className={styles.circle1} aria-hidden />
      <div className={styles.circle2} aria-hidden />

      <div className={styles.left}>
        <div className={styles.greeting}>
          <BookOpenCheck size={20} className={styles.greetIcon} />
          <span>{getGreeting(displayName)}</span>
        </div>
        <h2 className={styles.headline}>
          Your personal library,<br />
          <span className={styles.accent}>beautifully organised.</span>
        </h2>
        <p className={styles.sub}>
          Manage, discover, and curate your entire book collection — all in one intelligent platform.
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.quoteCard}>
          <Sparkles size={16} className={styles.sparkle} />
          <blockquote
            className={styles.quote}
            style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.4s ease' }}
          >
            <p className={styles.quoteText}>"{quote.text}"</p>
            <footer className={styles.quoteAuthor}>— {quote.author}</footer>
          </blockquote>
          <div className={styles.quoteDots}>
            {QUOTES.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === quoteIdx ? styles.dotActive : ''}`}
                onClick={() => { setFade(false); setTimeout(() => { setQuoteIdx(i); setFade(true); }, 300); }}
                aria-label={`Quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
