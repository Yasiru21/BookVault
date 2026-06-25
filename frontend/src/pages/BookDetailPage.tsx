import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2, Trash2, ArrowLeft, BookOpen, Calendar, Hash, Tag } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getBookById, deleteBook } from '../services/bookService';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import styles from './BookDetailPage.module.css';

/**
 * Full detail view for a single book record.
 * Displays all fields and provides edit and delete actions.
 */
export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = parseInt(id ?? '0', 10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ── Fetch book by ID ────────────────────────────────────────────────────────
  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookById(bookId),
    enabled: bookId > 0,
  });

  // ── Delete mutation ─────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: () => deleteBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success(`"${book?.title}" has been deleted.`);
      navigate('/');
    },
    onError: () => toast.error('Failed to delete book. Please try again.'),
  });

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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

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

        {/* Book Detail Card */}
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
                <h2 className={styles.sectionTitle}>Description</h2>
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
