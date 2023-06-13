using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UtilityRecoveryReportRequest
    {
        [Required]
        public int? BuildingID { get; set; }
        [Required]
        public int? FromPeriodID { get; set; }
        [Required]
        public int? ToPeriodID { get; set; }
        [Required]
        public int? Recoveries { get; set; }
        [Required]
        public int? Expenses { get; set; }
        [Required]
        public int? ReconType { get; set; }
        [Required]
        public int? NoteType { get; set; }
        [Required]
        public int? ServiceType { get; set; }
        [Required]
        public int? ViewClientExpense { get; set; }
        [Required]
        public bool? ClientExpenseVisible { get; set; }
        [Required]
        public bool? CouncilAccountVisible { get; set; }
        [Required]
        public bool? BulkReadingVisible { get; set; }
        [Required]
        public bool? PotentialRecVisible { get; set; }
        [Required]
        public bool? NonRecVisible { get; set; }
        [Required]
        public bool? UmfaReadingDatesVisible { get; set; }
        [Required]
        public bool? CouncilReadingDatesVisible { get; set; }
        [Required]
        public bool? UmfaRecoveryVisible { get; set; }
        [Required]
        public bool? ClientRecoverableVisible { get; set; }
    }
}
