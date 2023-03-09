using ClientPortal.Data.Entities.DunamisEntities;
using ClientPortal.Data.Entities.PortalEntities;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClientPortal.Data
{
    public class DunamisDBContext: DbContext
    {
        private readonly IConfiguration? _configuration;

        public DunamisDBContext() { }

        public DunamisDBContext(DbContextOptions<DunamisDBContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }

        // Not Mapped Entities
        [NotMapped]
        public DbSet<SuppliesTo> SuppliesTo { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Not Mapped Entities
            modelBuilder.Entity<SuppliesTo>().ToTable("SuppliesTo", t => t.ExcludeFromMigrations());

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _configuration.GetConnectionString("DunamisDb");
            optionsBuilder.UseSqlServer(connectionString);
        }

    }
}
