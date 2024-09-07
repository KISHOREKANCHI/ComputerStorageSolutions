using ComputerStorageSolutions.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using static ComputerStorageSolutions.Controllers.ProductsController;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Net.Mime.MediaTypeNames;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DataBaseConnect Database;
        private readonly ILogger<ProductsController> Logger;
        private readonly IJwtService JwtService;

        public ProductsController(DataBaseConnect _Database, ILogger<ProductsController> _Logger, IJwtService jwtService)
        {
            Database = _Database;
            Logger = _Logger;
            JwtService = jwtService;
        }

        public enum CategoryList
        {
            SSD = 1,
            HDD = 2,
            FlashDrives = 3,
            MemoryCards = 4,
        }

        [HttpGet("Categories")]
        [Authorize]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                // Assuming you're using Entity Framework to interact with the database
                var categories = await Database.Categories
                    .Select(c => new
                    {
                        CategoryId=c.CategoryId,
                        CategoryName=c.CategoryName
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                // Log the exception details (optional)
                Logger.LogError(ex, "Error occurred while retrieving categories");

                // Return a 500 status code with a generic error message
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving categories.");
            }
        }

        [HttpGet("getProductCountbyCategory")]
        [Authorize]
        public async Task<IActionResult> GetProductCountByCategory([FromQuery] int categoryId)
        {
            try
            {
                if (categoryId <= 0)
                {
                    return BadRequest("Invalid categoryId. It must be greater than 0.");
                }

                // Get the user ID and role from the token
                var userId = GetUserIdFromToken();
                var role = await (from user in Database.Users
                                  join userRole in Database.Roles on user.RoleId equals userRole.RoleId
                                  where user.UserId == userId
                                  select userRole.RoleName).FirstOrDefaultAsync();

                var query = Database.Products.AsQueryable();

                // Apply role-based filtering
                if (role == "Customer")
                {
                    query = query.Where(p => p.CategoryId == categoryId && p.StockQuantity > 0 && p.Status == "Available");
                }
                else
                {
                    query = query.Where(p => p.CategoryId == categoryId);
                }

                var count = await query.CountAsync();

                if (count == 0)
                {
                    return NotFound($"No products found for Category ID {categoryId}.");
                }

                return Ok(count);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Internal server error fetching product count.");
                return StatusCode(500, "Internal server error.");
            }
        }


        [HttpGet("GetProductsByCategoryId")]
        [Authorize]
        public async Task<IActionResult> GetProductsByCategoryId([FromQuery] int categoryId, [FromQuery] int? pageNumber, [FromQuery] int? pageSize)
        {
            try
            {
                if (categoryId <= 0)
                {
                    return BadRequest("Invalid categoryId. It must be greater than 0.");
                }

                if (pageNumber <= 0 || pageSize <= 0)
                {
                    return BadRequest("Page number and page size must be greater than zero.");
                }

                // Get the user ID and role from the token
                var userId = GetUserIdFromToken();
                var role = await (from user in Database.Users
                                  join userRole in Database.Roles on user.RoleId equals userRole.RoleId
                                  where user.UserId == userId
                                  select userRole.RoleName).FirstOrDefaultAsync();

                var query = Database.Products.AsQueryable();

                // Apply role-based filtering
                if (role == "Customer")
                {
                    query = query.Where(p => p.CategoryId == categoryId && p.StockQuantity > 0 && p.Status == "Available");
                }
                else
                {
                    query = query.Where(p => p.CategoryId == categoryId);
                }

                // Apply pagination
                var skipResults = (pageNumber - 1) * pageSize;
                var paginatedProducts = await query
                    .Skip(skipResults ?? 0)
                    .Take(pageSize ?? 5)
                    .ToListAsync();

                if (paginatedProducts == null || !paginatedProducts.Any())
                {
                    return NotFound($"No products found for Category ID {categoryId}.");
                }

                return Ok(paginatedProducts);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"Error occurred while retrieving products for Category ID {categoryId}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving products.");
            }
        }


        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetProducts([FromQuery] int? pageNumber, [FromQuery] int? pageSize)
        {
            try
            {
                if (pageNumber <= 0 || pageSize <= 0)
                {
                    return BadRequest("Page number and page size must be greater than zero.");
                }

                var skipResults = (pageNumber - 1) * pageSize;
                var result = Database.Products
                    .Where(p => p.StockQuantity > 0 && p.Status == "Available")
                    .Skip(skipResults ?? 0)
                    .Take(pageSize ?? 5)
                    .AsQueryable();

                var productList = await result.ToListAsync();

                return Ok(productList);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Internal server Error fetching products.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("GetAllProducts")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetAllProducts([FromQuery] int? pageNumber, [FromQuery] int? pageSize)
        {
            try
            {
                if (pageNumber <= 0 || pageSize <= 0)
                {
                    return BadRequest("Page number and page size must be greater than zero.");
                }

                var skipResults = (pageNumber - 1) * pageSize;
                var result = Database.Products
                    .Skip(skipResults ?? 0)
                    .Take(pageSize ?? 5)
                    .AsQueryable();

                var productList = await result.ToListAsync();

                return Ok(productList);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Internal server Error fetching all products.");
                return StatusCode(500, "Internal server error.");
            }
        }


        [HttpGet("count")]
        [Authorize]
        public async Task<IActionResult> GetProductsCount()
        {
            try
            {
                var count = await Database.Products.CountAsync();
                return Ok(count);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Internal server Error fetching product count.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("count/search")]
        [Authorize]
        public async Task<IActionResult> SearchProductCount([FromQuery] string? search)
        {
            try
            {
                if (string.IsNullOrEmpty(search))
                {
                    // If no search term is provided, return the count of all products.
                    var totalCount = await Database.Products.CountAsync();
                    return Ok(totalCount);
                }

                // Count products that match the search term (case-insensitive).
                var count = await Database.Products
                    .Where(p => p.ProductName.Contains(search) || p.Description.Contains(search))
                    .CountAsync();

                return Ok(count);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error retrieving product count for search term.");
                return StatusCode(500, "Internal server error.");
            }
        }


        [HttpGet("Search")]
        [Authorize]
        public async Task<IActionResult> SearchProduct([FromQuery] string? search, [FromQuery] int? pageNumber, [FromQuery] int? pageSize)
        {
            try
            {
                if (pageNumber <= 0 || pageSize <= 0)
                {
                    return BadRequest("Page number and page size must be greater than zero.");
                }

                var userId = GetUserIdFromToken();

                var role = await (from user in Database.Users
                                  join userRole in Database.Roles on user.RoleId equals userRole.RoleId
                                  where user.UserId == userId
                                  select userRole.RoleName).FirstOrDefaultAsync();

                if (string.IsNullOrEmpty(search))
                {
                    return BadRequest("Search query cannot be empty.");
                }

                var query = Database.Products.AsQueryable();

                query = query.Where(p => p.ProductName.Contains(search) || p.Description.Contains(search));

                if (role == "Customer")
                {
                    query = query.Where(p => p.StockQuantity > 0 && p.Status == "Available");
                }

                return Ok(query);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Internal server error while trying to search product.");
                return StatusCode(500, "Internal server error.");
            }
        }


        [HttpGet("{Id}")]
        public async Task<IActionResult> GetProductById(Guid Id)
        {
            try
            {
                var result = await Database.Products
                    .Where(p => p.ProductId.ToString().ToLower() == Id.ToString().ToLower() && p.Status == "Available" && p.StockQuantity > 0)
                    .ToListAsync();

                if (!result.Any())
                {
                    return NotFound("Product not found.");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"Internal server Error fetching product with ID {Id}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpDelete("DeleteProducts")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> DeleteProduct(Guid guid)
        {
            try
            {
                var products = await Database.Products
                    .Where(p => p.ProductId == guid)
                    .ToListAsync();

                if (!products.Any())
                {
                    return NotFound("Product not found.");
                }

                foreach (var item in products)
                {
                    item.Status = "NotAvailable";
                }

                await Database.SaveChangesAsync();

                return Ok(await Database.Products.ToListAsync());
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"Internal server Error deleting product with ID {guid}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPost("AddProduct")]
        [DisableRequestSizeLimit]
        public IActionResult AddProduct()
        {
            try
            {
                var file = Request.Form.Files["image"];
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded.");
                }

                var folderName = "wwwroot/Images/";
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var fullPath = Path.Combine(pathToSave, fileName);
                var dbPath = Path.Combine(folderName, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                var productName = Request.Form["productName"];
                var description = Request.Form["description"];
                var price = decimal.Parse(Request.Form["price"]);
                var categoryId = int.Parse(Request.Form["categoryId"]);
                var stockQuantity = int.Parse(Request.Form["stockQuantity"]);
                var status = Request.Form["status"];

                var newProduct = new ProductsModel
                {
                    ProductName = productName,
                    Description = description,
                    Price = price,
                    CategoryId = categoryId,
                    StockQuantity = stockQuantity,
                    Status = status,
                    ImageUrl = $"/Images/{fileName}"
                };

                Database.Products.Add(newProduct);
                Database.SaveChanges();

                return Ok(new { success = true, message = "Product added successfully" });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Internal server Error adding product.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPatch("ModifyProduct")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> ModifyProduct()
        {
            try
            {
                var file = Request.Form.Files["image"];
                var folderName = "wwwroot/Images/";
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var productId = new Guid(Request.Form["ProductId"]);

                var product = await Database.Products.FirstOrDefaultAsync(p => p.ProductId == productId);

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Product not found." });
                }

                var productName = Request.Form["productName"];
                var description = Request.Form["description"];
                var price = decimal.Parse(Request.Form["price"]);
                var categoryId = int.Parse(Request.Form["categoryId"]);
                var stockQuantity = int.Parse(Request.Form["stockQuantity"]);
                var status = Request.Form["status"];

                product.ProductName = productName;
                product.Description = description;
                product.Price = price;
                product.CategoryId = categoryId;
                product.StockQuantity = stockQuantity;
                product.Status = status;

                if (file != null && file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    product.ImageUrl = $"/Images/{fileName}";
                }

                await Database.SaveChangesAsync();
                return Ok(new { success = true, message = "Product modified successfully" });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Internal server Error modifying product.");
                return StatusCode(500, "Internal server error.");
            }
        }

        public class ProductWithImageDto
        {
            public ProductsModel Product { get; set; }
            public IFormFile ImageFile { get; set; }
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
                Logger.LogError(ex, "Failed to extract UserId from token.");
                return Guid.Empty; // Return an empty GUID if there is an error
            }
        }
    }
}
