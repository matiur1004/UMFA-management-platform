namespace ClientPortal.Models.ResponseModels
{
    public class UmfaShopDashboardAssignedMeter
    {
        public int ShopID { get; set; }
        public int BuildingServiceID { get; set; }
        public string MeterNo { get; set; }
        public string Direct { get; set; }
        public string AssType { get; set; }
        public string InvGroup { get; set; }
        public string ReconCategory { get; set; }
        public DateTime FirstBillingDate { get; set; }
        public DateTime LastBillingDate { get; set; }
        public bool IsActive { get; set; }
        public string UsageHistory { get; set; }
    }
}
