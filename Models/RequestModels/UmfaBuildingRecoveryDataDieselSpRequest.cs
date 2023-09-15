using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaBuildingRecoveryDataDieselSpRequest
    {
        [Required]
        public int? StartPeriodId { get; set; }

        [Required]
        public int? EndPeriodId { get; set; }
    }
}
