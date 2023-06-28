using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaTenantShopsSpRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? PeriodId { get; set; }

        [Required]
        public int? TenantId { get; set; }
        
        [Required, Range(1,2)]
        public int? ReportTypeId { get; set; }
    }
}
