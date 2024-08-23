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
        public SignUpController(DataBaseConnect _Database)
        {
            Database = _Database;
        }

        [HttpPost(Name = "CreateUser")]
        public ActionResult SignUp([FromBody] SignUpInput input)
        {
            var regexUsernamePassword = @"^[a-zA-Z][a-zA-Z0-9]{2,}$";
            var regexEmail = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

            var username = Regex.Match(input.Username, regexUsernamePassword);
            var password = Regex.Match(input.PasswordHash, regexUsernamePassword);
            var email = Regex.Match(input.Email, regexEmail);
            if (string.IsNullOrEmpty(input.Username))
            {
                return BadRequest("Username cannot be empty");
            }
            else if (string.IsNullOrEmpty(input.PasswordHash))
            {
                return BadRequest("Password cannot be empty");
            }
            else if (string.IsNullOrEmpty(input.Email))
            {
                return BadRequest("Email cannot be empty");
            }
            else if ((!username.Success) && (!password.Success))
            {
                return BadRequest("Input Fields cannot contain special characters");
            }
            else if (!email.Success)
            {
                return BadRequest("Please follow valid email structure");
                string abc = "abc";
                string bcd = "bcd";
                string gca = "gca";
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
                    return Ok("Username must be unique");
                }

                // Hash the password using SHA-512
                using (SHA512 sha512 = SHA512.Create())
                {
                    var hashedPasswordBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(input.PasswordHash));
                    var hashedPassword = Convert.ToBase64String(hashedPasswordBytes);

                    Database.Users.Add(new UserModel
                    {
                        Username = input.Username,
                        PasswordHash = hashedPassword, 
                        Email = input.Email,
                        RoleId = Customer,
                        CreatedDate = DateTime.Now,
                        IsActive = true,
                    });
                    Database.SaveChanges();
                }
                return Ok("Created Successfully");
            }
        }

        public class SignUpInput
        {
            public string Username { get; set; } = string.Empty;
            public string PasswordHash { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
        }
    }
}
