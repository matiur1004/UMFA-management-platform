using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class TenantSlipCardInfoSpRequest
    {
        [Required]
        public int? BuildingId { get; set; }
    }
}
