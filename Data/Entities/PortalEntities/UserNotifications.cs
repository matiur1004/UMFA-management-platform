using Org.BouncyCastle.Bcpg;

namespace ClientPortal.Data.Entities.PortalEntities
{
    public class UserNotifications
    {
    public int Id { get; set; }
        public int UserId { get; set; }
        public int NotificationTypeId { get; set; }
        public bool Email { get; set; }
        public bool WhatsApp { get; set; }
        public bool Telegram { get; set; }
    }
}
