namespace ClientPortal.Models.ResponseModels
{
    public class NotificationsToSendSpResponse
    {
        public List<NotificationToSend> NotificationsToSend { get; set; }
    }

    public class NotificationToSend
    {
        public int? AMRMeterTriggeredAlarmId { get; set; }
        public int? AMRMeterAlarmId { get; set; }
        public int? UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NotificationEmailAddress { get; set; }
        public string NotificationMobileNumber { get; set; }
        public int? BuildingId { get; set; }
        public int? UmfaId { get; set; }
        public string BuildingName { get; set; }
        public int AMRMeterId { get; set; }
        public string MeterNo { get; set; }
        public string MeterSerial { get; set; }
        public string Description { get; set; }
        public string AlarmName { get; set; }
        public string AlarmDescription { get; set; }
        public string OccStartDTM { get; set; }
        public int NotificationSendTypeId { get; set; }
        public string NotificationSendTypeName { get; set; }

    }
}
