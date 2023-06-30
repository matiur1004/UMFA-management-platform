using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class TenantSlipDataSpRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? PeriodId { get; set; }

        [Required, Range(1,2)]
        public int? ReportTypeId { get; set; }
    }
}
