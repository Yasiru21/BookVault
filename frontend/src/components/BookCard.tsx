import { Link } from 'react-router-dom';
import { Edit2, Trash2, BookOpen, Calendar, Hash, ArrowRight } from 'lucide-react';
import type { Book } from '../types';
import { use3DTilt } from '../hooks/use3DTilt';
import styles from './BookCard.module.css';

interface BookCardProps {
  book: Book;
  onDelete: (id: number, title: string) => void;
  /** Stagger index — used to offset the entrance animation delay */
  index?: number;
}

/**
 * Maps a genre string to a deterministic hue so every genre gets its own colour.
 * Uses a simple hash so the same genre always gets the same colour.
 */
function genreHue(genre: string): string {
  let hash = 0;
  for (let i = 0; i < genre.length; i++) hash = genre.charCodeAt(i) + ((hash << 5) - hash);
  // Map to a pleasant slice of the colour wheel (avoid near-white/near-black)
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

/**
 * Displays a single book record as an animated glass card with:
 *  - 3D perspective-tilt on mouse hover (use3DTilt hook)
 *  - Genre-colour left-accent strip
 *  - Shimmer gradient border on hover
 *  - Staggered entrance fade-in animation
 */
export default function BookCard({ book, onDelete, index = 0 }: BookCardProps) {
  const { ref, handleMouseMove, handleMouseLeave } = use3DTilt(6);

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  const accentColor = book.genre ? genreHue(book.genre) : 'var(--color-accent-primary)';

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={`${styles.card}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        /* Stagger the entrance: each card appears 60ms after the previous */
        animationDelay: `${index * 60}ms`,
        /* Pass accent colour as a CSS variable for the left strip + glow */
        ['--accent' as string]: accentColor,
      }}
    >
      {/* Animated gradient shimmer border (pseudo-element in CSS) */}
      <div className={styles.shimmerBorder} aria-hidden />

      {/* Left genre colour strip */}
      <div className={styles.accentStrip} aria-hidden />

      {/* Top row: genre badge + actions */}
      <div className={styles.topRow}>
        {book.genre ? (
          <span className={styles.genreBadge} style={{ color: accentColor, borderColor: accentColor }}>
            {book.genre}
          </span>
        ) : (
          <span />
        )}

        <div className={styles.actions}>
          <Link
            to={`/books/${book.id}/edit`}
            className={`btn btn-secondary btn-sm ${styles.actionBtn}`}
            title="Edit book"
            id={`edit-book-${book.id}`}
          >
            <Edit2 size={16} />
          </Link>
          <button
            className={`btn btn-danger btn-sm ${styles.actionBtn}`}
            onClick={() => onDelete(book.id, book.title)}
            title="Delete book"
            id={`delete-book-${book.id}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Book icon with accent glow */}
      <div className={styles.iconWrap} style={{ color: accentColor }}>
        <BookOpen size={30} strokeWidth={1.5} />
      </div>

      {/* Title & Author */}
      <div className={styles.content}>
        <h2 className={styles.title}>
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h2>
        <p className={styles.author}>{book.author}</p>

        {book.description && (
          <p className={styles.description}>{truncate(book.description, 110)}</p>
        )}

        {/* Metadata chips */}
        <div className={styles.meta}>
          {book.publishedYear && (
            <span className={styles.metaChip}>
              <Calendar size={11} /> {book.publishedYear}
            </span>
          )}
          {book.isbn && (
            <span className={styles.metaChip}>
              <Hash size={11} /> {book.isbn.slice(-4)}
            </span>
          )}
        </div>
      </div>

      {/* View details CTA */}
      <Link to={`/books/${book.id}`} className={styles.viewCta}>
        View Details <ArrowRight size={13} />
      </Link>
    </article>
  );
}
