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
        private readonly ILogger<ProductsController> Logger;
        private readonly ITokenService tokenService;

        public ProductsController(DataBaseConnect _Database, ILogger<ProductsController> _Logger, ITokenService _tokenService)
        {
            Database = _Database;
            Logger = _Logger;
            tokenService = _tokenService;
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
        public async Task<IActionResult> GetProducts()
        {
            var result = await Database.Products.ToListAsync();
            return Ok(result);
        }

        /*[HttpGet]
        [Authorize]
        [Route("Categories")]
        public async Task<IActionResult> GetCategories(CategoryList categoryList)
        {
            var result = await Database.Products
                .Where(p => p.CategoryId == (int)categoryList && p.Status == "Available")
                .ToListAsync();
            return Ok(result);
        }*/

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

            await Database.SaveChangesAsync();
            return Ok(await Database.Products.ToListAsync());
        }
    }
}
