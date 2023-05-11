using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Data.Entities.PortalEntities
{
    public class TriggeredAlarmNotification
    {
        [Key]
        [Required]
        public int TriggeredAlarmNotificationId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int AMRMeterTriggeredAlarmId { get; set; }
        [Required]
        public int NotificationSendTypeId { get; set; }
        [Required]
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDateTime { get; set; }
        [Required]
        public DateTime LastUdateDateTime { get; set;}
        public DateTime SendDateTime { get; set; }
        [Required]
        public bool Active { get; set; }
        public string SendStatusMessage { get; set; }
    }
}
