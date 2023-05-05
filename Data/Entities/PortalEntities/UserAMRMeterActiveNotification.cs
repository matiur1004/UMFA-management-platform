namespace ClientPortal.Data.Entities.PortalEntities
{
    public class UserAMRMeterActiveNotification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AMRMeterAlarmId { get; set; }
        public int UserNotificationId { get; set; }
        public bool Enabled { get; set; }
        public bool Active { get; set; }
        public DateTime? LastRunDateTime { get; set; }
        public DateTime? LastRunDataDateTime { get; set; }
    }
}
