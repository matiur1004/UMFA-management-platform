using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaTenantDashboardBillingCardDetailsRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? TenantId { get; set; }

        public int ShopId { get; set; } = 0;

        [Required]
        public int? History { get; set; }
    }
}
