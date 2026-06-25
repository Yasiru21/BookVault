using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models
{
    /// <summary>
    /// Represents a registered user in the library system.
    /// Passwords are stored as BCrypt hashes — never in plain text.
    /// </summary>
    public class User
    {
        /// <summary>Primary key — auto-incremented by EF Core.</summary>
        public int Id { get; set; }

        /// <summary>Unique username chosen by the user.</summary>
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        /// <summary>Unique email address of the user.</summary>
        [Required]
        [MaxLength(200)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        /// <summary>BCrypt-hashed password — never the raw password.</summary>
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>Role of the user (e.g., "Admin", "User").</summary>
        [MaxLength(20)]
        public string Role { get; set; } = "User";

        /// <summary>UTC timestamp when the account was created.</summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
