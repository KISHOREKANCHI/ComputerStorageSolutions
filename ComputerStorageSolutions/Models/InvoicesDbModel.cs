using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ComputerStorageSolutions.Models
{
    public class InvoicesDbModel
    {
        [Key]
        public Guid InvoiceID { get; set; }

        [ForeignKey(nameof(Orders))]
        public Guid OrderId { get; set; }

        [Required]
        public DateTime InvoiceDate { get; set; }

        [StringLength(255)]
        public string BillingAddress { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalAmount { get; set; }

        [JsonIgnore]
        public virtual OrdersDbModel? Orders { get; set; }
    }
}
