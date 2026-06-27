import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2, Trash2, ArrowLeft, BookOpen, Calendar, Hash, Tag, Clock, Share2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getBookById, deleteBook } from '../services/bookService';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import styles from './BookDetailPage.module.css';

/**
 * Estimates reading time based on an average book length.
 * Uses published year to interpolate: older books tend to be shorter.
 */
function estimateReadingTime(year?: number): string {
  const base = year && year < 1950 ? 65000 : year && year < 2000 ? 75000 : 85000;
  const minutes = Math.round(base / 250); // 250 words/minute average
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `~${hours}h ${mins}m`;
}

function bookAgeLabel(year?: number): string {
  if (!year) return '';
  const age = new Date().getFullYear() - year;
  if (age === 0) return 'Published this year';
  if (age === 1) return 'Published 1 year ago';
  return `Published ${age} years ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

/**
 * Full detail view for a single book record.
 * Displays all fields, estimated reading time, book age,
 * and provides edit, delete and share actions.
 */
export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = parseInt(id ?? '0', 10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Fetch book by ID ──────────────────────────────────────────────────────
  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookById(bookId),
    enabled: bookId > 0,
  });

  // ── Delete mutation ───────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: () => deleteBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success(`"${book?.title}" has been deleted.`);
      navigate('/');
    },
    onError: () => toast.error('Failed to delete book. Please try again.'),
  });

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link.');
    }
  };

  if (isLoading) return <Loader fullPage message="Loading book details…" />;

  if (isError || !book) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className={styles.notFound}>
            <BookOpen size={48} strokeWidth={1} />
            <h2>Book Not Found</h2>
            <p>This book doesn't exist or may have been deleted.</p>
            <Link to="/" className="btn btn-primary">← Back to Library</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={15} /> All Books
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{book.title}</span>
        </div>

        <div className={styles.layout}>
          {/* ── Main Detail Card ─────────────────────────────────────────── */}
          <div className={`glass-card ${styles.detailCard} animate-fade-in`}>
            {/* Header Row */}
            <div className={styles.cardHeader}>
              <div className={styles.bookIcon}>
                <BookOpen size={36} strokeWidth={1.5} />
              </div>
              <div className={styles.titleGroup}>
                {book.genre && (
                  <span className="badge badge-violet">{book.genre}</span>
                )}
                <h1 className={styles.title}>{book.title}</h1>
                <p className={styles.author}>by {book.author}</p>
              </div>
              {/* Actions */}
              <div className={styles.actionGroup}>
                <button
                  className={`btn btn-secondary ${styles.shareBtn}`}
                  onClick={handleShare}
                  title="Copy link"
                >
                  {copied ? <CheckCircle size={15} /> : <Share2 size={15} />}
                  {copied ? 'Copied!' : 'Share'}
                </button>
                <Link
                  to={`/books/${book.id}/edit`}
                  className="btn btn-secondary"
                  id={`edit-book-detail-${book.id}`}
                >
                  <Edit2 size={15} /> Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                  id={`delete-book-detail-${book.id}`}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>

            <div className={styles.divider} />

            {/* Body */}
            <div className={styles.cardBody}>
              {/* Description */}
              {book.description ? (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>About this Book</h2>
                  <p className={styles.description}>{book.description}</p>
                </div>
              ) : (
                <p className={styles.noDescription}>No description available for this book.</p>
              )}

              {/* Metadata grid */}
              <div className={styles.metaGrid}>
                {book.isbn && (
                  <div className={styles.metaItem}>
                    <div className={styles.metaIcon}><Hash size={16} /></div>
                    <div>
                      <p className={styles.metaLabel}>ISBN</p>
                      <p className={styles.metaValue}>{book.isbn}</p>
                    </div>
                  </div>
                )}
                {book.publishedYear && (
                  <div className={styles.metaItem}>
                    <div className={styles.metaIcon}><Calendar size={16} /></div>
                    <div>
                      <p className={styles.metaLabel}>Published Year</p>
                      <p className={styles.metaValue}>{book.publishedYear}</p>
                    </div>
                  </div>
                )}
                {book.genre && (
                  <div className={styles.metaItem}>
                    <div className={styles.metaIcon}><Tag size={16} /></div>
                    <div>
                      <p className={styles.metaLabel}>Genre</p>
                      <p className={styles.metaValue}>{book.genre}</p>
                    </div>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <div className={styles.metaIcon}><Clock size={16} /></div>
                  <div>
                    <p className={styles.metaLabel}>Est. Reading Time</p>
                    <p className={styles.metaValue}>{estimateReadingTime(book.publishedYear)}</p>
                  </div>
                </div>
                <div className={styles.metaItem}>
                  <div className={styles.metaIcon}><Calendar size={16} /></div>
                  <div>
                    <p className={styles.metaLabel}>Added On</p>
                    <p className={styles.metaValue}>{formatDate(book.createdAt)}</p>
                  </div>
                </div>
                <div className={styles.metaItem}>
                  <div className={styles.metaIcon}><Calendar size={16} /></div>
                  <div>
                    <p className={styles.metaLabel}>Last Updated</p>
                    <p className={styles.metaValue}>{formatDate(book.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className={styles.sidebar}>

            {/* Quick Facts */}
            <div className={`glass-card ${styles.sideCard}`}>
              <h3 className={styles.sideTitle}>Quick Facts</h3>
              <ul className={styles.factList}>
                {book.publishedYear && (
                  <li className={styles.factItem}>
                    <span className={styles.factLabel}>📅 Age</span>
                    <span className={styles.factValue}>{bookAgeLabel(book.publishedYear)}</span>
                  </li>
                )}
                <li className={styles.factItem}>
                  <span className={styles.factLabel}>⏱️ Read time</span>
                  <span className={styles.factValue}>{estimateReadingTime(book.publishedYear)}</span>
                </li>
                {book.genre && (
                  <li className={styles.factItem}>
                    <span className={styles.factLabel}>🏷️ Category</span>
                    <span className={styles.factValue}>{book.genre}</span>
                  </li>
                )}
                {book.isbn && (
                  <li className={styles.factItem}>
                    <span className={styles.factLabel}>📋 ISBN</span>
                    <span className={styles.factValue}>{book.isbn}</span>
                  </li>
                )}
                <li className={styles.factItem}>
                  <span className={styles.factLabel}>✍️ Author</span>
                  <span className={styles.factValue}>{book.author}</span>
                </li>
              </ul>
            </div>

            {/* Catalogue Actions */}
            <div className={`glass-card ${styles.sideCard}`}>
              <h3 className={styles.sideTitle}>Catalogue Actions</h3>
              <div className={styles.actionStack}>
                <Link to={`/books/${book.id}/edit`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Edit2 size={14} /> Edit Record
                </Link>
                <Link to="/books/new" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <BookOpen size={14} /> Add Another Book
                </Link>
                <Link to="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <ArrowLeft size={14} /> Back to Catalog
                </Link>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Book"
        message={`Are you sure you want to permanently delete "${book.title}"? This action cannot be undone.`}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
