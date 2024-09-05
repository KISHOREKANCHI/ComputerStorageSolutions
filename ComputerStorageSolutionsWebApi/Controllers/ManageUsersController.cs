using Microsoft.AspNetCore.Mvc;
using ComputerStorageSolutions.Models;
using System.Linq;
using System;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization; // Ensure to import this if Logger is used

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManageUsersController : ControllerBase
    {
        private readonly DataBaseConnect _database;
        private readonly ILogger<ManageUsersController> _logger; // Assuming you have a logger
        private readonly IJwtService JwtService;

        public ManageUsersController(DataBaseConnect database, ILogger<ManageUsersController> logger, IJwtService _jwtService)
        {
            _database = database;
            _logger = logger;
            JwtService = _jwtService;
        }

        private Guid GetUserIdFromToken()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString();
                token = token.Substring("Bearer ".Length).Trim();

                return Guid.Parse(JwtService.GetUserIdFromToken(token)); // Use Parse to convert string to Guid
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to extract UserId from token.");
                return Guid.Empty; // Return an empty GUID if there is an error
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _database.Users
                    .Join(_database.Roles,
                        user => user.RoleId,  // Foreign key in Users
                        role => role.RoleId,  // Primary key in Roles
                        (user, role) => new
                        {
                            user.UserId,
                            user.Username,
                            user.Email,
                            user.IsActive,
                            Role = role.RoleName // Get the role name
                        })
                    .ToList();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPost("promote")]
        public IActionResult PromoteToAdmin([FromBody] User User)
        {
            try
            {
                var user = _database.Users.FirstOrDefault(u => u.UserId.ToString().ToUpper() == User.UserId.ToString().ToUpper());
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var adminRole = _database.Roles.FirstOrDefault(r => r.RoleName == "Admin");
                if (adminRole == null)
                {
                    return NotFound("Admin role not found in the database");
                }

                user.RoleId = adminRole.RoleId;
                _database.SaveChanges();

                return Ok("User promoted to Admin");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error promoting user.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPost("demote")]
        public IActionResult DemoteToUser([FromBody] User User)
        {
            var requesterId = GetUserIdFromToken();
            if (requesterId == Guid.Empty)
            {
                return Unauthorized("Invalid token.");
            }

            // Check if the requester is an admin
            var requester = (from u in _database.Users
                             join r in _database.Roles on u.RoleId equals r.RoleId
                             where u.UserId == requesterId && r.RoleName == "Admin"
                             select u).FirstOrDefault();
            if (requester == null)
            {
                return Forbid("Only admins can demote users.");
            }

            try
            {
                var user = (from u in _database.Users
                            join r in _database.Roles on u.RoleId equals r.RoleId
                            where u.UserId.ToString().ToLower() == User.UserId.ToString().ToLower()
                            select new { u, r.RoleName }).FirstOrDefault();
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var userRole = _database.Roles.FirstOrDefault(r => r.RoleName == "Customer");
                if (userRole == null)
                {
                    return NotFound("User role not found in the database");
                }

                // Ensure there's more than one admin before demoting
                var adminCount = (from u in _database.Users
                                  join r in _database.Roles on u.RoleId equals r.RoleId
                                  where r.RoleName == "Admin"
                                  select u).Count();
                if (adminCount <= 1 && user.RoleName == "Admin")
                {
                    return BadRequest("Cannot demote the last admin.");
                }

                var userToUpdate = _database.Users.FirstOrDefault(u => u.UserId == user.u.UserId);
                userToUpdate.RoleId = userRole.RoleId;
                _database.SaveChanges();

                return Ok("User demoted to User");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error demoting user.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpDelete]
        public IActionResult DeleteUser([FromBody] User User)
        {
            var requesterId = GetUserIdFromToken();
            if (requesterId == Guid.Empty)
            {
                return Unauthorized("Invalid token.");
            }

            // Check if the requester is an admin
            var requester = (from u in _database.Users
                             join r in _database.Roles on u.RoleId equals r.RoleId
                             where u.UserId == requesterId && r.RoleName == "Admin"
                             select u).FirstOrDefault();
            if (requester == null)
            {
                return Forbid("Only admins can delete users.");
            }

            try
            {
                var user = (from u in _database.Users
                            where u.UserId.ToString().ToLower() == User.UserId.ToString().ToLower()
                            select u).FirstOrDefault();
                if (user == null)
                {
                    return NotFound("User not found");
                }

                user.IsActive = false;
                _database.SaveChanges();

                return Ok("User deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPost("toggleStatus")]
        public IActionResult ToggleUserStatus([FromBody] UserStatusUpdateRequest request)
        {
            var requesterId = GetUserIdFromToken();
            if (requesterId == Guid.Empty)
            {
                return Unauthorized("Invalid token.");
            }

            // Check if the requester is an admin
            var requester = (from u in _database.Users
                             join r in _database.Roles on u.RoleId equals r.RoleId
                             where u.UserId == requesterId && r.RoleName == "Admin"
                             select u).FirstOrDefault();
            if (requester == null)
            {
                return Forbid("Only admins can change user status.");
            }

            try
            {
                var user = _database.Users.FirstOrDefault(u => u.UserId.ToString().ToLower() == request.UserId.ToString().ToLower());
                if (user == null)
                {
                    return NotFound("User not found");
                }

                user.IsActive = request.IsActive;
                _database.SaveChanges();

                return Ok($"User {(request.IsActive ? "activated" : "deactivated")} successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing user status.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }



    public class User
    {
        public Guid UserId { get; set; }
    }

    public class UserStatusUpdateRequest
    {
        public Guid UserId { get; set; }
        public bool IsActive { get; set; }
    }

}
