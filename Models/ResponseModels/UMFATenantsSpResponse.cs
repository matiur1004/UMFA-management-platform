using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class UMFATenantsSpResponse
    {
        [JsonPropertyName("tenants")]
        public List<UMFATenant> Tenants { get; set; }
    }

    public class UMFATenant
    {
        [JsonPropertyName("tenantId")]
        public int TenantId { get; set; }

        [JsonPropertyName("tenantName")]
        public string TenantName { get; set; }
        
        [JsonPropertyName("description")]
        public string Description { get; set; }
    }
}
