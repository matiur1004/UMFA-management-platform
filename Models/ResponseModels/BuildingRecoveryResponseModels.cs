using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class BuildingRecoveryReport
    {
        public string Title { get; set; }
        public decimal BuildingArea { get; set; }
        public TenantReportData TenantReportData { get; set; }
        public TenantReportData BulkReportData { get; set; }
        public TenantReportData CouncilReportData { get; set; }
    }

    public class TenantReportData
    {
        public List<PeriodHeader> Data { get; set; }
    }

    public class PeriodHeader
    {
        public int PeriodId { get; set; }
        public int SortIndex { get; set; }
        public string Month { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string PeriodDays { get; set; }
        public List<PeriodDetail> Details { get; set; }
    }

    public class PeriodDetail
    {
        public string ItemName { get; set; }
        public decimal KWhUsage { get; set; }
        public decimal KVAUsage { get; set; }
        public decimal TotalAmount { get; set; }
        public bool Recoverable { get; set; }
        public bool Highlighted { get; set; }
    }
}
