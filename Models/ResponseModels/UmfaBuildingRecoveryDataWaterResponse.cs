namespace ClientPortal.Models.ResponseModels
{
    public class UmfaBuildingRecoveryDataWaterResponse
    {
        public string Title { get; set; }
        public decimal BuildingArea { get; set; }
        public string Utility { get; set; }
        public WaterTenantReportData TenantReportData { get; set; }
        public WaterTenantReportData BulkReportData { get; set; }
        public WaterTenantReportData CouncilReportData { get; set; }
    }
    public class WaterTenantReportData
    {
        public List<WaterPeriodHeader> Data { get; set; }
    }

    public class WaterPeriodHeader
    {
        public int PeriodId { get; set; }
        public long SortIndex { get; set; }
        public string Month { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string PeriodDays { get; set; }
        public List<WaterPeriodDetail> Details { get; set; }
    }

    public class WaterPeriodDetail
    {
        public string ItemName { get; set; }
        public double KLUsage { get; set; }
        public double TotalAmount { get; set; }
        public bool Recoverable { get; set; }
        public bool Highlighted { get; set; }
    }
}
