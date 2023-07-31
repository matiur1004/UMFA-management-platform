using ClientPortal.Data.Entities.UMFAEntities;
using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class UtilityRecoveryReportResponse
    {
        [JsonPropertyName("headerValues")]
        public List<UtilityRecoveryHeader> HeaderValues { get; set; }

        [JsonPropertyName("gridValues")]
        public List<UtilityRecoveryGridReport> GridValues { get; set; } = new List<UtilityRecoveryGridReport>();

        [JsonPropertyName("graphValues")]
        public List<UtilityRecoveryGraphReport> GraphValues { get; set; } = new List<UtilityRecoveryGraphReport>();

        [JsonPropertyName("periodList")]
        public List<string> PeriodList { get; set; }
    }

    public class UtilityRecoveryGridReport
    {
        [JsonPropertyName("rowNumber")]
        public int RowNumber { get; set; }

        [JsonPropertyName("rowHeader")]
        public string RowHeader { get; set; }

        [JsonPropertyName("repType")]
        public string RepType { get; set; }

        [JsonPropertyName("periodDetails")]
        public List<UtilityRecoveryPeriodDetail> PeriodDetails { get; set; }
    }

    public class UtilityRecoveryGraphReport
    {
        [JsonPropertyName("rowNumber")]
        public int RowNumber { get; set; }

        [JsonPropertyName("rowHeader")]
        public string RowHeader { get; set; }

        [JsonPropertyName("periodDetails")]
        public List<UtilityRecoveryPeriodDetail> PeriodDetails { get; set; }
    }

    public class UtilityRecoveryPeriodDetail
    {
        [JsonPropertyName("periodId")]
        public string PeriodId { get; set; }

        [JsonPropertyName("periodName")]
        public string PeriodName { get; set; }

        [JsonPropertyName("colValue")]
        public string ColValue { get; set; }
    }
}

