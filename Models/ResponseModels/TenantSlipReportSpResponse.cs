using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipReportSpResponse
    {
        [JsonPropertyName("slips")]
        public List<TenantSlipReport> Slips { get; set; }
    }

    public class TenantSlipReport
    {
        [JsonPropertyName("tenantID")]
        public int? TenantID { get; set; }

        [JsonPropertyName("accountId")]
        public int? AccountId { get; set; }

        [JsonPropertyName("periodID")]
        public int? PeriodID { get; set; }

        [JsonPropertyName("shopID")]
        public int? ShopID { get; set; }

        [JsonPropertyName("splitIndicator")]
        public int? SplitIndicator { get; set; }

        [JsonPropertyName("tenantName")]
        public string? TenantName { get; set; }

        [JsonPropertyName("units")]
        public string? Units { get; set; }

        [JsonPropertyName("excl")]
        public decimal? Excl { get; set; }

        [JsonPropertyName("vat")]
        public decimal? Vat { get; set; }

        [JsonPropertyName("incl")]
        public decimal? Incl { get; set; }
    }
}
