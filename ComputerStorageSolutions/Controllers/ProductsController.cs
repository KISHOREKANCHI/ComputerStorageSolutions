using ComputerStorageSolutions.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
            FLashDrives = 3,
            MemoryCards = 4,

        }

        [HttpGet]
        [Authorize]
        public IActionResult GetProducts()
        {
            var result = (from Products in Database.Products
                          select Products).ToList();
            return Ok(result);
        }

        [HttpGet]
        [Authorize]
        [Route("Categories")]
        public IActionResult GetCategories(CategoryList CategoryList)
        {

            var result = (from Products in Database.Products
                          where ((Products.CategoryId == (int)CategoryList) && (Products.Status == "Available"))
                          select Products).ToList();
            return Ok(result);
        }

        [HttpDelete]
        [Authorize(Policy = SecurityPolicy.Admin)]
        [Route("DeleteProducts")]
        public IActionResult DeleteProduct(Guid Guid)
        {
            var result = (from Products in Database.Products
                          where Products.ProductId == Guid
                          select Products
                          );
            foreach (var item in result)
            {
                item.Status = "NotAvailable";
                /*
                stock quantity is not set to 0 bcz sometimes admin might not want to display product even thought its available
                item.StockQuantity = 0;
                */
            }
            Database.SaveChanges();
            return Ok(Database.Products.ToList());
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPost("AddProduct")]
        public IActionResult AddProduct([FromBody] ProductsModel Product)
        {
            Database.Products.Add(Product);
            Database.SaveChanges();
            return Ok(Database.Products.ToList());
        }

        [Authorize(Policy = SecurityPolicy.Admin)]
        [HttpPatch("ModifyProduct")]
        public IActionResult ModifyProduct([FromBody] ProductsModel Product)
        {
            var result = from product in Database.Products
                         where product.ProductId == Product.ProductId
                         select product;
            foreach (var item in result)
            {
                item.ProductName = Product.ProductName;
                item.CategoryId = Product.CategoryId;
                item.Description = Product.Description;
                item.Price = Product.Price;
                item.StockQuantity = Product.StockQuantity;
                item.ImageUrl = Product.ImageUrl;
                item.Status = Product.Status;
            }
            Database.SaveChanges();
            return Ok(Database.Products.ToList());
        }
    }
}
