using ClientPortal.Data.Entities.PortalEntities;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClientPortal.Data
{
    public class PortalDBContext : DbContext
    {
        private readonly IConfiguration? _configuration;

        public PortalDBContext() { }

        public PortalDBContext(DbContextOptions<PortalDBContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }

        // Not mapped entities
        [NotMapped]
        public DbSet<DemandProfileHeader> DemandProfileHeaders { get; set; }
        [NotMapped]
        public DbSet<DemandProfile> DemandProfiles { get; set; }
        [NotMapped]
        public DbSet<AMRWaterProfileHeader> AmrWaterProfiles { get; set; }
        [NotMapped]
        public DbSet<WaterProfile> WaterProfiles { get; set; }
        [NotMapped]
        public DbSet<AMRMetersNotScheduled> AMRMetersNotScheduled { get; set; }
        [NotMapped]
        public DbSet<AMRMeterList> AMRMeterList { get; set; }

        //Mapped entities
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Building> Buildings { get; set; }
        public DbSet<AMRMeter> AMRMeters { get; set; }
        public DbSet<AMRScadaUser> AMRScadaUsers { get; set; }
        public DbSet<Utility> Utilities { get; set; }
        public DbSet<MeterMakeModel> MetersMakeModels { get; set; }
        public DbSet<UtilitySupplier> UtilitySuppliers { get; set; }
        public DbSet<BuildingSupplierUtility> BuildingSupplierUtilities { get; set; }
        public DbSet<TOUHeader> TOUHeaders { get; set; }
        public DbSet<TOURegister> TOURegisters { get; set; }
        public DbSet<TOUHalfHour> TOUHalfHours { get; set; }
        public DbSet<TOUDaysOfWeek> TOUDaysOfWeeks { get; set; }
        public DbSet<TariffHeader> TariffHeaders { get; set; }
        public DbSet<TOUAllocation> TOUAllocations { get; set; }
        public DbSet<TOUSeason> TOUSeasons { get; set; }
        public DbSet<TOUDayType> TOUDayTypes { get; set; }
        public DbSet<TOUProfileAssignment> TOUProfileAssignments { get; set; }
        public DbSet<ScadaRequestHeader> ScadaRequestHeaders { get; set; }
        public DbSet<ScadaRequestDetail> ScadaRequestDetails { get; set; }
        public DbSet<ProfileData> ProfileData { get; set; }
        public DbSet<TOUSeasonMonth> TOUSeasonMonths { get; set; }
        public DbSet<TOUDayOfWeekDayType> TOUDayOfWeekDayTypes { get; set; }
        public DbSet<ScadaProfileData> ScadaProfileData { get; set; }
        public DbSet<ScadaReadingData> scadaReadingData { get; set; }
        public DbSet<RegisterType> RegisterTypes { get; set; }
        public DbSet<MappedMeter> MappedMeters { get; set; }
        public DbSet<SupplyType> SupplyTypes { get; set; }
        public DbSet<MeterLocation> MeterLocations { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<NotificationType> NotificationTypes { get; set; }
        public DbSet<UserNotifications> UserNotifications { get; set; }
        public DbSet<UserNotificationSchedule> UserNotificationSchedules { get; set; }
        public DbSet<UserNotificationSummaryType> UserNotificationSummaryTypes { get; set; }
        public DbSet<NotificationSendType> NotificationSendTypes { get; set; }
        public DbSet<ScheduleStatus> ScheduleStatus { get; set; }
        public DbSet<JobStatus> JobStatus { get; set; }
        public DbSet<AlarmType> AlarmTypes { get; set; }
        public DbSet<AlarmTriggerMethod> AlarmTriggerMethods { get; set; }
        public DbSet<AMRMeterAlarm> AMRMeterAlarms { get; set; }
        public DbSet<UserAMRMeterActiveNotification> UserAMRMeterActiveNotifications { get; set; }
        public DbSet<AMRMeterTriggeredAlarm> AMRMeterTriggeredAlarms { get; set; }
        public DbSet<TriggeredAlarmNotification> TriggeredAlarmNotifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //not mapped entities
            modelBuilder.Entity<DemandProfileHeader>().ToTable("DemandProfileHeaders", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<DemandProfile>().ToTable("DemandProfiles", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<AMRWaterProfileHeader>().ToTable("AMRWaterProfileHeaders", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<WaterProfile>().ToTable("WaterProfiles", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<AMRMetersNotScheduled>().HasNoKey().ToTable("AMRMetersNotScheduled", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<AMRMeterList>().ToTable("AMRMeterList", t => t.ExcludeFromMigrations());

            //mapped entities
            modelBuilder.Entity<RefreshToken>().HasOne(r => r.User).WithMany(r => r.RefreshTokens).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AMRMeter>().HasOne(a => a.User).WithMany(r => r.AmrMeters).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<AMRMeter>().HasOne(a => a.MakeModel).WithMany(r => r.AMRMeters).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AMRScadaUser>().HasOne(a => a.User).WithMany(r => r.AmrScadaUsers).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BuildingSupplierUtility>().HasOne(b => b.Building).WithMany(b => b.BuildingSupplierUtilities).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<BuildingSupplierUtility>().HasOne(b => b.UtilitySupplier).WithMany(b => b.BuildingSupplierUtilities).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<BuildingSupplierUtility>().HasOne(b => b.Utility).WithMany(b => b.BuildingSupplierUtilities).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MeterMakeModel>().HasOne(m => m.Utility).WithMany(r => r.MeterMakeModels).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TOUHeader>().HasOne(h => h.UtilitySupplier).WithMany(h => h.TOUHeaders).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TariffHeader>().HasOne(t => t.UtilitySupplier).WithMany(u => u.TariffHeaders).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TariffHeader>().HasOne(t => t.TOUHeader).WithMany(u => u.TariffHeaders).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TOUProfileAssignment>().HasOne(p => p.TOUHeader).WithMany(r => r.TOUProfileAssignments).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TOUProfileAssignment>().HasOne(p => p.TOUSeason).WithMany(r => r.TOUProfileAssignments).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TOUProfileAssignment>().HasOne(p => p.TOUDayType).WithMany(r => r.TOUProfileAssignments).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TOUProfileAssignment>().HasOne(p => p.TOUHalfHour).WithMany(r => r.TOUProfileAssigments).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TOUProfileAssignment>().HasOne(p => p.TOURegister).WithMany(r => r.TOUProfileAssignments).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TOUAllocation>().HasOne(a => a.TariffHeader).WithMany(r => r.TOUAllocations).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TOUAllocation>().HasOne(a => a.TOUDaysOfWeek).WithMany(r => r.TOUAllocations).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TOUAllocation>().HasOne(a => a.TOUHalfHour).WithMany(r => r.TOUAllocations).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TOUAllocation>().HasOne(a => a.TOURegister).WithMany(r => r.TOUAllocations).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ScadaRequestDetail>().HasOne(d => d.Header).WithMany(r => r.ScadaRequestDetails).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ScadaRequestDetail>().HasOne(d => d.AmrMeter).WithMany(r => r.ScadaRequestDetails).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ScadaRequestDetail>().HasOne(d => d.AmrScadaUser).WithMany(r => r.ScadaRequestDetails).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProfileData>().HasOne(d => d.AmrMeter).WithMany(r => r.ProfileData).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ProfileData>().HasOne(d => d.TouDaysOfWeek).WithMany(r => r.ProfileData).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ProfileData>().HasOne(d => d.TOUHalfHour).WithMany(r => r.ProfileData).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TOUSeason>().HasOne(s => s.TOUHeader).WithMany(r => r.TOUSeasons).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TOUSeasonMonth>().HasOne(sm => sm.TOUSeason).WithMany(r => r.TOUSeasonMonths).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TOUDayOfWeekDayType>().HasOne(dt => dt.TOUDaysOfWeek).WithMany(r => r.TOUDayOfWeekDayTypes).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TOUDayOfWeekDayType>().HasOne(dt => dt.TOUDayType).WithMany(r => r.TOUDayOfWeekDayTypes).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TOUDayOfWeekDayType>().HasOne(dt => dt.TOUHeader).WithMany(r => r.TOUDayOfWeekDayTypes).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AMRMeterTriggeredAlarm>().HasOne(at => at.AMRMeterAlarm).WithMany(a => a.AMRMeterTriggeredAlarms).OnDelete(DeleteBehavior.NoAction);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _configuration.GetConnectionString("APIDb");
            optionsBuilder.UseSqlServer(connectionString);
        }

    }
}
