namespace ClientPortal.Models.ResponseModels
{
    public class UmfaBuildingRecoveryDataDieselResponse
    {
        public string Title { get; set; }
        public decimal BuildingArea { get; set; }
        public string Utility { get; set; }
        public DieselTenantReportData TenantReportData { get; set; }
        public DieselTenantReportData BulkReportData { get; set; }
        public DieselTenantReportData CouncilReportData { get; set; }
    }

    public class DieselTenantReportData
    {
        public List<DieselPeriodHeader> Data { get; set; }
    }

    public class DieselPeriodHeader
    {
        public int PeriodId { get; set; }
        public long SortIndex { get; set; }
        public string Month { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string PeriodDays { get; set; }
        public List<DieselPeriodDetail> Details { get; set; }
    }

    public class DieselPeriodDetail
    {
        public string ItemName { get; set; }
        public double KWhUsage { get; set; }
        public double KVAUsage { get; set; }
        public double TotalAmount { get; set; }
        public bool Recoverable { get; set; }
        public bool Highlighted { get; set; }
    }
}
