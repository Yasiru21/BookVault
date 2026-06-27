using LibraryAPI.DTOs;
using LibraryAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryAPI.Controllers
{
    /// <summary>
    /// RESTful API controller for Book CRUD operations.
    /// Base route: /api/books
    ///
    /// Endpoints:
    ///   GET    /api/books          — List all books (with search/filter/pagination)
    ///   GET    /api/books/{id}     — Get a single book by ID
    ///   GET    /api/books/genres   — Get all unique genres
    ///   POST   /api/books          — Create a new book
    ///   PUT    /api/books/{id}     — Update an existing book
    ///   DELETE /api/books/{id}     — Delete a book
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly ILogger<BooksController> _logger;

        /// <summary>Constructor injection of BookService and logger.</summary>
        public BooksController(IBookService bookService, ILogger<BooksController> logger)
        {
            _bookService = bookService;
            _logger = logger;
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET /api/books
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Retrieves a paginated list of all books with optional search and genre filter.
        /// </summary>
        /// <param name="search">Optional search term (matches title or author).</param>
        /// <param name="genre">Optional genre filter.</param>
        /// <param name="page">Page number (default: 1).</param>
        /// <param name="pageSize">Items per page (default: 10, max: 100).</param>
        /// <returns>A paged result containing matching books.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(PagedResult<BookResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PagedResult<BookResponseDto>>> GetBooks(
            [FromQuery] string? search,
            [FromQuery] string? genre,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            // Clamp pageSize to reasonable limits
            pageSize = Math.Clamp(pageSize, 1, 100);
            page = Math.Max(1, page);

            _logger.LogInformation("Fetching books | search={Search} genre={Genre} page={Page}", search, genre, page);

            var result = await _bookService.GetAllBooksAsync(search, genre, page, pageSize);
            return Ok(result);
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET /api/books/genres
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>Returns a distinct list of all genres available in the database.</summary>
        [HttpGet("genres")]
        [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<string>>> GetGenres()
        {
            var genres = await _bookService.GetGenresAsync();
            return Ok(genres);
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET /api/books/{id}
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>Retrieves a single book by its unique ID.</summary>
        /// <param name="id">The integer primary key of the book.</param>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(BookResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BookResponseDto>> GetBook(int id)
        {
            _logger.LogInformation("Fetching book ID={Id}", id);

            var book = await _bookService.GetBookByIdAsync(id);
            if (book is null)
            {
                _logger.LogWarning("Book ID={Id} not found", id);
                return NotFound(new { message = $"Book with ID {id} was not found." });
            }

            return Ok(book);
        }

        // ─────────────────────────────────────────────────────────────────────
        // POST /api/books
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Creates a new book record in the database.
        /// Returns 201 Created with the Location header pointing to the new resource.
        /// </summary>
        /// <param name="dto">Book creation payload with title, author, and optional fields.</param>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(BookResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<BookResponseDto>> CreateBook([FromBody] CreateBookDto dto)
        {
            // ModelState validation is handled automatically by [ApiController] attribute
            _logger.LogInformation("Creating book | Title={Title} Author={Author}", dto.Title, dto.Author);

            var created = await _bookService.CreateBookAsync(dto);

            // 201 Created with Location header: /api/books/{id}
            return CreatedAtAction(nameof(GetBook), new { id = created.Id }, created);
        }

        // ─────────────────────────────────────────────────────────────────────
        // PUT /api/books/{id}
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Updates all fields of an existing book record.
        /// Returns 404 if the book does not exist.
        /// </summary>
        /// <param name="id">The ID of the book to update.</param>
        /// <param name="dto">Updated book data.</param>
        [HttpPut("{id:int}")]
        [Authorize]
        [ProducesResponseType(typeof(BookResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<BookResponseDto>> UpdateBook(int id, [FromBody] UpdateBookDto dto)
        {
            _logger.LogInformation("Updating book ID={Id}", id);

            var updated = await _bookService.UpdateBookAsync(id, dto);
            if (updated is null)
            {
                return NotFound(new { message = $"Book with ID {id} was not found." });
            }

            return Ok(updated);
        }

        // ─────────────────────────────────────────────────────────────────────
        // DELETE /api/books/{id}
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Permanently deletes a book record by ID.
        /// Returns 204 No Content on success, 404 if not found.
        /// </summary>
        /// <param name="id">The ID of the book to delete.</param>
        [HttpDelete("{id:int}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> DeleteBook(int id)
        {
            _logger.LogInformation("Deleting book ID={Id}", id);

            bool deleted = await _bookService.DeleteBookAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = $"Book with ID {id} was not found." });
            }

            return NoContent(); // 204 — success with no response body
        }
    }
}
