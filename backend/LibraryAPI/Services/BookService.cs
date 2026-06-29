using LibraryAPI.Data;
using LibraryAPI.DTOs;
using LibraryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Services
{
    /// <summary>
    /// Concrete implementation of IBookService.
    /// All database operations are async to avoid blocking the thread pool.
    /// The service receives the DbContext via constructor injection (DI).
    /// </summary>
    public class BookService(LibraryDbContext context) : IBookService
    {
        private readonly LibraryDbContext _context = context;

        // ─────────────────────────────────────────────────────────────────────
        // GET ALL — with optional search and pagination
        // ─────────────────────────────────────────────────────────────────────

        /// <inheritdoc/>
        public async Task<PagedResult<BookResponseDto>> GetAllBooksAsync(
            string? search, string? genre, int page, int pageSize)
        {
            // Start with the full books queryable (deferred execution — no DB call yet)
            IQueryable<Book> query = _context.Books.AsNoTracking();

            // Apply search filter — case-insensitive substring match on title or author
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(b =>
                    b.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    b.Author.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            // Apply genre filter
            if (!string.IsNullOrWhiteSpace(genre))
            {
                query = query.Where(b => b.Genre == genre);
            }

            // Count total matches (for pagination metadata)
            int totalCount = await query.CountAsync();

            // Apply ordering and pagination — OrderBy must precede Skip/Take
            List<Book> books = await query
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<BookResponseDto>
            {
                Items = books.Select(MapToResponseDto),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET BY ID
        // ─────────────────────────────────────────────────────────────────────

        /// <inheritdoc/>
        public async Task<BookResponseDto?> GetBookByIdAsync(int id)
        {
            // FindAsync uses the primary key index — most efficient lookup
            Book? book = await _context.Books.FindAsync(id);
            return book is null ? null : MapToResponseDto(book);
        }

        // ─────────────────────────────────────────────────────────────────────
        // CREATE
        // ─────────────────────────────────────────────────────────────────────

        /// <inheritdoc/>
        public async Task<BookResponseDto> CreateBookAsync(CreateBookDto dto)
        {
            var book = new Book
            {
                Title = dto.Title.Trim(),
                Author = dto.Author.Trim(),
                Description = dto.Description.Trim(),
                ISBN = dto.ISBN?.Trim(),
                Genre = dto.Genre?.Trim(),
                PublishedYear = dto.PublishedYear,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync(); // Persists to SQLite and populates book.Id

            return MapToResponseDto(book);
        }

        // ─────────────────────────────────────────────────────────────────────
        // UPDATE
        // ─────────────────────────────────────────────────────────────────────

        /// <inheritdoc/>
        public async Task<BookResponseDto?> UpdateBookAsync(int id, UpdateBookDto dto)
        {
            Book? book = await _context.Books.FindAsync(id);
            if (book is null) return null;

            // Only update the fields that were provided
            book.Title = dto.Title.Trim();
            book.Author = dto.Author.Trim();
            book.Description = dto.Description.Trim();
            book.ISBN = dto.ISBN?.Trim();
            book.Genre = dto.Genre?.Trim();
            book.PublishedYear = dto.PublishedYear;
            book.UpdatedAt = DateTime.UtcNow; // Always refresh the timestamp

            await _context.SaveChangesAsync();
            return MapToResponseDto(book);
        }

        // ─────────────────────────────────────────────────────────────────────
        // DELETE
        // ─────────────────────────────────────────────────────────────────────

        /// <inheritdoc/>
        public async Task<bool> DeleteBookAsync(int id)
        {
            Book? book = await _context.Books.FindAsync(id);
            if (book is null) return false;

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return true;
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET GENRES
        // ─────────────────────────────────────────────────────────────────────

        /// <inheritdoc/>
        public async Task<IEnumerable<string>> GetGenresAsync()
        {
            return await _context.Books
                .AsNoTracking()
                .Where(b => b.Genre != null)
                .Select(b => b.Genre!)
                .Distinct()
                .OrderBy(g => g)
                .ToListAsync();
        }

        // ─────────────────────────────────────────────────────────────────────
        // PRIVATE MAPPER — Book entity → BookResponseDto
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Maps a Book entity to a BookResponseDto.
        /// Keeping this as a private method avoids code duplication across CRUD methods.
        /// </summary>
        private static BookResponseDto MapToResponseDto(Book book) => new()
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            Description = book.Description,
            ISBN = book.ISBN,
            Genre = book.Genre,
            PublishedYear = book.PublishedYear,
            CreatedAt = book.CreatedAt,
            UpdatedAt = book.UpdatedAt
        };
    }
}
