namespace ClientPortal.Models.ResponseModels
{
    public class RoleUpdateModel
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string NotificationEmailAddress { get; set; }
        public string NotificationMobileNumber { get; set; }
    }
}
