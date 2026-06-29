import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createBook } from '../services/bookService';
import BookForm from '../components/BookForm';
import type { CreateBookPayload } from '../types';
import styles from './FormPage.module.css';

/**
 * Page for creating a new book record.
 * On success, invalidates the book list cache and navigates back to home.
 */
export default function AddBookPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: (newBook) => {
      // Invalidate the books list so it refetches with the new entry
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success(`"${newBook.title}" has been added to the library!`);
      navigate('/');
    },
    onError: (err: unknown) => {
      // Extract error message from the Axios error response
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Failed to create book. Please try again.';
      toast.error(message);
    },
  });

  const handleSubmit = async (data: CreateBookPayload) => {
    // Convert empty strings to undefined for optional fields
    const payload: CreateBookPayload = {
      title: data.title,
      author: data.author,
      description: data.description,          // required — always provided
      isbn: data.isbn || undefined,
      genre: data.genre || undefined,
      publishedYear: data.publishedYear || undefined,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className={styles.formContainer}>
          <div className={`glass-card ${styles.formCard} animate-fade-in`}>
            <BookForm
              onSubmit={handleSubmit}
              isSubmitting={mutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
