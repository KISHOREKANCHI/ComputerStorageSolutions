using System.ComponentModel.DataAnnotations;

namespace ComputerStorageSolutions.Models
{
    public class RoleModel
    {
        [Key]
        public Guid RoleId { get; set; }

        [Required]
        [StringLength(50)]
        public string RoleName { get; set; } = string.Empty;

        // Navigation property
        /*public virtual ICollection<UserDbModel> Users { get; set; } = new List<UserDbModel>();*/
    }
}
