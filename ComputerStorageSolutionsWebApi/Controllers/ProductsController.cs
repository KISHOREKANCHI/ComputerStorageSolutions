using ComputerStorageSolutions.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using static ComputerStorageSolutions.Controllers.ProductsController;
using static System.Net.Mime.MediaTypeNames;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DataBaseConnect Database;
        private readonly ILogger<ProductsController> Logger;

        public ProductsController(DataBaseConnect _Database, ILogger<ProductsController> _Logger)
        {
            Database = _Database;
            Logger = _Logger;
        }

        public enum CategoryList
        {
            SSD = 1,
            HDD = 2,
            FlashDrives = 3,
            MemoryCards = 4,
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
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var result = await Database.Products.ToListAsync();
                return Ok(result);
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

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetProductById(Guid Id)
        {
            try
            {
                var result = await Database.Products
                    .Where(p => p.ProductId == Id && p.Status == "Available" && p.StockQuantity > 0)
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
    }
}
