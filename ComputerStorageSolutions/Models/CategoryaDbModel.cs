using System.ComponentModel.DataAnnotations;

namespace ComputerStorageSolutions.Models
{
    public class CategoryDbModel
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        [StringLength(255)]
        public string Description { get; set; } = string.Empty;

        /*public virtual ICollection<ProductsDbModel> Products { get; set; } = new List<ProductsDbModel>();*/
    }
}

