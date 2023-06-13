using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class ShopUsageVarianceRequest
    {
        [Required]
        public int BuildingId { get; set; }

        [Required]
        public int FromPeriodId { get; set; }
        
        [Required]
        public int ToPeriodId { get; set; }
        
        [Required]
        public int AllTenants { get; set; }
    }
}
