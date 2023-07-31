using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class UMFAShopsSpResponse
    {
        [JsonPropertyName("shops")]
        public List<UMFAShop> Shops { get; set; }
    }

    public class UMFAShop
    {
        [JsonPropertyName("shopId")]
        public int ShopId { get; set; }

        [JsonPropertyName("shopNr")]
        public string ShopNr { get; set; }

        [JsonPropertyName("shopName")]
        public string ShopName { get; set; }
    }
}
