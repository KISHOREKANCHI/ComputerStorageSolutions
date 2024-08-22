using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ComputerStorageSolutions.Controllers;
using ComputerStorageSolutions.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DataBaseConnect Database;
        public LoginController(DataBaseConnect _Database)
        {
            Database = _Database;
        }

        [HttpPost(Name = "VerifyUser")]
        public IActionResult Login( [FromBody] LoginInput input)
        {
            if (string.IsNullOrEmpty(input.Email))
            {
                return BadRequest("Email cannot be empty");
            }
            else if (string.IsNullOrEmpty(input.PasswordHash))
            {
                return BadRequest("Password cannot be empty");
            }
            else
            {
                var result = from user in Database.Users
                             where user.Email == input.Email && user.PasswordHash == input.PasswordHash
                             select user;
                if (result.Count() == 0)
                {
                    return BadRequest("Email or password does not exist");
                }
                return Ok(result);
            }
        }

        public class LoginInput
        {
            public string Email { get; set; } = String.Empty;
            public string PasswordHash { get; set; } = String.Empty;
        }
    }
}
