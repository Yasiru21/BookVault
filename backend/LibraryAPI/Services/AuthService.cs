using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LibraryAPI.Data;
using LibraryAPI.DTOs;
using LibraryAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace LibraryAPI.Services
{
    /// <summary>
    /// Handles user registration, login, and JWT token generation.
    /// Passwords are NEVER stored in plain text — BCrypt hashing is used.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly LibraryDbContext _context;
        private readonly IConfiguration _config;

        /// <summary>Injects DbContext and configuration for JWT settings.</summary>
        public AuthService(LibraryDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // ─────────────────────────────────────────────────────────────────────
        // REGISTER
        // ─────────────────────────────────────────────────────────────────────

        /// <inheritdoc/>
        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
        {
            // Check for duplicate email or username
            bool exists = await _context.Users.AnyAsync(u =>
                u.Email == dto.Email || u.Username == dto.Username);

            if (exists) return null; // Caller will convert this to 409 Conflict

            var user = new User
            {
                Username = dto.Username.Trim(),
                Email = dto.Email.Trim().ToLower(),
                // BCrypt automatically generates a salt — work factor 12 is secure and fast enough
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, workFactor: 12),
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return GenerateAuthResponse(user);
        }

        // ─────────────────────────────────────────────────────────────────────
        // LOGIN
        // ─────────────────────────────────────────────────────────────────────

        /// <inheritdoc/>
        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            // Find user by email (case-insensitive)
            User? user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower());

            if (user is null) return null;

            // Verify password against stored BCrypt hash
            bool passwordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!passwordValid) return null;

            return GenerateAuthResponse(user);
        }

        // ─────────────────────────────────────────────────────────────────────
        // JWT GENERATION
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Generates a signed JWT token for the authenticated user.
        /// The token carries the user's ID, username, email, and role as claims.
        /// </summary>
        private AuthResponseDto GenerateAuthResponse(User user)
        {
            string jwtKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured.");
            string jwtIssuer = _config["Jwt:Issuer"] ?? "LibraryAPI";
            string jwtAudience = _config["Jwt:Audience"] ?? "LibraryClient";
            DateTime expiresAt = DateTime.UtcNow.AddHours(24);

            // Claims embedded in the token payload
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique token ID
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials
            );

            return new AuthResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                ExpiresAt = expiresAt
            };
        }
    }
}
