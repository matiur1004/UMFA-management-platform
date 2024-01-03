using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaTenantDashboardAssignedMetersRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? TenantId { get; set; }

        [Range(1, int.MaxValue)]
        public int History { get; set; } = 6;
    }
}
