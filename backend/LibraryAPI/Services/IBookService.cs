using LibraryAPI.DTOs;

namespace LibraryAPI.Services
{
    /// <summary>
    /// Defines the contract for book-related business logic operations.
    /// Using an interface allows for easy unit testing via mocking.
    /// </summary>
    public interface IBookService
    {
        /// <summary>Retrieves a paginated, optionally filtered list of books.</summary>
        /// <param name="search">Optional search term matched against title or author.</param>
        /// <param name="genre">Optional genre filter.</param>
        /// <param name="page">1-based page number.</param>
        /// <param name="pageSize">Number of results per page.</param>
        Task<PagedResult<BookResponseDto>> GetAllBooksAsync(
            string? search, string? genre, int page, int pageSize);

        /// <summary>Retrieves a single book by its primary key ID.</summary>
        Task<BookResponseDto?> GetBookByIdAsync(int id);

        /// <summary>Creates a new book record and returns the created entity.</summary>
        Task<BookResponseDto> CreateBookAsync(CreateBookDto dto);

        /// <summary>Updates an existing book. Returns null if book not found.</summary>
        Task<BookResponseDto?> UpdateBookAsync(int id, UpdateBookDto dto);

        /// <summary>Deletes a book by ID. Returns false if not found.</summary>
        Task<bool> DeleteBookAsync(int id);

        /// <summary>Returns all distinct genres from the database.</summary>
        Task<IEnumerable<string>> GetGenresAsync();
    }
}
