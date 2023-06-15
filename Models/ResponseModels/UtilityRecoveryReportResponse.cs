using ClientPortal.Data.Entities.UMFAEntities;

namespace ClientPortal.Models.ResponseModels
{
    public class UtilityRecoveryReportResponse
    {
        public List<UtilityRecoveryHeader> HeaderValues { get; set; }
        public List<UtilityRecoveryGridReport> GridValues { get; set; } = new List<UtilityRecoveryGridReport>();
        public List<UtilityRecoveryGraphReport> GraphValues { get; set; } = new List<UtilityRecoveryGraphReport>();

        public List<string> PeriodList { get; set; }
    }

    public class UtilityRecoveryGridReport
    {
        public int RowNumber { get; set; }
        public string RowHeader { get; set; }
        public string RepType { get; set; }

        public List<UtilityRecoveryPeriodDetail> PeriodDetails { get; set; }
    }

    public class UtilityRecoveryGraphReport
    {
        public int RowNumber { get; set; }
        public string RowHeader { get; set; }

        public List<UtilityRecoveryPeriodDetail> PeriodDetails { get; set; }
    }

    public class UtilityRecoveryPeriodDetail
    {
        public string PeriodId { get; set; }
        public string PeriodName { get; set; }
        public string ColValue { get; set; }
    }
}

