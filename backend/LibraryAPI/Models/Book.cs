using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models
{
    /// <summary>
    /// Represents a book record in the library system.
    /// </summary>
    public class Book
    {
        /// <summary>Primary key — auto-incremented by EF Core.</summary>
        public int Id { get; set; }

        /// <summary>Title of the book. Required, max 200 characters.</summary>
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        /// <summary>Author of the book. Required, max 150 characters.</summary>
        [Required]
        [MaxLength(150)]
        public string Author { get; set; } = string.Empty;

        /// <summary>Description or synopsis of the book. Required.</summary>
        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        /// <summary>ISBN number (optional). Must be unique if provided.</summary>
        [MaxLength(20)]
        public string? ISBN { get; set; }

        /// <summary>Genre/category of the book (e.g., Fiction, Science).</summary>
        [MaxLength(100)]
        public string? Genre { get; set; }

        /// <summary>Year the book was published.</summary>
        public int? PublishedYear { get; set; }

        /// <summary>UTC timestamp when the record was created.</summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>UTC timestamp when the record was last updated.</summary>
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
