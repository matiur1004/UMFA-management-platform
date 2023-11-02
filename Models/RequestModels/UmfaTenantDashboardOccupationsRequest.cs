using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaTenantDashboardOccupationsRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? TenantId { get; set; }

        [Required]
        public bool? InCludePrev { get; set; }
    }
}
