using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTOs
{
    // ─────────────────────────────────────────────────────────────
    // Response DTO — what the API returns for a single book
    // ─────────────────────────────────────────────────────────────

    /// <summary>
    /// Data Transfer Object returned by the API for book records.
    /// Keeps the API contract separate from the database model.
    /// </summary>
    public class BookResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ISBN { get; set; }
        public string? Genre { get; set; }
        public int? PublishedYear { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // ─────────────────────────────────────────────────────────────
    // Request DTO — for creating a new book (POST /api/books)
    // ─────────────────────────────────────────────────────────────

    /// <summary>
    /// Payload expected when creating a new book record.
    /// DataAnnotations drive both model validation and Swagger schema.
    /// </summary>
    public class CreateBookDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Author is required.")]
        [MaxLength(150, ErrorMessage = "Author name cannot exceed 150 characters.")]
        public string Author { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        public string Description { get; set; } = string.Empty;

        [MaxLength(20, ErrorMessage = "ISBN cannot exceed 20 characters.")]
        public string? ISBN { get; set; }

        [MaxLength(100, ErrorMessage = "Genre cannot exceed 100 characters.")]
        public string? Genre { get; set; }

        [Range(1000, 2100, ErrorMessage = "Published year must be between 1000 and 2100.")]
        public int? PublishedYear { get; set; }
    }

    // ─────────────────────────────────────────────────────────────
    // Request DTO — for updating an existing book (PUT /api/books/{id})
    // ─────────────────────────────────────────────────────────────

    /// <summary>
    /// Payload expected when updating an existing book record.
    /// All fields are optional — only provided fields will be updated.
    /// </summary>
    public class UpdateBookDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Author is required.")]
        [MaxLength(150, ErrorMessage = "Author name cannot exceed 150 characters.")]
        public string Author { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        public string Description { get; set; } = string.Empty;

        [MaxLength(20, ErrorMessage = "ISBN cannot exceed 20 characters.")]
        public string? ISBN { get; set; }

        [MaxLength(100, ErrorMessage = "Genre cannot exceed 100 characters.")]
        public string? Genre { get; set; }

        [Range(1000, 2100, ErrorMessage = "Published year must be between 1000 and 2100.")]
        public int? PublishedYear { get; set; }
    }

    // ─────────────────────────────────────────────────────────────
    // Generic paginated list wrapper
    // ─────────────────────────────────────────────────────────────

    /// <summary>
    /// Wraps a list of items with pagination metadata.
    /// </summary>
    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = [];
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}
