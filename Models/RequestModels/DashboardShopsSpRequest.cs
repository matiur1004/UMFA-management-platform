using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class DashboardShopsSpRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        public int? ShopId { get; set; } = 0;

        [Range(1, int.MaxValue)]
        public int History { get; set; } = 12;
    }
}
