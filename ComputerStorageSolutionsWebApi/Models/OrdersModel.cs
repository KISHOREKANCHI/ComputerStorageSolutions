using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ComputerStorageSolutions.Models
{
    public class OrdersModel
    {
        [Key]
        public Guid OrderId { get; set; }

        [ForeignKey(nameof(Users))]
        public Guid UserId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalAmount { get; set; }

        [StringLength(50)]
        public string OrderStatus { get; set; } = string.Empty;

        [StringLength(255)]
        public string ShippingAddress { get; set; } = string.Empty;

        [JsonIgnore]
        public virtual UserModel? Users { get; set; }
    }
}