using LibraryAPI.DTOs;

namespace LibraryAPI.Services
{
    /// <summary>
    /// Defines the contract for authentication operations.
    /// </summary>
    public interface IAuthService
    {
        /// <summary>Registers a new user. Returns null if email/username already exists.</summary>
        Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);

        /// <summary>Authenticates an existing user. Returns null if credentials are invalid.</summary>
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    }
}
