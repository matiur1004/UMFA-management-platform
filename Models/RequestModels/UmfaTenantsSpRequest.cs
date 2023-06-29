using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaTenantsSpRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? PeriodId { get; set; }
    }
}
