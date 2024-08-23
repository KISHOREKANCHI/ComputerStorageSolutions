using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

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
            [Display(Name = "SSD")]
            SSD = 1,
            [Display(Name = "HDD")]
            HDD = 2,
            [Display(Name = "Flash Drives")]
            FLashDrives = 3,
            [Display(Name = "Memory Cards")]
            MemoryCards = 4,
        }

        [HttpGet(Name = "CategoryList")]


        public ActionResult GetCategories(CategoryList CategoryList)
        {
            var result = (from Products in Database.Products
                          where Products.CategoryId == (int)CategoryList
                          select Products).ToList();
            return Ok(result);


        }
    }
}
