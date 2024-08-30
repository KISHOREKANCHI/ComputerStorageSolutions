using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ComputerStorageSolutions.Models
{
    public class UserModel
    {
        [Key]
        public Guid UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [ForeignKey(nameof(Role))]
        public Guid RoleId { get; set; }

        public DateTime CreatedDate { get; set; }

        [Required]
        public bool IsActive { get; set; }

        [JsonIgnore]
        public virtual RoleModel? Role { get; set; }
    }

}
