namespace ClientPortal.Models.ResponseModels
{
    public class ConsumptionSummaryReconSpResponse
    {
        public List<CSReconReportHeader> ReportHeaders { get; set; }
        public List<CSReconElectricityRecoveries> ElectricityRecoveries { get; set; }
        public List<CSReconElectricityBulkMeters> ElectricityBulkMeters { get; set; }
        public List<CSReconElectricitySummary> ElectricitySummaries { get; set; }
        public List<CSReconOtherRecoveries> OtherRecoveries { get; set; }
        public List<CSReconOtherBulkMeters> OtherBulkMeters { get; set; }
        public List<CSReconOtherSummary> OtherSummaries { get; set; }
    }

    public class CSReconReportHeader
    {
        public string DisplayName { get; set; }
        public string PeriodInfo { get; set; }
    }

    public class CSReconElectricityRecoveries
    {
        public string ServiceName { get; set; }
        public string ReconDescription { get; set; }
        public double KWHUsage { get; set; }
        public double KWHAmount { get; set; }
        public double KVAUsage { get; set; }
        public double KVAAmount { get; set; }
        public double BCAmount { get; set; }
        public double OtherAmount { get; set; }
        public double TotalAmt { get; set; }
        public double KWHUsageRec { get; set; }
        public double KWHAmountRec { get; set; }
        public double KVAUsageRec { get; set; }
        public double KVAAmountRec { get; set; }
        public double BCAmountRec { get; set; }
        public double OtherAmountRec { get; set; }
        public double TotalAmtRec { get; set; }
        public double KWHUsageNonRec { get; set; }
        public double KWHAmountNonRec { get; set; }
        public double KVAUsageNonRec { get; set; }
        public double KVAAmountNonRec { get; set; }
        public double BCAmountNonRec { get; set; }
        public double OtherAmountNonRec { get; set; }
        public double TotalAmtNonRec { get; set; }
        public bool Recoverable { get; set; }
    }

    public class CSReconElectricityBulkMeters
    {
        public string ServiceName { get; set; }
        public string MeterNo { get; set; }
        public string DescriptionField { get; set; }
        public double TotalAmount { get; set; }
        public double KWHUsage { get; set; }
        public double KVAUsage { get; set; }
        public double KWHAmount { get; set; }
        public double KVAAMOUNT { get; set; }
        public double BCAmount { get; set; }
        public double OtherAmount { get; set; }

    }

    public class CSReconElectricitySummary
    {
        public string ServiceName { get; set; }
        public double ActualTotalDiff { get; set; }
        public double ActualKWHUnitsDiff { get; set; }
        public double ActualKWHAmountDiff { get; set; }
        public double ActualKVAUnitsDiff { get; set; }
        public double ActualKVAaAmountDiff { get; set; }
        public double ActualBCDiff { get; set; }
        public double ActualOtherDiff { get; set; }
        public double PercActTotal { get; set; }
        public double PercActKWHUnits { get; set; }
        public double PercActKWHAmount { get; set; }
        public double PercActKVAUnits { get; set; }
        public double PercActKVAAmount { get; set; }
        public double PercActBC { get; set; }
        public double PercActOther { get; set; }
        public double TotalDiff { get; set; }
        public double KWHUnitsDiff { get; set; }
        public double KWHAmountDiff { get; set; }
        public double KVAUnitsDiff { get; set; }
        public double KVAaAmountDiff { get; set; }
        public double BCDiff { get; set; }
        public double OtherDiff { get; set; }
        public double PercTotalDiff { get; set; }
        public double PercKWHUnitsDiff { get; set; }
        public double PercKWHAmountDiff { get; set; }
        public double PercKVAUnitsDiff { get; set; }
        public double PercKVAaAmountDiff { get; set; }
        public double PercBCDiff { get; set; }
        public double PercOtherDiff { get; set; }
    }

    public class CSReconOtherRecoveries
    {
        public string ServiceName { get; set; }
        public string ReconDescription { get; set; }
        public double UsageRecoverable { get; set; }
        public double AmountRecoverable { get; set; }
        public double BCAmountRecoverable { get; set; }
        public double TotalAmtRec { get; set; }
        public double UsageNonRecoverable { get; set; }
        public double AmountNonRecoverable { get; set; }
        public double BCAmountNonRecoverable { get; set; }
        public double TotalAmtNonRec { get; set; }
        public double Usage { get; set; }
        public double Amount { get; set; }
        public double BCAmount { get; set; }
        public double TotalAmt { get; set; }
    }

    public class CSReconOtherBulkMeters
    {
        public string ServiceName { get; set; }
        public string MeterNo { get; set; }
        public string DescriptionField { get; set; }
        public double TotalAmount { get; set; }
        public double Usage { get; set; }
        public double ConsAmount { get; set; }
        public double BCAmount { get; set; }
    }

    public class CSReconOtherSummary
    {
        public string ServiceName { get; set; }
        public double ActualTotalDiff { get; set; }
        public double ActualKLUnitsDiff { get; set; }
        public double ActualKLAmountDiff { get; set; }
        public double ActualBCDiff { get; set; }
        public double PercActTotal { get; set; }
        public double PercActKLUnits { get; set; }
        public double PercActKLAmount { get; set; }
        public double PercActBC { get; set; }
        public double TotalDiff { get; set; }
        public double KLUnitsDiff { get; set; }
        public double KLAmountDiff { get; set; }
        public double BCDiff { get; set; }
        public double PercTotalDiff { get; set; }
        public double PercKLUnitsDiff { get; set; }
        public double PercKLAmountDiff { get; set; }
        public double PercBCDiff { get; set; }
    }
}
