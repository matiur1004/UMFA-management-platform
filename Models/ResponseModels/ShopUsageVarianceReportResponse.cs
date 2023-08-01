using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class ShopUsageVarianceReportResponse
    {
        // // [JsonPropertyName("tenantShopInvoiceGroupings")]
        public List<TenantShopInvoiceUsageGrouping> TenantShopInvoiceGroupings { get; set; } = new List<TenantShopInvoiceUsageGrouping>();

        // // [JsonPropertyName("totals")]
        public List<PeriodTotalUsageDetails> Totals { get; set; } = new List<PeriodTotalUsageDetails>();

        // // [JsonPropertyName("periodList")]
        public List<string> PeriodList { get; set; }
    }

    public class TenantShopInvoiceUsageGrouping
    {
        // // [JsonPropertyName("invGroup")]
        public string InvGroup { get; set; }

        // // [JsonPropertyName("shopId")]
        public string ShopId { get; set; }

        // // [JsonPropertyName("shop")]
        public string Shop { get; set; }

        // // [JsonPropertyName("tenants")]
        public string Tenants { get; set; }

        // // [JsonPropertyName("occDTM")]
        public DateTime OccDTM { get; set; }

        // // [JsonPropertyName("average")]
        public decimal? Average { get; set; }

        // // [JsonPropertyName("variance")]
        public string? Variance { get; set; }

        // // [JsonPropertyName("recoverable")]
        public bool Recoverable { get; set; }

        // // [JsonPropertyName("periodUsageDetails")]
        public List<PeriodUsageDetail> PeriodUsageDetails { get; set; } = new List<PeriodUsageDetail>();
    }

    public class PeriodTotalUsageDetails
    {
        // // [JsonPropertyName("invGroup")]
        public string? InvGroup { get; set; }

        // // [JsonPropertyName("periodUsageDetails")]
        public List<PeriodUsageDetail> PeriodUsageDetails { get; set; } = new List<PeriodUsageDetail>();

        // // [JsonPropertyName("average")]
        public decimal? Average { get; set; }

        // // [JsonPropertyName("variance")]
        public string Variance { get; set; }
    }

    public class PeriodUsageDetail
    {
        // // [JsonPropertyName("periodId")]
        public int PeriodId { get; set; }

        // // [JsonPropertyName("periodName")]
        public string PeriodName { get; set; }

        // // [JsonPropertyName("usage")]
        public decimal? Usage { get; set; }
    }
}
