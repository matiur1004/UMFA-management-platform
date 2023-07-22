namespace ClientPortal.Models.ResponseModels
{
    public class ShopUsageVarianceSpResponse
    {
        public List<ShopUsageVariance> ShopUsageVariances { get; set; }
    }
    public class ShopUsageVariance
    {
        public string ShopId { get; set; }
        public string Shop { get; set; }
        public string Tenants { get; set; }
        public DateTime OccDTM { get; set; }
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public string InvGroup { get; set; }
        public decimal? UsageValue { get; set; }
        public bool Recoverable { get; set; }
    }

}
