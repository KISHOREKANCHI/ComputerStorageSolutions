using Microsoft.AspNetCore.Mvc;
using ComputerStorageSolutions.Models;
using System.Linq;
using System;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManageUsersController : ControllerBase
    {
        private readonly DataBaseConnect _database;

        public ManageUsersController(DataBaseConnect database)
        {
            _database = database;
        }

        [HttpPost("promote")]
        public IActionResult PromoteToAdmin([FromBody] Guid userId)
        {
            try
            {
                var user = _database.Users.FirstOrDefault(u => u.UserId == userId);
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
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("demote")]
        public IActionResult DemoteToUser([FromBody] Guid userId)
        {
            try
            {
                var user = _database.Users.FirstOrDefault(u => u.UserId == userId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var userRole = _database.Roles.FirstOrDefault(r => r.RoleName == "Customer");
                if (userRole == null)
                {
                    return NotFound("User role not found in the database");
                }

                user.RoleId = userRole.RoleId;
                _database.SaveChanges();

                return Ok("User demoted to User");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // Delete a user
        [HttpDelete]
        public IActionResult DeleteUser(Guid id)
        {
            try
            {
                var user = _database.Users.FirstOrDefault(u => u.UserId == id);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                _database.Users.Remove(user);
                _database.SaveChanges();

                return Ok("User deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
