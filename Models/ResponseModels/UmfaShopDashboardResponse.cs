namespace ClientPortal.Models.ResponseModels
{
    public class UmfaShopDashboardResponse
    {
        public List<ShopDashboardPeriodBilling> PeriodBillings { get; set; }
        public List<ShopDashboardOccupationInfo> Occupations { get; set; }
        public List<ShopDashboardReadingInfo> Readings { get; set; }
    }
}
