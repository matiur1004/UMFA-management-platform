namespace ClientPortal.Models.ResponseModels
{
    public class ShopDashboardResponse
    {
        public List<ShopDashboardPeriodBilling> LatestPeriodBillings { get; set; }
        public List<ShopDashboardPeriodBilling> PeriodBillings { get; set; }
        public List<ShopDashboardOccupationInfo> Occupations { get; set; }
        public List<ShopDashboardReadingInfo> Readings { get; set; }

        public ShopDashboardResponse(UmfaShopDashboardResponse source) 
        {
            Occupations = source.Occupations;
            Readings = source.Readings;
            LatestPeriodBillings = source.PeriodBillings.Where(pb => pb.PeriodID.Equals(source.PeriodBillings.Max(pb => pb.PeriodID))).ToList();
            PeriodBillings = source.PeriodBillings;
        }
    }

    public class ShopDashboardPeriodBilling
    {
        public int Id { get; set; }
        public int ShopID { get; set; }
        public int GroupID { get; set; }
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public string GroupName { get; set; }
        public double Usage { get; set; }
        public decimal Amount { get; set; }
    }

    public class ShopDashboardOccupationInfo
    {
        public int Id { get; set; }
        public int NoOfOccupants { get; set; }
        public int LastTenantId { get; set; }
        public string LastTenantName { get; set; }
        public int SharedMeters { get; set; }
        public int DirectMeters { get; set; }
    }

    public class ShopDashboardReadingInfo
    {
        public string ReadingMethod { get; set; }
        public int NoOfReadings { get; set; }
        public int HasImages { get; set; }
    }
}
