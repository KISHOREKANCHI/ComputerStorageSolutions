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
        // 1. Display total sales month wise
        [HttpGet("TotalSalesMonthWise")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetTotalSalesMonthWise()
        {
            try
            {
                var sales = await Database.OrderDetails
                    .GroupBy(od => od.OrderId) // Group by OrderId to get OrderDate
                    .Select(g => new
                    {
                        OrderDate = Database.Orders.FirstOrDefault(o => o.OrderId == g.Key).OrderDate, // Fetch OrderDate for each OrderId
                        TotalSales = g.Count() // Count of order details for each OrderId
                    })
                    .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month }) // Group by Year and Month
                    .Select(g => new
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        TotalSales = g.Sum(o => o.TotalSales) // Sum of total sales for each year and month
                    })
                    .ToListAsync();

                // Organize sales data into a structured response
                var result = sales
                    .GroupBy(s => s.Year)
                    .Select(g => new
                    {
                        Year = g.Key,
                        Months = g.Select(m => new
                        {
                            Month = m.Month,
                            TotalSales = m.TotalSales
                        }).ToList()
                    })
                    .ToList();

                return Ok(result);
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
        public async Task<IActionResult> GetUnitsSoldInPriceRange(int minPrice, int maxPrice)
        {
            // Validate the price range parameters
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
                                           ProductName = Database.Products
                                               .Where(p => p.ProductId == g.Key)
                                               .Select(p => p.ProductName)
                                               .FirstOrDefault(), // Get the first product name or null
                                           UnitsSold = g.Sum(od => od.Quantity)
                                       }).ToListAsync();

                return Ok(unitsSold);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // 6. Display the details of the most popular product for a specific month
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
                // Check if any order details exist for the specified month and year
                bool hasRecords = await Database.OrderDetails
                    .AnyAsync(od => od.Order.OrderDate.Year == year && od.Order.OrderDate.Month == month);

                if (!hasRecords)
                {
                    return Ok();
                }

                var mostSellingProduct = await Database.OrderDetails
                    .Where(od => od.Order.OrderDate.Year == year && od.Order.OrderDate.Month == month)
                    .GroupBy(od => od.ProductId)
                    .Select(g => new
                    {
                        Product = g.First().Products.ProductName,
                        UnitsSold = g.Sum(od => od.Quantity),
                        LastOrderDate = g.Max(od => od.Order.OrderDate)  // Get the latest order date for the product
                    })
                    .OrderByDescending(g => g.UnitsSold)   // Order by most units sold (changed here)
                    .ThenBy(g => g.LastOrderDate)           // Then order by the latest last order date
                    .FirstOrDefaultAsync();                  // Get the first (most selling) product

                return Ok(mostSellingProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
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
                // Check if any order details exist for the specified month and year
                bool hasRecords = await Database.OrderDetails
                    .AnyAsync(od => od.Order.OrderDate.Year == year && od.Order.OrderDate.Month == month);

                if (!hasRecords)
                {
                    return Ok();
                }

                var leastPopularProduct = await Database.OrderDetails
                    .Where(od => od.Order.OrderDate.Year == year && od.Order.OrderDate.Month == month)
                    .GroupBy(od => od.ProductId)
                    .Select(g => new
                    {
                        Product = g.First().Products.ProductName,
                        UnitsSold = g.Sum(od => od.Quantity),
                        LastOrderDate = g.Max(od => od.Order.OrderDate)  // Get the latest order date for the product
                    })
                    .OrderBy(g => g.UnitsSold)        // Order by least units sold
                    .ThenBy(g => g.LastOrderDate)     // Then order by oldest last order date
                    .FirstOrDefaultAsync();           // Get the first (least popular) product

                if (leastPopularProduct == null)
                {
                    return NotFound("No product found for the specified month.");
                }

                return Ok(leastPopularProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
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
                // Calculate total sales for each product and select the highest-selling product
                var highestSellingProductDetails = await Database.OrderDetails
                    .Select(od => new
                    {
                        od.ProductId,
                        TotalSales = od.Quantity * od.UnitPrice,
                        od.OrderId
                    })
                    .OrderByDescending(od => od.TotalSales)
                    .FirstOrDefaultAsync();

                if (highestSellingProductDetails == null)
                {
                    return NotFound("No orders found.");
                }

                // Fetch product name from Products table
                var productName = await Database.Products
                    .Where(p => p.ProductId == highestSellingProductDetails.ProductId)
                    .Select(p => p.ProductName)
                    .FirstOrDefaultAsync();

                // Get UserId from Orders where OrderId is in OrderDetails
                var username = await Database.Orders
                    .Where(o => o.OrderId == highestSellingProductDetails.OrderId)
                    .Select(o => o.UserId)
                    .FirstOrDefaultAsync();

                // Fetch the username from Users table
                var customerName = await Database.Users
                    .Where(u => u.UserId == username)
                    .Select(u => u.Username)
                    .FirstOrDefaultAsync();

                // Prepare the response object
                var result = new
                {
                    OrderId = highestSellingProductDetails.OrderId,
                    ProductName = productName,
                    CustomerName = customerName
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
