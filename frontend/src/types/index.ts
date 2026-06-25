// ─────────────────────────────────────────────────────────────────────────────
// TypeScript Type Definitions
// Mirrors the C# DTOs from the backend — keeps the full-stack contract in sync
// ─────────────────────────────────────────────────────────────────────────────

/** Represents a single book record returned by the API */
export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  genre?: string;
  publishedYear?: number;
  createdAt: string;   // ISO 8601 date string from the API
  updatedAt: string;
}

/** Payload for creating a new book (POST /api/books) */
export interface CreateBookPayload {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  genre?: string;
  publishedYear?: number;
}

/** Payload for updating a book (PUT /api/books/:id) */
export interface UpdateBookPayload {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  genre?: string;
  publishedYear?: number;
}

/** Paginated result wrapper returned by GET /api/books */
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Query parameters for the book list endpoint */
export interface BookQueryParams {
  search?: string;
  genre?: string;
  page?: number;
  pageSize?: number;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

/** Payload for POST /api/auth/register */
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

/** Payload for POST /api/auth/login */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Response from login/register — contains JWT token */
export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  expiresAt: string;
}

/** Current user stored in React context */
export interface User {
  username: string;
  email: string;
  role: string;
  token: string;
}

// ─── API Error Shape ──────────────────────────────────────────────────────────

/** Standard error response structure from the API */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
