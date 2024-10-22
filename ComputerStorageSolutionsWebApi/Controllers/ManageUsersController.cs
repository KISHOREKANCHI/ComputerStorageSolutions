﻿using Microsoft.AspNetCore.Mvc;
using ComputerStorageSolutions.Models;
using System.Linq;
using System;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManageUsersController : ControllerBase
    {
        private readonly DataBaseConnect _database;
        private readonly ILogger<ManageUsersController> _logger;
        private readonly IJwtService _jwtService;

        public ManageUsersController(DataBaseConnect database, ILogger<ManageUsersController> logger, IJwtService jwtService)
        {
            _database = database;
            _logger = logger;
            _jwtService = jwtService;
        }

        private Guid GetUserIdFromToken()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString();
                token = token.Substring("Bearer ".Length).Trim();

                return Guid.Parse(_jwtService.GetUserIdFromToken(token)); // Use Parse to convert string to Guid
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
                _logger.LogError(ex, "An Internal server error occurred while retrieving users.");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPost("promote")]
        public IActionResult PromoteToAdmin([FromBody] User userRequest)
        {
            try
            {
                var user = _database.Users.FirstOrDefault(u => u.UserId == userRequest.UserId);
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
                _logger.LogError(ex, "Internal server Error promoting user to Admin.");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPost("demote")]
        public IActionResult DemoteToUser([FromBody] User userRequest)
        {
            try
            {
                var requesterId = GetUserIdFromToken();
                if (requesterId == Guid.Empty)
                {
                    return Unauthorized("Invalid token.");
                }

                // Check if the requester is an admin
                var requester = _database.Users
                    .Join(_database.Roles, u => u.RoleId, r => r.RoleId, (u, r) => new { u, r })
                    .FirstOrDefault(ur => ur.u.UserId == requesterId && ur.r.RoleName == "Admin");

                if (requester == null)
                {
                    return Forbid("Only admins can demote users.");
                }

                var user = _database.Users
                    .Join(_database.Roles, u => u.RoleId, r => r.RoleId, (u, r) => new { u, r })
                    .FirstOrDefault(ur => ur.u.UserId == userRequest.UserId);

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
                var adminCount = _database.Users
                    .Join(_database.Roles, u => u.RoleId, r => r.RoleId, (u, r) => new { u, r })
                    .Count(ur => ur.r.RoleName == "Admin");

                if (adminCount <= 1 && user.r.RoleName == "Admin")
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
                _logger.LogError(ex, "Internal server Error demoting user to User.");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpDelete]
        public IActionResult DeleteUser([FromBody] User userRequest)
        {
            try
            {
                var requesterId = GetUserIdFromToken();
                if (requesterId == Guid.Empty)
                {
                    return Unauthorized("Invalid token.");
                }

                // Check if the requester is an admin
                var requester = _database.Users
                    .Join(_database.Roles, u => u.RoleId, r => r.RoleId, (u, r) => new { u, r })
                    .FirstOrDefault(ur => ur.u.UserId == requesterId && ur.r.RoleName == "Admin");

                if (requester == null)
                {
                    return Forbid("Only admins can delete users.");
                }

                var user = _database.Users.FirstOrDefault(u => u.UserId == userRequest.UserId);
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
                _logger.LogError(ex, "Internal server Error deleting user.");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPost("toggleStatus")]
        public IActionResult ToggleUserStatus([FromBody] UserStatusUpdateRequest request)
        {
            try
            {
                var requesterId = GetUserIdFromToken();
                if (requesterId == Guid.Empty)
                {
                    return Unauthorized("Invalid token.");
                }

                // Check if the requester is an admin
                var requester = _database.Users
                    .Join(_database.Roles, u => u.RoleId, r => r.RoleId, (u, r) => new { u, r })
                    .FirstOrDefault(ur => ur.u.UserId == requesterId && ur.r.RoleName == "Admin");

                if (requester == null)
                {
                    return Forbid("Only admins can change user status.");
                }

                var user = _database.Users.FirstOrDefault(u => u.UserId == request.UserId);
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
                _logger.LogError(ex, "Internal server Error changing user status.");
                return StatusCode(500, "Internal server error");
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
