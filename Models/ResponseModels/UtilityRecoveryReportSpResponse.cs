using ClientPortal.Data.Entities.UMFAEntities;

namespace ClientPortal.Models.ResponseModels
{
    public class UtilityRecoveryReportSpResponse
    {
        public List<UtilityRecoveryHeader> HeaderValues { get; set; }
        public List<UtilityRecoveryGrid> GridValues { get; set; }
        public List<UtilityRecoveryGraph> GraphValues { get; set; }
    }
}
