using Microsoft.EntityFrameworkCore;
using ComputerStorageSolutions.Models;

namespace ComputerStorageSolutions.Controllers
{
    public class DataBaseConnect : DbContext
    {
        public DataBaseConnect(DbContextOptions<DataBaseConnect> options) : base(options) { }
        public DbSet<UserModel> Users { get; set; }

        public DbSet<CategoryModel> Categories { get; set; }

        public DbSet<ProductsModel> Products { get; set; }

        public DbSet<RoleModel> Roles { get; set; }
    }

}
