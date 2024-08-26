using ComputerStorageSolutions.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DataBaseConnect Database;

        public ProductsController(DataBaseConnect _Database)
        {
            Database = _Database;
        }

        public enum CategoryList
        {

            SSD = 1,
            HDD = 2,
            FlashDrives = 3,
            MemoryCards = 4,
        }

        [HttpGet]
<<<<<<< Updated upstream:ComputerStorageSolutionsWebApi/Controllers/ProductsController.cs
        [Authorize]
        public IActionResult GetProducts()
=======
        public async Task<IActionResult> GetProducts()
>>>>>>> Stashed changes:ComputerStorageSolutions/Controllers/ProductsController.cs
        {
            var result = await Database.Products.ToListAsync();
            return Ok(result);
        }

<<<<<<< Updated upstream:ComputerStorageSolutionsWebApi/Controllers/ProductsController.cs
        [HttpGet]
        [Authorize]
        [Route("Categories")]
        public IActionResult GetCategories(CategoryList CategoryList)
        {

            var result = (from Products in Database.Products
                          where ((Products.CategoryId == (int)CategoryList) && (Products.Status == "Available"))
                          select Products).ToList();
=======
        [HttpGet("Categories")]
        public async Task<IActionResult> GetCategories(CategoryList categoryList)
        {
            var result = await Database.Products
                .Where(p => p.CategoryId == (int)categoryList && p.Status == "Available")
                .ToListAsync();
>>>>>>> Stashed changes:ComputerStorageSolutions/Controllers/ProductsController.cs
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
        public async Task<IActionResult> AddProduct([FromBody] ProductsModel product)
        {
            await Database.Products.AddAsync(product);
            await Database.SaveChangesAsync();
            return Ok(await Database.Products.ToListAsync());
        }

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
<<<<<<< Updated upstream:ComputerStorageSolutionsWebApi/Controllers/ProductsController.cs
            Database.SaveChanges();
            return Ok(Database.Products.ToList());
=======

            await Database.SaveChangesAsync();
            return Ok(await Database.Products.ToListAsync());
>>>>>>> Stashed changes:ComputerStorageSolutions/Controllers/ProductsController.cs
        }
    }
}
