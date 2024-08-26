using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ComputerStorageSolutions.Models
{
    public class OrderDetailsModel
    {
        [Key]
        public Guid OrderDetailId { get; set; }

        [ForeignKey(nameof(Orders))]
        public Guid OrderId { get; set; }

        [ForeignKey(nameof(Products))]
        public Guid ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal UnitPrice { get; set; }

        [JsonIgnore]
        public virtual OrdersModel? Orders { get; set; }
        [JsonIgnore]
        public virtual ProductsModel? Products { get; set; }

    }
}