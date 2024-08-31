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
        private readonly ILogger<OrderDetailsController> Logger;
        private readonly IJwtService JwtService;

        public OrderDetailsController(DataBaseConnect _Database, ILogger<OrderDetailsController> _Logger, IJwtService _jwtService)
        {
            Database = _Database;
            Logger = _Logger;
            JwtService = _jwtService;
        }

        [HttpGet("UserOrders")]
        [Authorize]
        public async Task<IActionResult> GetUserOrders()
        {
            try
            {
                var userId = GetUserIdFromToken();

                // Retrieve the orders for the specified user asynchronously
                var orders = await Database.Orders
                                            .Where(order => order.UserId == userId)
                                            .ToListAsync();

                if (orders != null && orders.Count > 0)
                {
                    return Ok(orders);
                }

                Logger.LogInformation("No orders found for user: {UserId}", userId);
                return NotFound("No orders found for the specified user.");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "An error occurred while retrieving orders for the user.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost("OrderProduct")]
        [Authorize]
        public async Task<IActionResult> AddProduct([FromBody] OrderRequest orderRequest)
        {
            // Validate the product orders list
            if (orderRequest == null || orderRequest.ProductOrders == null || !orderRequest.ProductOrders.Any())
            {
                return BadRequest("Product orders list cannot be null or empty.");
            }

            var userId = GetUserIdFromToken();

            if (userId == Guid.Empty)
            {
                return Unauthorized("Invalid token.");
            }

            // Convert the list of ProductOrder to get product IDs
            var productGuids = orderRequest.ProductOrders.Select(po => po.ProductId).ToList();

            // Retrieve product prices and IDs from the database
            var products = await Database.Products
                .Where(product => productGuids.Contains(product.ProductId))
                .ToListAsync();

            // Check if any products were found
            if (!products.Any())
            {
                return NotFound("No products found for the given IDs.");
            }

            // Calculate the total amount based on quantities
            decimal totalAmount = 0;
            var orderDetailsList = new List<Models.OrderDetailsModel>();

            foreach (var order in orderRequest.ProductOrders)
            {
                var product = products.FirstOrDefault(p => p.ProductId == order.ProductId);
                if (product != null)
                {
                    totalAmount += product.Price * order.Quantity; // Accumulate total amount

                    // Create order detail for each product
                    var orderDetail = new Models.OrderDetailsModel
                    {
                        ProductId = product.ProductId, // Use the actual ProductId
                        Quantity = order.Quantity,       // Use the quantity from the order
                        UnitPrice = product.Price        // Use the price from the product
                    };
                    orderDetailsList.Add(orderDetail);
                }
            }

            // Create a new order
            var newOrder = new Models.OrdersModel
            {
                UserId = userId,
                OrderDate = DateTime.Now,
                TotalAmount = totalAmount,
                OrderStatus = "Order Placed",
                ShippingAddress = orderRequest.ShippingAddress // Use the shipping address from the request
            };

            // Add the order to the database
            await Database.Orders.AddAsync(newOrder);
            await Database.SaveChangesAsync(); // Save changes to get the new order ID

            // Now add the order details with the new order ID
            foreach (var detail in orderDetailsList)
            {
                detail.OrderId = newOrder.OrderId; // Assign the OrderId to the order detail
                await Database.OrderDetails.AddAsync(detail); // Add each detail to the database
            }

            await Database.SaveChangesAsync(); // Save changes for order details

            return Ok("Order placed successfully.");
        }

        // Private method to extract the UserId from the JWT token
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
                Logger.LogError(ex, "Failed to extract UserId from token.");
                return Guid.Empty; // Return an empty GUID if there is an error
            }
        }

        public class ProductOrder
        {
            public Guid ProductId { get; set; }
            public int Quantity { get; set; }
        }

        public class OrderRequest
        {
            public List<ProductOrder> ProductOrders { get; set; }
            public string ShippingAddress { get; set; }
        }
    }
}
