using ComputerStorageSolutions.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DataBaseConnect _database;
        private readonly IJwtCreationService _jwtCreationService;
        private readonly ILogger<LoginController> _logger;

        public LoginController(DataBaseConnect database, IJwtCreationService jwtCreationService, ILogger<LoginController> logger)
        {
            _database = database;
            _jwtCreationService = jwtCreationService;
            _logger = logger;
        }

        [HttpPost(Name = "VerifyUser")]
        public IActionResult Login([FromBody] LoginInput input)
        {
            try
            {
                if (string.IsNullOrEmpty(input.Email))
                {
                    _logger.LogWarning("Login attempt with empty email.");
                    return BadRequest("Email cannot be empty");
                }
                if (string.IsNullOrEmpty(input.Password))
                {
                    _logger.LogWarning("Login attempt with empty password for email: {Email}", input.Email);
                    return BadRequest("Password cannot be empty");
                }

                // Hash the input password using SHA-512
                string hashedPassword;
                using (SHA512 sha512 = SHA512.Create())
                {
                    var hashedPasswordBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(input.Password));
                    hashedPassword = Convert.ToBase64String(hashedPasswordBytes);
                }

                var result = (from user in _database.Users
                              join role in _database.Roles on user.RoleId equals role.RoleId
                              where user.Email.ToLower() == input.Email.ToLower() && user.PasswordHash == hashedPassword
                              select new
                              {
                                  User = user,
                                  Role = role.RoleName
                              }).ToList();

                if (result.Count != 0)
                {
                    string token = _jwtCreationService.CreateToken(
                        result[0].User.UserId.ToString(),
                        result[0].User.Username,
                        result[0].User.Email,
                        result[0].Role
                    );

                    _logger.LogInformation("User {Email} logged in successfully at {Time}.", input.Email, DateTime.UtcNow);

                    return Ok(new
                    {
                        Token = token,
                        UserName = result[0].User.Username
                    });
                }

                _logger.LogWarning("Failed login attempt for email: {Email} at {Time}.", input.Email, DateTime.UtcNow);
                return BadRequest("Email or password does not exist");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during login attempt for email: {Email} at {Time}.", input.Email, DateTime.UtcNow);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        public class LoginInput
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}
