namespace ClientPortal.Models.ResponseModels
{
    public class UmfaTenantMainDashboardResponse
    {
        public List<UmfaTenantMainDashboardBillingData> BillingData { get; set; }
        public List<UmfaTenantMainDashboardCardInfo> CardInfos { get; set; }
        public List<UmfaTenantMainDashboardShop> Shops { get; set; }
        public List<UmfaTenantMainDashboardReadingInfo> ReadingsInfo { get; set; }
    }

    public class UmfaTenantMainDashboardBillingData
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int GroupID { get; set; }
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public string GroupName { get; set; }
        public string Utility { get; set; }
        public double Usage { get; set; }
        public decimal Amount { get; set; }
    }

    public class UmfaTenantMainDashboardCardInfo
    {
        public int Id { get; set; }
        public int NoOfShops { get; set; }
        public int LastShopId { get; set; }
        public string LastShopNr { get; set; }
        public int SharedMeters { get; set; }
        public int DirectMeters { get; set; }
    }

    public class UmfaTenantMainDashboardShop
    {
        public int ShopID { get; set; }
        public string ShopNr { get; set; }
        public DateTime OccupationDTM { get; set; }
        public DateTime? VacationDTM { get; set; }
    }

    public class UmfaTenantMainDashboardReadingInfo
    {
        public string ReadingMethod { get; set; }
        public int NoOfReadings { get; set; }
        public int HasImages { get; set; }
    }
}
