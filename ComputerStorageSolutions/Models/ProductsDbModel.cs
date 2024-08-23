using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ComputerStorageSolutions.Models
{
    public class ProductsDbModel
    {
        [Key]
        public Guid ProductId { get; set; }

        [Required]
        [StringLength(100)]
        public string ProductName { get; set; } = string.Empty;

        [ForeignKey(nameof(Category))]
        public int CategoryId { get; set; }

        [StringLength(255)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Price { get; set; }

        [Required]
        public int StockQuantity { get; set; }

        [StringLength(255)]
        public string ImageUrl { get; set; } = string.Empty;

        [JsonIgnore]
        public virtual CategoryDbModel? Category { get; set; }

        /*public virtual ICollection<OrderDetailsDbModel> OrderDetails { get; set; } = new List<OrderDetailsDbModel>();*/
    }
}
