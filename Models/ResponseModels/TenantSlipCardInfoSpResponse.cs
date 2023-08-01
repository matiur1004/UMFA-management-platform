using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipCardInfoSpResponse
    {
        // // [JsonPropertyName("tenantSlipCardInfos")]
        public List<TenantSlipCardInfo> TenantSlipCardInfos { get; set; }
    }

    public class TenantSlipCardInfo
    {
        // // [JsonPropertyName("tenants")]
        public int Tenants { get; set; }

        // // [JsonPropertyName("shops")]
        public int Shops { get; set; }

        // // [JsonPropertyName("amount")]
        public decimal Amount { get; set; }
    }
}
