using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DataBaseConnect Database;
        private readonly IConfiguration Configuration;
        public LoginController(DataBaseConnect _Database, IConfiguration _Configuration)
        {
            Database = _Database;
            Configuration = _Configuration;
        }

        [HttpPost(Name = "VerifyUser")]
        public IActionResult Login([FromBody] LoginInput input)
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
                var result = (from user in Database.Users
                              join role in Database.Roles on user.RoleId equals role.RoleId
                              where user.Email == input.Email && user.PasswordHash == input.PasswordHash
                              select new
                              {
                                  User = user,
                                  Role = role.RoleName
                              }).ToList();
                if (result.Count() != 0)
                {
                    var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub,Configuration["Jwt:Subject"]!),
                        new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                        new Claim("UserId",result[0].User.UserId.ToString()),
                        new Claim("Email",result[0].User.Email.ToString()),
                        new Claim(ClaimTypes.Role,result[0].User.RoleId.ToString())
                    };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]!));
                    var SignIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
                    var token = new JwtSecurityToken(
                        Configuration["Jwt:Issuer"],
                        Configuration["Jwt:Audience"],
                        claims,
                        expires: DateTime.UtcNow.AddMinutes(60),
                        signingCredentials: SignIn
                        );
                    string TokenValue = new JwtSecurityTokenHandler().WriteToken(token);
                    return Ok(new
                    {
                        Token = TokenValue,
                        user = result
                    });
                }
                return BadRequest("Email or password does not exist");

            }
        }

        public class LoginInput
        {
            public string Email { get; set; } = String.Empty;
            public string PasswordHash { get; set; } = String.Empty;
        }
    }
}
