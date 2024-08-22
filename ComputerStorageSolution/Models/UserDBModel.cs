using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace ComputerStorageSolutions.Models
{
    public class UserDbModel
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [ForeignKey("Role")]
        public int RoleId { get; set; }

        public DateTime CreatedDate { get; set; }

        [Required]
        public bool IsActive { get; set; }

        // Navigation property
        public virtual RoleDbModel Role { get; set; }
    }

}
