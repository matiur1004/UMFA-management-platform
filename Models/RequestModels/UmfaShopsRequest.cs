using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaShopsRequest
    {
        [Required]
        public int? BuildingID { get; set; }

        [Required]
        public int? PeriodID { get; set; }
    }
}
