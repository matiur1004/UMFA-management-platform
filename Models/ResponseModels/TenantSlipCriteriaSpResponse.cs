using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipCriteriaSpResponse
    {
        [JsonPropertyName("periodLists")]
        public List<TenantSlipCriteriaPeriodList> PeriodLists { get; set; }

        [JsonPropertyName("reportTypes")]
        public List<TenantSlipCriteriaReportType> ReportTypes { get; set; }

        [JsonPropertyName("fileFormats")]
        public List<TenantSlipCriteriaFileFormat> FileFormats { get; set; }

        [JsonPropertyName("fileNames")]
        public List<TenantSlipCriteriaFileName> FileNames { get; set; }
    }

    public class TenantSlipCriteriaPeriodList
    {
        [JsonPropertyName("periodId")]
        public int PeriodId { get; set; }

        [JsonPropertyName("displayName")]
        public string DisplayName { get; set; }

        [JsonPropertyName("splitList")]
        public string SplitList { get; set; }
    }

    public class TenantSlipCriteriaReportType
    {
        [JsonPropertyName("reportTypeId")]
        public int ReportTypeId { get; set; }

        [JsonPropertyName("reportTypeName")]
        public string ReportTypeName { get; set; }
    }

    public class TenantSlipCriteriaFileFormat
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("value")]
        public string Value { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }
    }

    public class TenantSlipCriteriaFileName
    {
        [JsonPropertyName("fileName")]
        public string FileName { get; set; }
    }
}
