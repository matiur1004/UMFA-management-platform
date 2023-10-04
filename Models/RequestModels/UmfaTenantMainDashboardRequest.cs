using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaTenantMainDashboardRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? TenantId { get; set; }

        public int ShopId { get; set; } = 0;

        public bool IncludePrevious { get; set; } = false;

        public int History { get; set; } = 36;
    }
}
