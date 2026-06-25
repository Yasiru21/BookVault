using LibraryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Data
{
    /// <summary>
    /// EF Core DbContext for the Library Management System.
    /// Manages database connections, entity configurations, and migrations.
    /// SQLite is used as the database engine for portability and simplicity.
    /// </summary>
    public class LibraryDbContext : DbContext
    {
        /// <summary>Initializes the context with injected options (from DI container).</summary>
        public LibraryDbContext(DbContextOptions<LibraryDbContext> options) : base(options) { }

        /// <summary>Table for book records.</summary>
        public DbSet<Book> Books { get; set; }

        /// <summary>Table for user accounts.</summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Configures entity relationships, indexes, and constraints using Fluent API.
        /// This runs once when EF Core builds the model.
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Book entity configuration ──────────────────────────────────
            modelBuilder.Entity<Book>(entity =>
            {
                // Composite index for fast search by title and author
                entity.HasIndex(b => b.Title);
                entity.HasIndex(b => b.Author);
                // Optional unique index on ISBN (when provided)
                entity.HasIndex(b => b.ISBN).IsUnique().HasFilter("[ISBN] IS NOT NULL");
            });

            // ── User entity configuration ──────────────────────────────────
            modelBuilder.Entity<User>(entity =>
            {
                // Unique email and username constraints
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.Username).IsUnique();
            });

            // ── Seed data — sample books for demo/testing ─────────────────
            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    Id = 1,
                    Title = "Clean Code",
                    Author = "Robert C. Martin",
                    Description = "A handbook of agile software craftsmanship. Teaches how to write readable, maintainable code.",
                    Genre = "Technology",
                    PublishedYear = 2008,
                    ISBN = "978-0132350884",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 2,
                    Title = "The Pragmatic Programmer",
                    Author = "Andrew Hunt & David Thomas",
                    Description = "From journeyman to master — a guide to career-long software craftsmanship.",
                    Genre = "Technology",
                    PublishedYear = 1999,
                    ISBN = "978-0135957059",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 3,
                    Title = "Design Patterns",
                    Author = "Gang of Four",
                    Description = "Elements of reusable object-oriented software. The classic reference for software design patterns.",
                    Genre = "Technology",
                    PublishedYear = 1994,
                    ISBN = "978-0201633610",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
