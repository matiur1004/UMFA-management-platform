namespace ClientPortal.Models.ResponseModels
{
    public class ShopCostVarianceSpResponse
    {
        public List<ShopCostVariance> ShopCostVariances { get; set; }
    }
    public class ShopCostVariance
    {
        public string ShopId { get; set; }
        public string Shop { get; set; }
        public string Tenants { get; set; }
        public DateTime OccDTM { get; set; }
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public string GroupName { get; set; }
        public int GroupId { get; set; }
        public decimal? RandValue { get; set; }
        public bool Recoverable { get; set; }
    }
}
