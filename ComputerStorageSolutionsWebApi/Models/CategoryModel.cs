using System.ComponentModel.DataAnnotations;

namespace ComputerStorageSolutions.Models
{
    public class CategoryModel
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        [StringLength(255)]
        public string Description { get; set; } = string.Empty;

    }
}

