using ComputerStorageSolutions.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly DataBaseConnect Database;

        public StatisticsController(DataBaseConnect _Database)
        {
            Database = _Database;
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
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // 2. Display total orders placed by a customer month wise
        [HttpGet("TotalOrdersByCustomerMonthWise")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetTotalOrdersByCustomerMonthWise(Guid customerId)
        {
            if (customerId == Guid.Empty)
            {
                return BadRequest("Invalid customer ID.");
            }

            try
            {
                var orders = await (from o in Database.Orders
                                    where o.UserId.ToString().ToLower() == customerId.ToString().ToLower()
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
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // 3. Display orders placed by a customer in a specific month
        [HttpGet("OrdersByCustomerInMonth")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetOrdersByCustomerInMonth(Guid customerId, int year, int month)
        {
            if (customerId == Guid.Empty || year <= 0 || month <= 0 || month > 12)
            {
                return BadRequest("Invalid input parameters.");
            }

            try
            {
                var orders = await Database.Orders
                    .Where(o => o.UserId.ToString().ToLower() == customerId.ToString().ToLower() && o.OrderDate.Year == year && o.OrderDate.Month == month)
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
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
                    .Where(c => !Database.Orders.Any(o => o.UserId.ToString().ToLower() == c.UserId.ToString().ToLower() && o.OrderDate >= threeMonthsAgo && c.IsActive == true))
                    .Select(c => new
                    {
                        customerId = c.UserId,
                        customerName = c.Username
                    })
                    .ToListAsync();

                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // 5. Number of units sold for products in the price range
        [HttpGet("UnitsSoldInPriceRange")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetUnitsSoldInPriceRange(decimal minPrice, decimal maxPrice)
        {
            if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice)
            {
                return BadRequest("Invalid price range.");
            }

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
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // 6. Display the details of most popular product for a specific month
        [HttpGet("MostPopularProduct")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetMostPopularProduct(int year, int month)
        {
            if (year <= 0 || month <= 0 || month > 12)
            {
                return BadRequest("Invalid input parameters.");
            }

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

                return Ok(popularProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // 7. Display the details of least popular product for a specific month
        [HttpGet("LeastPopularProduct")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetLeastPopularProduct(int year, int month)
        {
            if (year <= 0 || month <= 0 || month > 12)
            {
                return BadRequest("Invalid input parameters.");
            }

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

                return Ok(leastPopularProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // 8. Display the customer and products he/she ordered in a quarter
        [HttpGet("CustomerProductsInQuarter")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetCustomerProductsInQuarter(Guid customerId, int year, int quarter)
        {
            if (customerId == Guid.Empty || year <= 0 || quarter <= 0 || quarter > 4)
            {
                return BadRequest("Invalid input parameters.");
            }

            try
            {
                var startMonth = (quarter - 1) * 3 + 1;
                var endMonth = startMonth + 2;

                var orders = await Database.Orders
                    .Where(o => o.UserId.ToString().ToLower() == customerId.ToString().ToLower() && o.OrderDate.Year == year && o.OrderDate.Month >= startMonth && o.OrderDate.Month <= endMonth)
                    .Select(o => new
                    {
                        o.OrderId,
                        o.OrderDate,
                        Products = o.OrderDetails.Select(od => od.Products)
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
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

                var orderDetails = await Database.OrderDetails
                    .Where(od => od.ProductId == highestSellingProduct)
                    .Include(od => od.Order.Users)
                    .Select(od => new
                    {
                        od.Order.OrderId,
                        Customer = od.Order.UserId
                    })
                    .ToListAsync();

                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
