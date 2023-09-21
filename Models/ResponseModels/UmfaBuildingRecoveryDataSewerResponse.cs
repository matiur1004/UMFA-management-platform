namespace ClientPortal.Models.ResponseModels
{
    public class UmfaBuildingRecoveryDataSewerResponse
    {
        public string Title { get; set; }
        public decimal BuildingArea { get; set; }
        public SewerTenantReportData TenantReportData { get; set; }
        public SewerTenantReportData BulkReportData { get; set; }
        public SewerTenantReportData CouncilReportData { get; set; }
    }

    public class SewerTenantReportData
    {
        public List<SewerPeriodHeader> Data { get; set; }
    }

    public class SewerPeriodHeader
    {
        public int PeriodId { get; set; }
        public long SortIndex { get; set; }
        public string Month { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string PeriodDays { get; set; }
        public List<SewerPeriodDetail> Details { get; set; }
    }

    public class SewerPeriodDetail
    {
        public string ItemName { get; set; }
        public double KLUsage { get; set; }
        public double TotalAmount { get; set; }
        public bool Recoverable { get; set; }
        public bool Highlighted { get; set; }
    }
}
