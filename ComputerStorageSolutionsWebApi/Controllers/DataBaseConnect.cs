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
        public DbSet<OrdersModel> Orders { get; set; }
        public DbSet<OrderDetailsModel> OrderDetails { get; set; }
        public DbSet<InvoicesModel> Invoices { get; set; }

        public DbSet<CartModel> Cart { get; set; }
    }
}
