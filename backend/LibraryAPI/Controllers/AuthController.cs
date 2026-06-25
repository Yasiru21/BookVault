using LibraryAPI.DTOs;
using LibraryAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryAPI.Controllers
{
    /// <summary>
    /// Controller for user authentication (register and login).
    /// Base route: /api/auth
    ///
    /// Endpoints:
    ///   POST /api/auth/register  — Create a new account
    ///   POST /api/auth/login     — Authenticate and receive JWT token
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        // ─────────────────────────────────────────────────────────────────────
        // POST /api/auth/register
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Registers a new user account and returns a JWT token on success.
        /// Returns 409 Conflict if the email or username is already taken.
        /// </summary>
        /// <param name="dto">Registration payload with username, email, and password.</param>
        [HttpPost("register")]
        [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
        {
            _logger.LogInformation("Register attempt | Username={Username} Email={Email}", dto.Username, dto.Email);

            var result = await _authService.RegisterAsync(dto);

            if (result is null)
            {
                return Conflict(new { message = "An account with this email or username already exists." });
            }

            _logger.LogInformation("User registered successfully | Username={Username}", dto.Username);
            return StatusCode(StatusCodes.Status201Created, result);
        }

        // ─────────────────────────────────────────────────────────────────────
        // POST /api/auth/login
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Authenticates a user and returns a signed JWT token valid for 24 hours.
        /// Returns 401 Unauthorized if credentials are invalid.
        /// </summary>
        /// <param name="dto">Login payload with email and password.</param>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
        {
            _logger.LogInformation("Login attempt | Email={Email}", dto.Email);

            var result = await _authService.LoginAsync(dto);

            if (result is null)
            {
                // Intentionally vague error message to prevent user enumeration attacks
                return Unauthorized(new { message = "Invalid email or password." });
            }

            _logger.LogInformation("Login successful | Email={Email}", dto.Email);
            return Ok(result);
        }
    }
}
