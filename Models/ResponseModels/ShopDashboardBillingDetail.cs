namespace ClientPortal.Models.ResponseModels
{
    public class ShopDashboardBillingDetail
    {
        public int ShopID { get; set; }
        public bool Occupied { get; set; }
        public string ShopNr { get; set; }
        public string ShopName { get; set; }
        public string ShopDescription { get; set; }
        public double ShopArea { get; set; }
        public bool ShopActive { get; set; }
        public int NoOfOccupations { get; set; }
    }
}
