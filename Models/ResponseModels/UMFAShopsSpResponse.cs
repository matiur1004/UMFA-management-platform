namespace ClientPortal.Models.ResponseModels
{
    public class UMFAShopsSpResponse
    {
        public List<UMFAShop> Shops { get; set; }
    }

    public class UMFAShop
    {
        public int ShopId { get; set; }
        public string ShopNr { get; set; }
        public string ShopName { get; set; }
    }
}
