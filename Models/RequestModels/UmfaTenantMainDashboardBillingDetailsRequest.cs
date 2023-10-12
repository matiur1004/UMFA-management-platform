using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaTenantMainDashboardBillingDetailsRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? PeriodId { get; set; }

        [Required]
        public int? TenantId { get; set; }
    }
}
