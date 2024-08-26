using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace ComputerStorageSolutions.Models
{
    public class CartModel
    {
        [Key]
        public Guid CartId { get; set; }

        [ForeignKey(nameof(User))]
        public Guid userID { get; set; }

        [ForeignKey(nameof(Product))]
        public Guid Products { get; set; }

        [Required]
        public int Quantity { get; set; }

        [JsonIgnore]
        public virtual UserModel? User { get; set; }

        [JsonIgnore]
        public virtual ProductsModel? Product { get; set; }
    }
}
