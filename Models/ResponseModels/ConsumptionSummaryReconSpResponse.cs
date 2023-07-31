using System.Text.Json.Serialization;

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
        [JsonPropertyName("displayName")]
        public string DisplayName { get; set; }

        [JsonPropertyName("periodInfo")]
        public string PeriodInfo { get; set; }
    }

    public class CSReconElectricityRecoveries
    {
        [JsonPropertyName("serviceName")]
        public string ServiceName { get; set; }

        [JsonPropertyName("reconDescription")]
        public string ReconDescription { get; set; }

        [JsonPropertyName("kwhUsage")]
        public double KWHUsage { get; set; }

        [JsonPropertyName("kwhAmount")]
        public double KWHAmount { get; set; }

        [JsonPropertyName("kvaUsage")]
        public double KVAUsage { get; set; }

        [JsonPropertyName("kvaAmount")]
        public double KVAAmount { get; set; }

        [JsonPropertyName("bcAmount")]
        public double BCAmount { get; set; }

        [JsonPropertyName("otherAmount")]
        public double OtherAmount { get; set; }

        [JsonPropertyName("totalAmt")]
        public double TotalAmt { get; set; }

        [JsonPropertyName("kwhUsageRec")]
        public double KWHUsageRec { get; set; }

        [JsonPropertyName("kwhAmountRec")]
        public double KWHAmountRec { get; set; }

        [JsonPropertyName("kvaUsageRec")]
        public double KVAUsageRec { get; set; }

        [JsonPropertyName("kvaAmountRec")]
        public double KVAAmountRec { get; set; }

        [JsonPropertyName("bcAmountRec")]
        public double BCAmountRec { get; set; }

        [JsonPropertyName("otherAmountRec")]
        public double OtherAmountRec { get; set; }

        [JsonPropertyName("totalAmtRec")]
        public double TotalAmtRec { get; set; }

        [JsonPropertyName("kwhUsageNonRec")]
        public double KWHUsageNonRec { get; set; }

        [JsonPropertyName("kwhAmountNonRec")]
        public double KWHAmountNonRec { get; set; }

        [JsonPropertyName("kvaUsageNonRec")]
        public double KVAUsageNonRec { get; set; }

        [JsonPropertyName("kvaAmountNonRec")]
        public double KVAAmountNonRec { get; set; }

        [JsonPropertyName("bcAmountNonRec")]
        public double BCAmountNonRec { get; set; }

        [JsonPropertyName("otherAmountNonRec")]
        public double OtherAmountNonRec { get; set; }

        [JsonPropertyName("totalAmtNonRec")]
        public double TotalAmtNonRec { get; set; }

        [JsonPropertyName("recoverable")]
        public bool Recoverable { get; set; }
    }

    public class CSReconElectricityBulkMeters
    {
        [JsonPropertyName("serviceName")]
        public string ServiceName { get; set; }

        [JsonPropertyName("meterNo")]
        public string MeterNo { get; set; }

        [JsonPropertyName("descriptionField")]
        public string DescriptionField { get; set; }

        [JsonPropertyName("totalAmount")]
        public double TotalAmount { get; set; }

        [JsonPropertyName("kwhUsage")]
        public double KWHUsage { get; set; }

        [JsonPropertyName("kvaUsage")]
        public double KVAUsage { get; set; }

        [JsonPropertyName("kwhAmount")]
        public double KWHAmount { get; set; }

        [JsonPropertyName("kvaAmount")]
        public double KVAAmount { get; set; }

        [JsonPropertyName("bcAmount")]
        public double BCAmount { get; set; }

        [JsonPropertyName("otherAmount")]
        public double OtherAmount { get; set; }
    }

    public class CSReconElectricitySummary
    {
        [JsonPropertyName("serviceName")]
        public string ServiceName { get; set; }

        [JsonPropertyName("actualTotalDiff")]
        public double ActualTotalDiff { get; set; }

        [JsonPropertyName("actualKWHUnitsDiff")]
        public double ActualKWHUnitsDiff { get; set; }

        [JsonPropertyName("actualKWHAmountDiff")]
        public double ActualKWHAmountDiff { get; set; }

        [JsonPropertyName("actualKVAUnitsDiff")]
        public double ActualKVAUnitsDiff { get; set; }

        [JsonPropertyName("actualKVAaAmountDiff")]
        public double ActualKVAaAmountDiff { get; set; }

        [JsonPropertyName("actualBCDiff")]
        public double ActualBCDiff { get; set; }

        [JsonPropertyName("actualOtherDiff")]
        public double ActualOtherDiff { get; set; }

        [JsonPropertyName("percActTotal")]
        public double PercActTotal { get; set; }

        [JsonPropertyName("percActKWHUnits")]
        public double PercActKWHUnits { get; set; }

        [JsonPropertyName("percActKWHAmount")]
        public double PercActKWHAmount { get; set; }

        [JsonPropertyName("percActKVAUnits")]
        public double PercActKVAUnits { get; set; }

        [JsonPropertyName("percActKVAAmount")]
        public double PercActKVAAmount { get; set; }

        [JsonPropertyName("percActBC")]
        public double PercActBC { get; set; }

        [JsonPropertyName("percActOther")]
        public double PercActOther { get; set; }

        [JsonPropertyName("totalDiff")]
        public double TotalDiff { get; set; }

        [JsonPropertyName("kwhUnitsDiff")]
        public double KWHUnitsDiff { get; set; }

        [JsonPropertyName("kwhAmountDiff")]
        public double KWHAmountDiff { get; set; }

        [JsonPropertyName("kvaUnitsDiff")]
        public double KVAUnitsDiff { get; set; }

        [JsonPropertyName("kvaAmountDiff")]
        public double KVAaAmountDiff { get; set; }

        [JsonPropertyName("bcDiff")]
        public double BCDiff { get; set; }

        [JsonPropertyName("otherDiff")]
        public double OtherDiff { get; set; }

        [JsonPropertyName("percTotalDiff")]
        public double PercTotalDiff { get; set; }

        [JsonPropertyName("percKWHUnitsDiff")]
        public double PercKWHUnitsDiff { get; set; }

        [JsonPropertyName("percKWHAmountDiff")]
        public double PercKWHAmountDiff { get; set; }

        [JsonPropertyName("percKVAUnitsDiff")]
        public double PercKVAUnitsDiff { get; set; }

        [JsonPropertyName("percKVAaAmountDiff")]
        public double PercKVAaAmountDiff { get; set; }

        [JsonPropertyName("percBCDiff")]
        public double PercBCDiff { get; set; }

        [JsonPropertyName("percOtherDiff")]
        public double PercOtherDiff { get; set; }
    }

    public class CSReconOtherRecoveries
    {
        [JsonPropertyName("serviceName")]
        public string ServiceName { get; set; }

        [JsonPropertyName("reconDescription")]
        public string ReconDescription { get; set; }

        [JsonPropertyName("usageRecoverable")]
        public double UsageRecoverable { get; set; }

        [JsonPropertyName("amountRecoverable")]
        public double AmountRecoverable { get; set; }

        [JsonPropertyName("bcAmountRecoverable")]
        public double BCAmountRecoverable { get; set; }

        [JsonPropertyName("totalAmtRec")]
        public double TotalAmtRec { get; set; }

        [JsonPropertyName("usageNonRecoverable")]
        public double UsageNonRecoverable { get; set; }

        [JsonPropertyName("amountNonRecoverable")]
        public double AmountNonRecoverable { get; set; }

        [JsonPropertyName("bcAmountNonRecoverable")]
        public double BCAmountNonRecoverable { get; set; }

        [JsonPropertyName("totalAmtNonRec")]
        public double TotalAmtNonRec { get; set; }

        [JsonPropertyName("usage")]
        public double Usage { get; set; }

        [JsonPropertyName("amount")]
        public double Amount { get; set; }

        [JsonPropertyName("bcAmount")]
        public double BCAmount { get; set; }

        [JsonPropertyName("totalAmt")]
        public double TotalAmt { get; set; }
    }

    public class CSReconOtherBulkMeters
    {
        [JsonPropertyName("serviceName")]
        public string ServiceName { get; set; }

        [JsonPropertyName("meterNo")]
        public string MeterNo { get; set; }

        [JsonPropertyName("descriptionField")]
        public string DescriptionField { get; set; }

        [JsonPropertyName("totalAmount")]
        public double TotalAmount { get; set; }

        [JsonPropertyName("usage")]
        public double Usage { get; set; }

        [JsonPropertyName("consAmount")]
        public double ConsAmount { get; set; }

        [JsonPropertyName("bcAmount")]
        public double BCAmount { get; set; }
    }

    public class CSReconOtherSummary
    {
        [JsonPropertyName("serviceName")]
        public string ServiceName { get; set; }

        [JsonPropertyName("actualTotalDiff")]
        public double ActualTotalDiff { get; set; }

        [JsonPropertyName("actualKLUnitsDiff")]
        public double ActualKLUnitsDiff { get; set; }

        [JsonPropertyName("actualKLAmountDiff")]
        public double ActualKLAmountDiff { get; set; }

        [JsonPropertyName("actualBCDiff")]
        public double ActualBCDiff { get; set; }

        [JsonPropertyName("percActTotal")]
        public double PercActTotal { get; set; }

        [JsonPropertyName("percActKLUnits")]
        public double PercActKLUnits { get; set; }

        [JsonPropertyName("percActKLAmount")]
        public double PercActKLAmount { get; set; }

        [JsonPropertyName("percActBC")]
        public double PercActBC { get; set; }

        [JsonPropertyName("totalDiff")]
        public double TotalDiff { get; set; }

        [JsonPropertyName("klUnitsDiff")]
        public double KLUnitsDiff { get; set; }

        [JsonPropertyName("klAmountDiff")]
        public double KLAmountDiff { get; set; }

        [JsonPropertyName("bcDiff")]
        public double BCDiff { get; set; }

        [JsonPropertyName("percTotalDiff")]
        public double PercTotalDiff { get; set; }

        [JsonPropertyName("percKLUnitsDiff")]
        public double PercKLUnitsDiff { get; set; }

        [JsonPropertyName("percKLAmountDiff")]
        public double PercKLAmountDiff { get; set; }

        [JsonPropertyName("percBCDiff")]
        public double PercBCDiff { get; set; }
    }
}
