import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getBookById, updateBook } from '../services/bookService';
import BookForm from '../components/BookForm';
import Loader from '../components/Loader';
import type { UpdateBookPayload } from '../types';
import styles from './FormPage.module.css';

/**
 * Page for editing an existing book record.
 * Fetches the current book data first to pre-fill the form.
 * On save, updates the book and invalidates related queries.
 */
export default function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = parseInt(id ?? '0', 10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Fetch existing book data to pre-populate the form ──────────────────────
  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookById(bookId),
    enabled: bookId > 0, // Skip if ID is invalid
  });

  // ── Update mutation ─────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (data: UpdateBookPayload) => updateBook(bookId, data),
    onSuccess: (updatedBook) => {
      // Invalidate both the list and the individual book detail cache
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      toast.success(`"${updatedBook.title}" has been updated!`);
      navigate('/');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Failed to update book. Please try again.';
      toast.error(message);
    },
  });

  const handleSubmit = async (data: UpdateBookPayload) => {
    const payload: UpdateBookPayload = {
      title: data.title,
      author: data.author,
      description: data.description,      // no longer undefined
      isbn: data.isbn || undefined,
      genre: data.genre || undefined,
      publishedYear: data.publishedYear || undefined,
    };
    mutation.mutate(payload);
  };

  if (isLoading) return <Loader fullPage message="Loading book details…" />;

  if (isError || !book) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className={styles.errorState}>
            <h2>Book not found</h2>
            <p>The book you're trying to edit doesn't exist or has been deleted.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Back to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className={styles.formContainer}>
          <div className={`glass-card ${styles.formCard} animate-fade-in`}>
            <BookForm
              initialData={book}
              onSubmit={handleSubmit}
              isSubmitting={mutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
