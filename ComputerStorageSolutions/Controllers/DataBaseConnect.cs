using Microsoft.EntityFrameworkCore;
using ComputerStorageSolutions.Models;
using System.Collections.Generic;

namespace ComputerStorageSolutions.Controllers
{
    public class DataBaseConnect : DbContext
    {
        public DataBaseConnect(DbContextOptions<DataBaseConnect> options) : base(options) { }
        public DbSet<UserDbModel> Users { get; set; }

        public DbSet<CategoryDbModel> Categories { get; set; }

        public DbSet<ProductsDbModel> Products { get; set; }

        public DbSet<RoleDbModel> Roles { get; set; }
    }

}
