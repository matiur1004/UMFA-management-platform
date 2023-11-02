using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaTenantDashboardReadingsRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? ShopId { get; set; }

        [Required]
        public int? BuildingServiceId { get; set; }

        public int History { get; set; } = 36;
    }
}
