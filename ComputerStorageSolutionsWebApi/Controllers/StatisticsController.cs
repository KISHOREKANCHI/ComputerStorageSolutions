using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly DataBaseConnect Database;
        private readonly ILogger<StatisticsController> Logger;

        public StatisticsController(DataBaseConnect _Database, ILogger<StatisticsController> _Logger)
        {
            Database = _Database;
            Logger = _Logger;
        }

        // 1. Display total sales month wise
        [HttpGet("TotalSalesMonthWise")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetTotalSalesMonthWise()
        {
            try
            {
                var sales = await Database.Orders
                    .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                    .Select(g => new
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        TotalSales = g.Sum(o => o.TotalAmount)
                    })
                    .ToListAsync();

                return Ok(sales);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Internal server Error fetching total sales month wise.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // 2. Display total orders placed by a customer month wise
        [HttpGet("TotalOrdersByCustomerMonthWise")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetTotalOrdersByCustomerMonthWise(Guid customerId)
        {
            try
            {
                var orders = await (from o in Database.Orders
                                    where o.UserId == customerId
                                    group o by new { o.OrderDate.Year, o.OrderDate.Month } into g
                                    select new
                                    {
                                        Year = g.Key.Year,
                                        Month = g.Key.Month,
                                        TotalOrders = g.Count()
                                    }).ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"Internal server Error fetching total orders for customer {customerId}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // 3. Display orders placed by a customer in a specific month
        [HttpGet("OrdersByCustomerInMonth")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetOrdersByCustomerInMonth(Guid customerId, int year, int month)
        {
            try
            {
                var orders = await Database.Orders
                    .Where(o => o.UserId == customerId && o.OrderDate.Year == year && o.OrderDate.Month == month)
                    .ToListAsync();

                if (!orders.Any())
                {
                    return NotFound("No orders found for the specified customer and month.");
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"Internal server Error fetching orders for customer {customerId} in {month}/{year}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // 4. Customers who have not placed any orders in the last 3 months
        [HttpGet("CustomersWithNoOrdersInLast3Months")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetCustomersWithNoOrdersInLast3Months()
        {
            try
            {
                var threeMonthsAgo = DateTime.Now.AddMonths(-3);
                var customers = await Database.Users
                    .Where(c => !Database.Orders.Any(o => o.UserId == c.UserId && o.OrderDate >= threeMonthsAgo))
                    .ToListAsync();

                return Ok(customers);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Internal server Error fetching customers with no orders in the last 3 months.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // 5. Number of units sold for products in the price range
        [HttpGet("UnitsSoldInPriceRange")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetUnitsSoldInPriceRange(decimal minPrice, decimal maxPrice)
        {
            try
            {
                var unitsSold = await (from od in Database.OrderDetails
                                       where od.UnitPrice >= minPrice && od.UnitPrice <= maxPrice
                                       group od by od.ProductId into g
                                       select new
                                       {
                                           ProductId = g.Key,
                                           UnitsSold = g.Sum(od => od.Quantity)
                                       }).ToListAsync();

                return Ok(unitsSold);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"Error fetching units sold for products in the price range {minPrice}-{maxPrice}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // 6. Display the details of most popular product for a specific month
        [HttpGet("MostPopularProduct")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetMostPopularProduct(int year, int month)
        {
            try
            {
                var popularProduct = await Database.OrderDetails
                    .Where(od => od.Order.OrderDate.Year == year && od.Order.OrderDate.Month == month)
                    .GroupBy(od => od.ProductId)
                    .OrderByDescending(g => g.Sum(od => od.Quantity))
                    .Select(g => new
                    {
                        Product = g.First().Products,
                        UnitsSold = g.Sum(od => od.Quantity)
                    })
                    .FirstOrDefaultAsync();

                if (popularProduct == null)
                {
                    return NotFound("No popular product found for the specified month.");
                }

                return Ok(popularProduct);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"Internal server Error fetching most popular product for {month}/{year}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // 7. Display the details of least popular product for a specific month
        [HttpGet("LeastPopularProduct")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetLeastPopularProduct(int year, int month)
        {
            try
            {
                var leastPopularProduct = await Database.OrderDetails
                    .Where(od => od.Order.OrderDate.Year == year && od.Order.OrderDate.Month == month)
                    .GroupBy(od => od.ProductId)
                    .OrderBy(g => g.Sum(od => od.Quantity))
                    .Select(g => new
                    {
                        Product = g.First().Products,
                        UnitsSold = g.Sum(od => od.Quantity)
                    })
                    .FirstOrDefaultAsync();

                if (leastPopularProduct == null)
                {
                    return NotFound("No least popular product found for the specified month.");
                }

                return Ok(leastPopularProduct);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"Internal server Error fetching least popular product for {month}/{year}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // 8. Display the customer and products he/she ordered in a quarter
        [HttpGet("CustomerProductsInQuarter")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetCustomerProductsInQuarter(Guid customerId, int year, int quarter)
        {
            try
            {
                var startMonth = (quarter - 1) * 3 + 1;
                var endMonth = startMonth + 2;

                var orders = await Database.Orders
                    .Where(o => o.UserId == customerId && o.OrderDate.Year == year && o.OrderDate.Month >= startMonth && o.OrderDate.Month <= endMonth)
                    .Select(o => new
                    {
                        o.OrderId,
                        o.OrderDate,
                        Products = o.OrderDetails.Select(od => od.Products)
                    })
                    .ToListAsync();

                if (!orders.Any())
                {
                    return NotFound($"No orders found for customer {customerId} in quarter {quarter} of {year}.");
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"Internal server Error fetching customer products for quarter {quarter}/{year}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // 9. Display the order ID and customer details for the highest selling product
        [HttpGet("OrderAndCustomerForHighestSellingProduct")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetOrderAndCustomerForHighestSellingProduct()
        {
            try
            {
                var highestSellingProduct = await Database.OrderDetails
                    .GroupBy(od => od.ProductId)
                    .OrderByDescending(g => g.Sum(od => od.Quantity))
                    .Select(g => g.Key)
                    .FirstOrDefaultAsync();

                if (highestSellingProduct == default)
                {
                    return NotFound("No highest selling product found.");
                }

                var orderDetails = await Database.OrderDetails
                    .Where(od => od.ProductId == highestSellingProduct)
                    .Include(od => od.Order.Users)
                    .Select(od => new
                    {
                        od.Order.OrderId,
                        Customer = od.Order.Users
                    })
                    .ToListAsync();

                if (!orderDetails.Any())
                {
                    return NotFound("No order or customer details found for the highest selling product.");
                }

                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Internal server Error fetching order and customer details for the highest selling product.");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
