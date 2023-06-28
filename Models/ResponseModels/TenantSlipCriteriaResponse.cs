namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipCriteriaResponse
    {
        public List<TenantSlipCriteriaPeriodList> PeriodLists { get; set; }
        public List<TenantSlipCriteriaReportType> ReportTypes { get; set; }
        public List<TenantSlipCriteriaFileFormat> FileFormats { get; set; }
        public string? FileName { get; set; }

        public TenantSlipCriteriaResponse(TenantSlipCriteriaSpResponse response)
        {
            PeriodLists = response.PeriodLists;
            ReportTypes = response.ReportTypes;
            FileFormats = response.FileFormats;
            FileName = response.FileNames.FirstOrDefault()?.FileName;
        }
    }
}
