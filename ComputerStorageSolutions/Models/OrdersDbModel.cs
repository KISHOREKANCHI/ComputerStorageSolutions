using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ComputerStorageSolutions.Models
{
    public class OrdersDbModel
    {
        [Key]
        public Guid OrderId { get; set; }

        [ForeignKey(nameof(Users))]
        public Guid UserId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]

        [StringLength(50)]
        public string OrderStatus { get; set; } = string.Empty;

        [StringLength(255)]
        public string ShippingAddress { get; set; } = string.Empty;

        [JsonIgnore]
        public virtual UserDbModel? Users { get; set; }
        /*public ICollection<OrderDetailsDbModel> Details { get; set; } = new List<OrderDetailsDbModel>();

        public ICollection<InvoicesDbModel> Invoices { get; set; } = new List<InvoicesDbModel>();*/
    }
}
