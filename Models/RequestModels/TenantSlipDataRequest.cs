using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class TenantSlipDataRequest
    {
        [Required]
        public int? TenantId { get; set; }

        [Required]
        public int? PeriodId { get; set; }

        public List<int> ShopIDs { get; set; }
        
        [Required]
        public int? SplitIndicator { get; set; }
    }
}
