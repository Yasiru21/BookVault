import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import type { CreateBookPayload, Book } from '../types';
import styles from './BookForm.module.css';

interface BookFormProps {
  /** If provided, the form is in "edit" mode and pre-fills with this book's data. */
  initialData?: Book;
  onSubmit: (data: CreateBookPayload) => Promise<void>;
  isSubmitting: boolean;
}

/** Available genre options for the select dropdown */
const GENRES = [
  'Fiction', 'Non-Fiction', 'Science', 'Technology',
  'History', 'Biography', 'Philosophy', 'Art & Design',
  'Business', 'Self-Help', 'Travel', 'Other',
];

/**
 * Shared book form used for both CREATE and EDIT operations.
 * Uses React Hook Form for validation and state management.
 * Supports pre-filling fields when editing an existing book.
 */
export default function BookForm({ initialData, onSubmit, isSubmitting }: BookFormProps) {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBookPayload>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          author: initialData.author,
          description: initialData.description ?? '',
          isbn: initialData.isbn ?? '',
          genre: initialData.genre ?? '',
          publishedYear: initialData.publishedYear,
        }
      : {},
  });

  const currentYear = new Date().getFullYear();

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Form Header */}
      <div className={styles.formHeader}>
        <div className={styles.formIcon}>
          <BookOpen size={24} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className={styles.formTitle}>
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h1>
          <p className={styles.formSubtitle}>
            {isEditing
              ? 'Update the details of this book record.'
              : 'Fill in the details to add a new book to the library.'}
          </p>
        </div>
      </div>

      <div className={styles.divider} />

      {/* ── Field Grid ── */}
      <div className={styles.fieldGrid}>

        {/* Title — Required */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="title" className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Clean Code"
            className={`form-input ${errors.title ? 'error' : ''}`}
            {...register('title', {
              required: 'Title is required.',
              maxLength: { value: 200, message: 'Title must be 200 characters or fewer.' },
            })}
          />
          {errors.title && (
            <span className="form-error" role="alert">⚠ {errors.title.message}</span>
          )}
        </div>

        {/* Author — Required */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="author" className="form-label">
            Author <span className="required">*</span>
          </label>
          <input
            id="author"
            type="text"
            placeholder="e.g. Robert C. Martin"
            className={`form-input ${errors.author ? 'error' : ''}`}
            {...register('author', {
              required: 'Author is required.',
              maxLength: { value: 150, message: 'Author must be 150 characters or fewer.' },
            })}
          />
          {errors.author && (
            <span className="form-error" role="alert">⚠ {errors.author.message}</span>
          )}
        </div>

        {/* Description — Optional */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            placeholder="A brief synopsis or description of the book…"
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            {...register('description', {
              maxLength: { value: 2000, message: 'Description must be 2000 characters or fewer.' },
            })}
          />
          {errors.description && (
            <span className="form-error" role="alert">⚠ {errors.description.message}</span>
          )}
        </div>

        {/* Genre — Optional select */}
        <div className="form-group">
          <label htmlFor="genre" className="form-label">Genre</label>
          <select id="genre" className="form-select" {...register('genre')}>
            <option value="">Select a genre…</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Published Year — Optional */}
        <div className="form-group">
          <label htmlFor="publishedYear" className="form-label">Published Year</label>
          <input
            id="publishedYear"
            type="number"
            placeholder={`e.g. ${currentYear}`}
            className={`form-input ${errors.publishedYear ? 'error' : ''}`}
            {...register('publishedYear', {
              valueAsNumber: true,
              min: { value: 1000, message: 'Year must be after 1000.' },
              max: { value: 2100, message: 'Year must be before 2100.' },
            })}
          />
          {errors.publishedYear && (
            <span className="form-error" role="alert">⚠ {errors.publishedYear.message}</span>
          )}
        </div>

        {/* ISBN — Optional */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="isbn" className="form-label">ISBN</label>
          <input
            id="isbn"
            type="text"
            placeholder="e.g. 978-0132350884"
            className={`form-input ${errors.isbn ? 'error' : ''}`}
            {...register('isbn', {
              maxLength: { value: 20, message: 'ISBN must be 20 characters or fewer.' },
            })}
          />
          {errors.isbn && (
            <span className="form-error" role="alert">⚠ {errors.isbn.message}</span>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className={styles.formActions}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          <ArrowLeft size={15} /> Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          id="submit-book-btn"
        >
          <Save size={15} />
          {isSubmitting
            ? isEditing ? 'Saving…' : 'Creating…'
            : isEditing ? 'Save Changes' : 'Create Book'}
        </button>
      </div>
    </form>
  );
}
