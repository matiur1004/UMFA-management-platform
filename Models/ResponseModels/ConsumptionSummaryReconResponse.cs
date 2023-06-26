namespace ClientPortal.Models.ResponseModels
{
    public class ConsumptionSummaryReconResponse
    {
        public CSReconReportHeader? ReportHeader { get; set; }
        public List<CSReconElectricityRecoveries> ElectricityRecoveries { get; set; }
        public List<CSReconElectricityBulkMeters> ElectricityBulkMeters { get; set; }
        public List<CSReconElectricitySummary> ElectricitySummaries { get; set; }
        public List<CSReconOtherRecoveries> OtherRecoveries { get; set; }
        public List<CSReconOtherBulkMeters> OtherBulkMeters { get; set; }
        public List<CSReconOtherSummary> OtherSummaries { get; set; }

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
