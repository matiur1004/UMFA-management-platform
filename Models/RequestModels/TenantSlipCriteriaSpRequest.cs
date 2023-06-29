using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class TenantSlipCriteriaSpRequest
    {
        [Required]
        public int? BuildingId { get; set; }
    }
}
