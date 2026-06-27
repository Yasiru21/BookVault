import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, BookOpen, X, BookMarked, Users, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { getBooks, deleteBook, getGenres } from '../services/bookService';
import BookCard from '../components/BookCard';
import ConfirmModal from '../components/ConfirmModal';
import { BookCardSkeleton } from '../components/Loader';
import HeroBanner from '../components/HeroBanner';
import styles from './BookListPage.module.css';

/**
 * Home page — displays all book records in a responsive grid.
 * Features: search, genre filter, pagination, delete with confirmation.
 * Uses React Query for server state management with caching and background refetch.
 */
export default function BookListPage() {
  const queryClient = useQueryClient();

  // ── Filter & Pagination State ───────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  // ── Delete Modal State ──────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  // ── Debounce search input (waits 400ms after last keystroke) ────────────────
  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout((window as unknown as { searchTimer: ReturnType<typeof setTimeout> }).searchTimer);
    (window as unknown as { searchTimer: ReturnType<typeof setTimeout> }).searchTimer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1); // Reset to first page on new search
    }, 400);
  };

  // ── Genres Query — fetches distinct genre list ──────────────────────────────
  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
    staleTime: 5 * 60 * 1000, // Cache genres for 5 minutes
  });

  // ── Books Query — main data fetch ───────────────────────────────────────────
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['books', debouncedSearch, genre, page],
    queryFn: () => getBooks({ search: debouncedSearch, genre, page, pageSize: PAGE_SIZE }),
    placeholderData: (prev) => prev, // Keep stale data visible while refetching
  });

  // ── Delete Mutation ─────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: () => {
      // Invalidate and refetch the books list
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success(`"${deleteTarget?.title}" has been deleted.`);
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error('Failed to delete the book. Please try again.');
    },
  });

  const handleDeleteRequest = useCallback((id: number, title: string) => {
    setDeleteTarget({ id, title });
  }, []);

  const handleDeleteConfirm = () => {
    if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setGenre('');
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || genre;

  // ── Derived stats (unique authors & genres from current page) ───────────────
  const stats = useMemo(() => ({
    totalBooks: data?.totalCount ?? 0,
    totalAuthors: data ? new Set(data.items.map(b => b.author)).size : 0,
    totalGenres: genres.length,
  }), [data, genres]);

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* ── Hero Welcome Banner ── */}
        <HeroBanner />

        {/* ── Floating Background Orbs (decorative) ── */}
        <div className={styles.orb1} aria-hidden />
        <div className={styles.orb2} aria-hidden />
        <div className={styles.orb3} aria-hidden />

        {/* ── Page Header ── */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>
              <span className={styles.gradientText}>Library</span> Collection
            </h1>
            <p className={styles.pageSubtitle}>
              {data ? `${data.totalCount} book${data.totalCount !== 1 ? 's' : ''} in the library` : 'Loading…'}
            </p>
          </div>
          <Link to="/books/new" className="btn btn-primary" id="add-book-btn">
            <Plus size={16} /> Add Book
          </Link>
        </div>

        {/* ── Animated Stats Bar ── */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ '--stat-color': 'var(--color-accent-primary)' } as React.CSSProperties}>
              <BookMarked size={18} />
            </div>
            <div>
              <div className={styles.statValue}>{stats.totalBooks}</div>
              <div className={styles.statLabel}>Total Books</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ '--stat-color': '#10b981' } as React.CSSProperties}>
              <Users size={18} />
            </div>
            <div>
              <div className={styles.statValue}>{stats.totalAuthors}</div>
              <div className={styles.statLabel}>Authors</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ '--stat-color': '#f59e0b' } as React.CSSProperties}>
              <Layers size={18} />
            </div>
            <div>
              <div className={styles.statValue}>{stats.totalGenres}</div>
              <div className={styles.statLabel}>Genres</div>
            </div>
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className={`glass-card ${styles.filterBar}`}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by title or author…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={styles.searchInput}
              id="search-input"
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => handleSearchChange('')} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.filterWrap}>
            <Filter size={15} className={styles.filterIcon} />
            <select
              value={genre}
              onChange={(e) => { setGenre(e.target.value); setPage(1); }}
              className={styles.genreSelect}
              id="genre-filter"
            >
              <option value="">All Genres</option>
              {genres.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {hasActiveFilters && (
            <button className={`btn btn-secondary btn-sm ${styles.clearFilters}`} onClick={clearFilters}>
              <X size={13} /> Clear
            </button>
          )}
        </div>

        {/* ── Genre Quick-Filter Pills ── */}
        {genres.length > 0 && (
          <div className={styles.genrePills}>
            <button
              className={`${styles.genrePill} ${!genre ? styles.genrePillActive : ''}`}
              onClick={() => { setGenre(''); setPage(1); }}
            >All</button>
            {genres.map(g => (
              <button
                key={g}
                className={`${styles.genrePill} ${genre === g ? styles.genrePillActive : ''}`}
                onClick={() => { setGenre(g); setPage(1); }}
              >{g}</button>
            ))}
          </div>
        )}

        {/* ── Error State ── */}
        {isError && (
          <div className={styles.errorBox}>
            <p>⚠ Failed to load books: {(error as Error).message}</p>
            <p className={styles.errorHint}>Make sure the backend API is running at http://localhost:5000</p>
          </div>
        )}

        {/* ── Book Grid ── */}
        {isLoading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : data?.items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><BookOpen size={48} strokeWidth={1} /></div>
            <h2 className={styles.emptyTitle}>No books found</h2>
            <p className={styles.emptyText}>
              {hasActiveFilters
                ? 'No books match your search. Try different keywords.'
                : 'The library is empty. Add your first book!'}
            </p>
            {hasActiveFilters ? (
              <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
            ) : (
              <Link to="/books/new" className="btn btn-primary">
                <Plus size={15} /> Add First Book
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {data?.items.map((book, i) => (
              <BookCard
                key={book.id}
                book={book}
                onDelete={handleDeleteRequest}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {data && data.totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              id="prev-page-btn"
            >
              ← Previous
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`${styles.pageNum} ${p === page ? styles.pageNumActive : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              id="next-page-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Book"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
