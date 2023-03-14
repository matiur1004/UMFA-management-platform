namespace ClientPortal.Data.Entities.PortalEntities
{
    public class UserNotificationSchedule
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BuildingId { get; set; }

        //Email, Whatsapp or Telegram - NotificationTypeId
        public int NotificationTypeId { get; set; }
        
        //Hours
        public string StartTime { get; set; }
        public string EndTime { get; set; }

        //Day Of Week
        public bool Monday { get; set; }
        public bool Tuesday { get; set; }
        public bool Wednesday { get; set; }
        public bool Thursday { get; set; }
        public bool Friday { get; set; }
        public bool Saturday { get; set; }
        public bool Sunday { get; set; }
        public int UserNotificationSummaryTypeId { get; set; }
    }
}