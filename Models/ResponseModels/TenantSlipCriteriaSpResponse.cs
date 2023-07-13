namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipCriteriaSpResponse
    {
        public List<TenantSlipCriteriaPeriodList> PeriodLists { get; set; }
        public List<TenantSlipCriteriaReportType> ReportTypes { get; set; }
        public List<TenantSlipCriteriaFileFormat> FileFormats { get; set; }
        public List<TenantSlipCriteriaFileName> FileNames { get; set; } 
    }

    public class TenantSlipCriteriaPeriodList
    {
        public int PeriodId { get; set; }
        public string DisplayName { get; set; }
        public string SplitList { get; set; }
    }

    public class TenantSlipCriteriaReportType
    {
        public int ReportTypeId { get; set; }
        public string ReportTypeName { get; set; }
    }

    public class TenantSlipCriteriaFileFormat
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
    }

    public class TenantSlipCriteriaFileName
    {
        public string FileName { get; set; }
    }
}
