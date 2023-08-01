using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipCriteriaResponse
    {
        // // [JsonPropertyName("periodLists")]
        public List<TenantSlipCriteriaPeriodList> PeriodLists { get; set; }

        // // [JsonPropertyName("reportTypes")]
        public List<TenantSlipCriteriaReportType> ReportTypes { get; set; }

        // // [JsonPropertyName("fileFormats")]
        public List<TenantSlipCriteriaFileFormat> FileFormats { get; set; }

        // // [JsonPropertyName("fileName")]
        public string? FileName { get; set; }

        public TenantSlipCriteriaResponse() { }

        public TenantSlipCriteriaResponse(TenantSlipCriteriaSpResponse response)
        {
            PeriodLists = response.PeriodLists;
            ReportTypes = response.ReportTypes;
            FileFormats = response.FileFormats;
            FileName = response.FileNames.FirstOrDefault()?.FileName;
        }
    }
}
