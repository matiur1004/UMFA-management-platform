using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class ConsumptionSummaryReconResponse
    {
        [JsonPropertyName("reportHeader")]
        public CSReconReportHeader? ReportHeader { get; set; }

        [JsonPropertyName("electricityRecoveries")]
        public List<CSReconElectricityRecoveries> ElectricityRecoveries { get; set; }

        [JsonPropertyName("electricityBulkMeters")]
        public List<CSReconElectricityBulkMeters> ElectricityBulkMeters { get; set; }

        [JsonPropertyName("electricitySummaries")]
        public List<CSReconElectricitySummary> ElectricitySummaries { get; set; }

        [JsonPropertyName("otherRecoveries")]
        public List<CSReconOtherRecoveries> OtherRecoveries { get; set; }

        [JsonPropertyName("otherBulkMeters")]
        public List<CSReconOtherBulkMeters> OtherBulkMeters { get; set; }

        [JsonPropertyName("otherSummaries")]
        public List<CSReconOtherSummary> OtherSummaries { get; set; }

        public ConsumptionSummaryReconResponse() { }

        public ConsumptionSummaryReconResponse(ConsumptionSummaryReconSpResponse response)
        {
            ReportHeader = response.ReportHeaders.FirstOrDefault();
            ElectricityRecoveries = response.ElectricityRecoveries;
            ElectricityBulkMeters = response.ElectricityBulkMeters;
            ElectricitySummaries = response.ElectricitySummaries;
            OtherRecoveries = response.OtherRecoveries;
            OtherBulkMeters = response.OtherBulkMeters;
            OtherSummaries = response.OtherSummaries;
        }
    }
}
