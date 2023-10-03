using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaTenantDashboardTenantListRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? UmfaUserId { get; set; }

        [Required]
        public bool? IsTenant { get; set; }
    }
}
