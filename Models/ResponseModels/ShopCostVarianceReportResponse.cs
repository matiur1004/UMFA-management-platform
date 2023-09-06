using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class ShopCostVarianceReportResponse
    {
        // // [JsonPropertyName("tenantShopInvoiceGroupings")]
        public List<TenantShopInvoiceCostGrouping> TenantShopInvoiceGroupings { get; set; } = new List<TenantShopInvoiceCostGrouping>();

        // // [JsonPropertyName("totals")]
        public List<PeriodTotalCostDetails> Totals { get; set; } = new List<PeriodTotalCostDetails>();

        // // [JsonPropertyName("periodList")]
        public List<string> PeriodList { get; set; }
    }

    public class TenantShopInvoiceCostGrouping
    {
        // // [JsonPropertyName("group")]
        public string Group { get; set; }

        // // [JsonPropertyName("groupId")]
        public int GroupId { get; set; }

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

        // // [JsonPropertyName("periodCostDetails")]
        public List<PeriodCostDetail> PeriodCostDetails { get; set; } = new List<PeriodCostDetail>();
    }

    public class PeriodTotalCostDetails
    {
        // // [JsonPropertyName("groupName")]
        public string GroupName { get; set; }

        // // [JsonPropertyName("groupId")]
        public int GroupId { get; set; }

        // // [JsonPropertyName("periodCostDetails")]
        public List<PeriodCostDetail> PeriodCostDetails { get; set; } = new List<PeriodCostDetail>();

        // // [JsonPropertyName("average")]
        public decimal? Average { get; set; }

        // // [JsonPropertyName("variance")]
        public string Variance { get; set; }
    }

    public class PeriodCostDetail
    {
        // // [JsonPropertyName("periodId")]
        public int PeriodId { get; set; }

        // // [JsonPropertyName("periodName")]
        public string PeriodName { get; set; }

        // // [JsonPropertyName("cost")]
        public decimal? Cost { get; set; }
        public string Note { get; set; }
    }
}
