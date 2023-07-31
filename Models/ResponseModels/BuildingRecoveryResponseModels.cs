using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class BuildingRecoveryReport
    {
        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("buildingArea")]
        public decimal BuildingArea { get; set; }

        [JsonPropertyName("tenantReportData")]
        public TenantReportData TenantReportData { get; set; }

        [JsonPropertyName("bulkReportData")]
        public TenantReportData BulkReportData { get; set; }

        [JsonPropertyName("councilReportData")]
        public TenantReportData CouncilReportData { get; set; }
    }

    public class TenantReportData
    {
        [JsonPropertyName("data")]
        public List<PeriodHeader> Data { get; set; }
    }

    public class PeriodHeader
    {
        [JsonPropertyName("periodId")]
        public int PeriodId { get; set; }

        [JsonPropertyName("sortIndex")]
        public int SortIndex { get; set; }

        [JsonPropertyName("month")]
        public string Month { get; set; }

        [JsonPropertyName("startDate")]
        public string StartDate { get; set; }

        [JsonPropertyName("endDate")]
        public string EndDate { get; set; }

        [JsonPropertyName("periodDays")]
        public string PeriodDays { get; set; }

        [JsonPropertyName("details")]
        public List<PeriodDetail> Details { get; set; }
    }

    public class PeriodDetail
    {
        [JsonPropertyName("itemName")]
        public string ItemName { get; set; }

        [JsonPropertyName("kwhUsage")]
        public decimal KWhUsage { get; set; }

        [JsonPropertyName("kvaUsage")]
        public decimal KVAUsage { get; set; }

        [JsonPropertyName("totalAmount")]
        public decimal TotalAmount { get; set; }

        [JsonPropertyName("recoverable")]
        public bool Recoverable { get; set; }

        [JsonPropertyName("highlighted")]
        public bool Highlighted { get; set; }
    }
}
