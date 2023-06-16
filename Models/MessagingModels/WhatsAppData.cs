using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Models.MessagingModels
{
    public class WhatsAppData
    {
        public string PhoneNumber { get; set; }
        public string MeterNumber { get; set; }
        public string MeterName { get; set; }
        public string BuildingName { get; set; }
        public string AlarmName { get; set; }
        public string AlarmDescription { get; set; }

        public WhatsAppData() { }
        public WhatsAppData(NotificationToSend notification) 
        {
            PhoneNumber = notification.NotificationMobileNumber;
            MeterName = notification.MeterSerial;
            MeterNumber = notification.MeterNo;
            BuildingName = notification.BuildingName;
            AlarmName = notification.AlarmName;
            AlarmDescription = notification.AlarmDescription;
        }
    }
}
