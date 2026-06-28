using LibraryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Data
{
    /// <summary>
    /// EF Core DbContext for BookVault.
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
                },
                new Book
                {
                    Id = 4,
                    Title = "The Lord of the Rings",
                    Author = "J.R.R. Tolkien",
                    Description = "An epic high-fantasy novel that continues the story of the Ring.",
                    Genre = "Fantasy",
                    PublishedYear = 1954,
                    ISBN = "978-0544003415",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 5,
                    Title = "1984",
                    Author = "George Orwell",
                    Description = "A dystopian social science fiction novel and cautionary tale.",
                    Genre = "Sci-Fi",
                    PublishedYear = 1949,
                    ISBN = "978-0451524935",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 6,
                    Title = "Pride and Prejudice",
                    Author = "Jane Austen",
                    Description = "A romantic novel of manners following the character development of Elizabeth Bennet.",
                    Genre = "Romance",
                    PublishedYear = 1813,
                    ISBN = "978-0141439518",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 7,
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    Description = "A 1925 novel about the American Dream during the Roaring Twenties.",
                    Genre = "Fiction",
                    PublishedYear = 1925,
                    ISBN = "978-0743273565",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 8,
                    Title = "Dune",
                    Author = "Frank Herbert",
                    Description = "A sweeping science fiction epic of politics, religion, and the struggle for a desert planet.",
                    Genre = "Sci-Fi",
                    PublishedYear = 1965,
                    ISBN = "978-0441172719",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 9,
                    Title = "Steve Jobs",
                    Author = "Walter Isaacson",
                    Description = "The exclusive biography of Steve Jobs, based on more than forty interviews.",
                    Genre = "Biography",
                    PublishedYear = 2011,
                    ISBN = "978-1451648539",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 10,
                    Title = "Atomic Habits",
                    Author = "James Clear",
                    Description = "An easy and proven way to build good habits and break bad ones.",
                    Genre = "Self-Help",
                    PublishedYear = 2018,
                    ISBN = "978-0735211292",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 11,
                    Title = "The Alchemist",
                    Author = "Paulo Coelho",
                    Description = "A story about a shepherd boy searching for a treasure hidden near the Pyramids.",
                    Genre = "Fiction",
                    PublishedYear = 1988,
                    ISBN = "978-0062315007",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 12,
                    Title = "And Then There Were None",
                    Author = "Agatha Christie",
                    Description = "Ten strangers are lured to an isolated island and accused of murder.",
                    Genre = "Mystery",
                    PublishedYear = 1939,
                    ISBN = "978-0062073488",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 13,
                    Title = "Thinking, Fast and Slow",
                    Author = "Daniel Kahneman",
                    Description = "A deep dive into the two systems that drive the way we think.",
                    Genre = "Psychology",
                    PublishedYear = 2011,
                    ISBN = "978-0374533557",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 14,
                    Title = "The Catcher in the Rye",
                    Author = "J.D. Salinger",
                    Description = "A novel detailing two days in the life of 16-year-old Holden Caulfield.",
                    Genre = "Fiction",
                    PublishedYear = 1951,
                    ISBN = "978-0316769174",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 15,
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    Description = "A novel about the serious issues of rape and racial inequality.",
                    Genre = "Fiction",
                    PublishedYear = 1960,
                    ISBN = "978-0060935467",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 16,
                    Title = "Sapiens: A Brief History of Humankind",
                    Author = "Yuval Noah Harari",
                    Description = "Explores the history of the human species from the Stone Age up to the twenty-first century.",
                    Genre = "History",
                    PublishedYear = 2011,
                    ISBN = "978-0062316097",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
