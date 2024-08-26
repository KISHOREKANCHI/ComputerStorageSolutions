using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly DataBaseConnect Database;
        public OrderDetailsController(DataBaseConnect database)
        {
            Database = database;
        }
        [HttpGet("UserOrders")]
        [Authorize]
        public async Task<IActionResult> GetUserOrders(Guid userId)
        {
            // Retrieve the orders and their details for the specified user
            var orders = await (from Orders in Database.Orders
                                where Orders.UserId == userId
                                select Orders).ToListAsync();
            if (orders != null)
            {
                return Ok(orders);
            }
            return NotFound();
        }
    }
}
