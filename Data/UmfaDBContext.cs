using ClientPortal.Data.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClientPortal.Data
{
    public class UmfaDBContext : DbContext
    {
        private readonly IConfiguration _configuration;

        [NotMapped]
        public DbSet<PortalStats> GetStats { get; set; }
        [NotMapped]
        public DbSet<UMFABuilding> UmfaBuildings { get; set; }
        [NotMapped]
        public DbSet<UMFAPartner> UmfaPartners { get; set; }
        [NotMapped]
        public DbSet<UMFAPeriod> UMFAPeriods { get; set; }
        [NotMapped]
        public DbSet<UMFABuildingService> UMFABuildingServices { get; set; }
        [NotMapped]
        public DbSet<spCall> CallaProc { get; set; }

        public UmfaDBContext() {}

        public UmfaDBContext(IConfiguration configuration) : base()
        {
            _configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _configuration.GetConnectionString("UmfaDb");
            optionsBuilder.UseSqlServer(connectionString);
        }
    }

    [Serializable]
    [Keyless]
    public class spCall
    {

    }
}
