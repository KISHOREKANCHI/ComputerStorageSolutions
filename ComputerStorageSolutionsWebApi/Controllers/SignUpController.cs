using ComputerStorageSolutions.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Security.Cryptography;
using System.Text;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignUpController : ControllerBase
    {
        private readonly DataBaseConnect Database;
        private readonly ILogger<SignUpController> Logger;

        public SignUpController(DataBaseConnect _Database, ILogger<SignUpController> _Logger)
        {
            Database = _Database;
            Logger = _Logger;
        }

        [HttpPost(Name = "CreateUser")]
        public IActionResult SignUp([FromBody] SignUpInput input)
        {
            try
            {
                var regexUsername = @"^[a-zA-Z][a-zA-Z0-9]{2,}$";
                var regexPassword = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";
                var regexEmail = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

                if (string.IsNullOrEmpty(input.Username))
                {
                    Logger.LogWarning("Attempt to register with empty username.");
                    return Ok(new { success = false, message = "Username cannot be empty" });
                }
                else if (string.IsNullOrEmpty(input.Password))
                {
                    Logger.LogWarning("Attempt to register with empty password.");
                    return Ok(new { success = false, message = "Password cannot be empty" });
                }
                else if (string.IsNullOrEmpty(input.Email))
                {
                    Logger.LogWarning("Attempt to register with empty email.");
                    return Ok(new { success = false, message = "Email cannot be empty" });
                }

                var username = Regex.Match(input.Username, regexUsername);
                var password = Regex.Match(input.Password, regexPassword);
                var email = Regex.Match(input.Email, regexEmail);

                if (!username.Success)
                {
                    Logger.LogWarning($"Invalid username format: {input.Username}");
                    return Ok(new
                    {
                        success = false,
                        message = "Username must start with a letter and contain only alphanumeric characters, with at least 3 characters."
                    });
                }
                else if (!password.Success)
                {
                    Logger.LogWarning($"Invalid password format for user: {input.Username}");
                    return Ok(new
                    {
                        success = false,
                        message = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
                    });
                }
                else if (!email.Success)
                {
                    Logger.LogWarning($"Invalid email format: {input.Email}");
                    return Ok(new
                    {
                        success = false,
                        message = "Please enter a valid email address."
                    });
                }
                else
                {
                    var CheckEmail = (
                                         from user in Database.Users
                                         where user.Email == input.Email
                                         select user
                                     ).ToList();
                    var Customer = (from roles in Database.Roles
                                    where roles.RoleName == "Customer"
                                    select roles.RoleId).SingleOrDefault();

                    if (CheckEmail.Count > 0)
                    {
                        Logger.LogWarning($"Duplicate email registration attempt: {input.Email}");
                        return Ok(new { success = false, message = "Email must be unique" });
                    }

                    // Hash the password using SHA-512
                    using (SHA512 sha512 = SHA512.Create())
                    {
                        var hashedPasswordBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(input.Password));
                        var hashedPassword = Convert.ToBase64String(hashedPasswordBytes);

                        Database.Users.Add(new UserModel
                        {
                            Username = input.Username,
                            PasswordHash = hashedPassword,
                            Email = input.Email.ToLower(),
                            RoleId = Customer,
                            CreatedDate = DateTime.Now,
                            IsActive = true,
                        });
                        Database.SaveChanges();

                        Logger.LogInformation($"User {input.Username} created successfully with email {input.Email}.");
                    }
                    return Ok(new { success = true, message = "Registration successful!" });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"An Internal server error occurred while trying to register user {input.Username}.");
                return StatusCode(500, "An internal server error occurred. Please try again later.");
            }
        }

        public class SignUpInput
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
        }
    }
}
