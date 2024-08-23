using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ComputerStorageSolutions.Models
{
    public class OrderDetailsDbModel
    {
        [Key]
        public Guid InvoiceId { get; set; }

        [ForeignKey(nameof(Orders))]
        public Guid OrderId { get; set; }

        [ForeignKey(nameof(Products))]
        public Guid ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalAmount { get; set; }

        [JsonIgnore]
        public virtual OrdersDbModel? Orders { get; set; }
        [JsonIgnore]
        public virtual ProductsDbModel? Products { get; set; }

    }
}
