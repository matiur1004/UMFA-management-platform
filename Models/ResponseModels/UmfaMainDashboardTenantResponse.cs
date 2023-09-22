namespace ClientPortal.Models.ResponseModels
{
    public class UmfaMainDashboardTenantResponse
    {
        public MainDashBoardTenantShop Shops { get; set; }
        public MainDashBoardTenantTenant Tenants { get; set; }
        public List<MainDashBoardTenantGraphStat> Stats { get; set; }
        public List<int> BuildingServiceIds { get; set; }
    }
    public class MainDashBoardTenantShop
    {
        public int NumberOfShops { get; set; }
        public double OccupiedPercentage { get; set; }
        public double TotalArea { get; set; }
    }

    public class MainDashBoardTenantTenant
    {
        public int NumberOfTenants { get; set; }
        public double OccupiedPercentage { get; set; }
        public double RecoverablePercentage { get; set; }

    }

    public class MainDashBoardTenantGraphStat
    {
        public string PeriodName { get; set; }
        public decimal TotalBilled { get; set; }
        public double TotalElectricityUsage { get; set; }
        public double TotalWaterUsage { get; set; }
    }

    public class MainDashBoardTenantBuildingServiceId
    {
        public int BuildingServiceId { get; set; }
    }

}
