using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class AMRTriggeredAlarmsRequest
    {
        [Required]
        public int? UmfaUserId { get; set; }

        [Required]
        public int? UmfaBuildingId { get; set; }
    }
}
