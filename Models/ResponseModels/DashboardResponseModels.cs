using ClientPortal.Migrations;

namespace ClientPortal.Models.ResponseModels
{
    public class DashboardMainResponse
    {
        public string Response { get; set; }
        public DashboardBuildingStat BuildingStats { get; set; }
        public DashboardShopStat ShopStats { get; set; }
        public DashboardTenantStat TenantStats { get; set; }
        public DashboardSmartStat SmartStats { get; set; }
        public List<DashboardGraphStat> GraphStats { get; set; }
    }

    public class DashboardBuildingStat
    {
        public int NumberOfBuildings { get; set; }
        public decimal TotalGLA { get; set; }
        public int TotalNumberOfMeters { get; set; }
    }

    public class DashboardShopStat
    {
        public int NumberOfShops { get; set; }
        public decimal OccupiedPercentage { get; set; }
        public decimal TotalArea { get; set; }
    }

    public class DashboardTenantStat
    {
        public int NumberOfTenants { get; set; }
        public decimal OccupiedPercentage { get; set; }
        public decimal RecoverablePercentage { get; set; }
    }

    public class DashboardSmartStat
    {
        public int TotalSmart { get; set; }
        public int SolarCount { get; set; }
        public int GeneratorCount { get; set; }
        public int ConsumerElectricityCount { get; set; }
        public int ConsumerWaterCount { get; set; }
        public int BulkCount { get; set; }
        public int CouncilChkCount { get; set; }
        public int AlarmsConfigured { get; set; } = 0;
        public int AlarmsTriggered { get; set; } = 0;
    }

    public class DashboardGraphStat
    {
        public string PeriodName { get; set; }
        public decimal TotalSales { get; set; }
        public decimal TotalElectricityUsage { get; set; }
        public decimal TotalWaterUsage { get; set; }
    }

    public class DashboardBuilding
    {
        public int UmfaBuildingId { get; set; }
        public string BuildingName { get; set; }
        public int PartnerId { get; set; }
        public string PartnerName { get; set; }
        public bool IsSmart { get; set; }
    }

    public class BuildingDashboard
    {
        public string NumberOfBuildings { get; set; }
        public decimal TotalGLA { get; set; }
        public int TotalNumberOfMeters { get; set; }
        public int NumberOfShops { get; set; }
        public decimal ShopOccPerc { get; set; }
        public decimal TotalArea { get; set; }
        public int NumberOfTenants { get; set; }
        public decimal TenOccPerc { get; set; }
        public decimal RecoverablePercentage { get; set; }
        public int TotalSmart { get; set; }
        public int SolarCount { get; set; }
        public int GeneratorCount { get; set; }
        public int ConsumerElectricityCount { get; set; }
        public int ConsumerWaterCount { get; set; }
        public int BulkCount { get; set; }
        public int CouncilChkCount { get; set; }
        public string PeriodName { get; set; }
        public decimal TotalSales { get; set; }
        public decimal TotalElectricityUsage { get; set; }
        public decimal TotalWaterUsage { get; set; }
    }

}