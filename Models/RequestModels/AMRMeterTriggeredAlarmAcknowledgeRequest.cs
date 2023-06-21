using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class AMRMeterTriggeredAlarmAcknowledgeRequest
    {
        [Required]
        public bool? Acknowledged { get; set; }
    }
}
