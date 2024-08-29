using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Cryptography;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DataBaseConnect Database;
        private readonly IConfiguration Configuration;
        private readonly ILogger<LoginController> Logger;

        public LoginController(DataBaseConnect _Database, IConfiguration _Configuration, ILogger<LoginController> _Logger)
        {
            Database = _Database;
            Configuration = _Configuration;
            Logger = _Logger;
        }

        [HttpPost(Name = "VerifyUser")]
        public IActionResult Login([FromBody] LoginInput input)
        {
            try
            {
                if (string.IsNullOrEmpty(input.Email))
                {
                    Logger.LogWarning("Login attempt with empty email.");
                    return BadRequest("Email cannot be empty");
                }
                if (string.IsNullOrEmpty(input.Password))
                {
                    Logger.LogWarning("Login attempt with empty password for email: {Email}", input.Email);
                    return BadRequest("Password cannot be empty");
                }

                // Hash the input password using SHA-512
                string hashedPassword;
                using (SHA512 sha512 = SHA512.Create())
                {
                    var hashedPasswordBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(input.Password));
                    hashedPassword = Convert.ToBase64String(hashedPasswordBytes);
                }

                var result = (from user in Database.Users
                              join role in Database.Roles on user.RoleId equals role.RoleId
                              where user.Email == input.Email && user.PasswordHash == hashedPassword
                              select new
                              {
                                  User = user,
                                  Role = role.RoleName
                              }).ToList();

                if (result.Count != 0)
                {
                    var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, Configuration["Jwt:Subject"] ?? string.Empty),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim("UserId", result[0].User.UserId.ToString()),
                        new Claim("Email", result[0].User.Email),
                        new Claim(ClaimTypes.Role, result[0].Role)
                    };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"] ?? string.Empty));
                    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

                    var token = new JwtSecurityToken(
                        Configuration["Jwt:Issuer"],
                        Configuration["Jwt:Audience"],
                        claims,
                        expires: DateTime.UtcNow.AddMinutes(60),
                        signingCredentials: signIn
                    );

                    string tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

                    Logger.LogInformation("User {Email} logged in successfully at {Time}.", input.Email, DateTime.UtcNow);

                    return Ok(new
                    {
                        Token = tokenValue,
                        UserName = result[0].User.Username
                    });
                }

                Logger.LogWarning("Failed login attempt for email: {Email} at {Time}.", input.Email, DateTime.UtcNow);
                return BadRequest("Email or password does not exist");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "An error occurred during login attempt for email: {Email} at {Time}.", input.Email, DateTime.UtcNow);
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
