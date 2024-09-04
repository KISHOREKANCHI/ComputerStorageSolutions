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
            var skipResults = (pageNumber - 1) * pageSize;

            var result = Database.Products
                .Where(p => p.StockQuantity > 0 && p.Status == "Available").AsQueryable();
            result = result.Skip(skipResults ?? 0).Take(pageSize ?? 5);
            await result.ToListAsync();
            return Ok(result);
        }

        [HttpGet("GetAllProducts")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> GetAllProducts()
        {
            var result = Database.Products;
            await result.ToListAsync();
            return Ok(result);
        }

        [HttpGet]
        [Route("count")]
        [Authorize]
        public async Task<IActionResult> GetProductsCount()
        {
            var count = await Database.Products.CountAsync();
            return Ok(count);
        }

        [HttpGet]
        /*[Authorize]*/
        [Route("Id")]
        public async Task<IActionResult> GetProductById(Guid Id)
        {
            var result = await Database.Products
                .Where(p => p.ProductId == Id && p.Status == "Available" && p.StockQuantity > 0)
                .ToListAsync();
            return Ok(result);
        }

        [HttpDelete("DeleteProducts")]
        [Authorize(Policy = SecurityPolicy.Admin)]
        public async Task<IActionResult> DeleteProduct(Guid guid)
        {
            var products = await Database.Products
                .Where(p => p.ProductId == guid)
                .ToListAsync();

            foreach (var item in products)
            {
                item.Status = "NotAvailable";
                // StockQuantity is not set to 0 because sometimes admin might not want to display the product even if it is available
            }

            await Database.SaveChangesAsync();
            return Ok(await Database.Products.ToListAsync());
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPost("AddProduct")]
        [DisableRequestSizeLimit]
        public IActionResult AddProduct()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = "wwwroot/Images/";
                var PathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(PathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    // Get additional form data
                    var productName = Request.Form["productName"];
                    var description = Request.Form["description"];
                    var price = decimal.Parse(Request.Form["price"]);
                    var categoryId = int.Parse(Request.Form["categoryId"]);
                    var stockQuantity = int.Parse(Request.Form["stockQuantity"]);
                    var status = Request.Form["status"];

                    // Create a new product model
                    var newProduct = new ProductsModel
                    {
                        ProductName = productName,
                        Description = description,
                        Price = price,
                        CategoryId = categoryId,
                        StockQuantity = stockQuantity,
                        Status = status,
                        ImageUrl = $"/Images/{fileName}" // Save the relative path or URL
                    };


                    Database.Products.Add(newProduct);
                    Database.SaveChanges(); // Save changes to the database
                    

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest("No file uploaded.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        /*public async Task<IActionResult> AddProduct(
    [FromForm] IFormFile image,
    [FromForm] string productName,
    [FromForm] string description,
    [FromForm] decimal price,
    [FromForm] int categoryId,
    [FromForm] int stockQuantity,
    [FromForm] string status)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("Please upload an image.");
            }
            // Save the image to the server
            var imagePath = Path.Combine("wwwroot/Images/", image.FileName);
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // Save the product to the database
            await Database.Products.AddAsync(new ProductsModel
            {
                ProductName = productName,
                Description = description,
                Price = price,
                CategoryId = categoryId,
                StockQuantity = stockQuantity,
                Status = status,
                ImageUrl = $"/images/{image.FileName}" // Save the relative path or URL
            });
            await Database.SaveChangesAsync();

            return Ok(await Database.Products.ToListAsync());
        }*/

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPatch("ModifyProduct")]
        public async Task<IActionResult> ModifyProduct([FromBody] ProductsModel product)
        {
            var result = await Database.Products
                .Where(p => p.ProductId == product.ProductId)
                .ToListAsync();

            foreach (var item in result)
            {
                item.ProductName = product.ProductName;
                item.CategoryId = product.CategoryId;
                item.Description = product.Description;
                item.Price = product.Price;
                item.StockQuantity = product.StockQuantity;
                item.ImageUrl = product.ImageUrl;
                item.Status = product.Status;
            }

            await Database.SaveChangesAsync();
            return Ok(await Database.Products.ToListAsync());
        }

        public class ProductWithImageDto
        {
            public ProductsModel Product { get; set; }
            public IFormFile ImageFile { get; set; }
        }

    }
}
