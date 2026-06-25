import api from './api';
import type {
  Book,
  BookQueryParams,
  CreateBookPayload,
  UpdateBookPayload,
  PagedResult,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Book API Service
// Typed wrapper functions around Axios calls to the backend REST API.
// Each function returns the response data directly, Axios handles errors.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of books with optional search and genre filter.
 * Corresponds to: GET /api/books?search=&genre=&page=&pageSize=
 */
export async function getBooks(params?: BookQueryParams): Promise<PagedResult<Book>> {
  const response = await api.get<PagedResult<Book>>('/books', { params });
  return response.data;
}

/**
 * Fetch a single book by its ID.
 * Corresponds to: GET /api/books/:id
 */
export async function getBookById(id: number): Promise<Book> {
  const response = await api.get<Book>(`/books/${id}`);
  return response.data;
}

/**
 * Create a new book record.
 * Corresponds to: POST /api/books
 */
export async function createBook(data: CreateBookPayload): Promise<Book> {
  const response = await api.post<Book>('/books', data);
  return response.data;
}

/**
 * Update an existing book record by ID.
 * Corresponds to: PUT /api/books/:id
 */
export async function updateBook(id: number, data: UpdateBookPayload): Promise<Book> {
  const response = await api.put<Book>(`/books/${id}`, data);
  return response.data;
}

/**
 * Delete a book record by ID.
 * Corresponds to: DELETE /api/books/:id
 * Returns 204 No Content — no response body.
 */
export async function deleteBook(id: number): Promise<void> {
  await api.delete(`/books/${id}`);
}

/**
 * Fetch all distinct genres available in the database.
 * Corresponds to: GET /api/books/genres
 */
export async function getGenres(): Promise<string[]> {
  const response = await api.get<string[]>('/books/genres');
  return response.data;
}
