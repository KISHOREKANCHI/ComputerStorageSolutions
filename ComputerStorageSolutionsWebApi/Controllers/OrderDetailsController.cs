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

                // Retrieve the orders for the specified user, including product details
                var orders = await Database.Orders
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Products)
            .Where(order => order.UserId == userId)
            .Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                OrderStatus = o.OrderStatus,
                ShippingAddress = o.ShippingAddress,
                OrderDetails = o.OrderDetails.Select(od => new OrderDetailDto
                {
                    OrderDetailId = od.OrderDetailId,
                    ProductId = od.ProductId,
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice,
                    ProductName = od.Products.ProductName, // Ensure ProductName is included
                    Description = od.Products.Description,
                    ImageUrl =od.Products.ImageUrl,
                }).ToList()
            })
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
        public async Task<IActionResult> OrderProduct([FromBody] OrderRequest orderRequest)
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

            // Calculate the total amount based on quantities and check stock
            decimal totalAmount = 0;
            var orderDetailsList = new List<Models.OrderDetailsModel>();

            foreach (var order in orderRequest.ProductOrders)
            {
                var product = products.FirstOrDefault(p => p.ProductId == order.ProductId);
                if (product != null)
                {
                    // Check stock quantity and status
                    if (product.StockQuantity < order.Quantity || product.Status != "Available")
                    {
                        return BadRequest($"Insufficient stock for product '{product.ProductName}'. Available: {product.StockQuantity}");
                    }

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

            // Now add the order details with the new order ID and reduce stock quantity
            foreach (var detail in orderDetailsList)
            {
                detail.OrderId = newOrder.OrderId; // Assign the OrderId to the order detail
                await Database.OrderDetails.AddAsync(detail); // Add each detail to the database

                // Reduce stock quantity
                var productToUpdate = await Database.Products.FindAsync(detail.ProductId);
                if (productToUpdate != null)
                {
                    productToUpdate.StockQuantity -= detail.Quantity; // Decrease stock quantity

                }
            }

            await Database.SaveChangesAsync(); // Save changes for order details and stock updates

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

        public class OrderDto
        {
            public Guid OrderId { get; set; }
            public DateTime OrderDate { get; set; }
            public decimal TotalAmount { get; set; }
            public string OrderStatus { get; set; }
            public string ShippingAddress { get; set; }
            public List<OrderDetailDto> OrderDetails { get; set; }
        }

        public class OrderDetailDto
        {
            public Guid OrderDetailId { get; set; }
            public Guid ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
            public string ProductName { get; set; }
            public string Description {  get; set; }
            
            public string ImageUrl { get; set; }
        }

    }
}
