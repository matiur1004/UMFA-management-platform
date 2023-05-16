using ClientPortal.Controllers;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Interfaces;
using ClientPortal.Settings;
using Dapper;
using Microsoft.Extensions.Options;
using System.Dynamic;
using Newtonsoft;
using ServiceStack.Text;
using ClientPortal.Models.MessagingModels;

namespace ClientPortal.Services
{
    public class NotificationService : INotificationService
    {
        private readonly NotificationSettings _settings;
        private readonly PortalDBContext _dbContext;
        private readonly IMailService _mailService;
        private readonly IWhatsAppService _whatsAppService;
        private readonly ITelegramService _telegramService;

        public NotificationService(IOptions<NotificationSettings> settings, PortalDBContext dBContext, IMailService mailService, IWhatsAppService whatsAppService, ITelegramService telegramService)
        {
            _settings = settings.Value;
            _dbContext = dBContext;
            _mailService = mailService;
            _whatsAppService = whatsAppService;
            _telegramService = telegramService;
        }

        public async Task<bool> ProcessNotifications()
        {
            var returnUrl = _settings.ReturnBaseUrl;
            var resultList = new List<NotificationsToSendResult>();

            try
            {
                //GetNotigicationsToSendFromSP
                using (var command = _dbContext.Database.GetDbConnection().CreateCommand())
                {
                    var CommandText = $"EXEC spGetNotificationsToSend";
                    var connection = _dbContext.Database.GetDbConnection();
                    await connection.OpenAsync();
                    var results = await connection.QueryMultipleAsync(CommandText);
                    resultList = results.Read<NotificationsToSendResult>().ToList();
                }

                if (resultList.Count == 0) return true;
                
                foreach (var not in resultList)
                {
                    //Get If Entry Exists In Update Table
                    var checkTriggeredAlarmNotification = await _dbContext.TriggeredAlarmNotifications
                        .Where(rec => rec.AMRMeterTriggeredAlarmId == not.AMRMeterTriggeredAlarmId)
                        .FirstOrDefaultAsync();

                    if (checkTriggeredAlarmNotification == null)
                    {
                        //Add New 
                        var newTAN = new TriggeredAlarmNotification();
                        newTAN.TriggeredAlarmNotificationId = 0;
                        newTAN.UserId = not.UserId;
                        newTAN.AMRMeterTriggeredAlarmId = not.AMRMeterTriggeredAlarmId;
                        newTAN.NotificationSendTypeId = not.NotificationSendTypeId;
                        newTAN.Status = 1;
                        newTAN.CreatedDateTime = DateTime.Now;
                        newTAN.LastUdateDateTime = DateTime.Now;
                        newTAN.SendDateTime = null;
                        newTAN.Active = true;
                        newTAN.SendStatusMessage = null;
                        newTAN.MessageBody = null;
                        //Save
                        var saveRecord = _dbContext.TriggeredAlarmNotifications.Add(newTAN);
                        await _dbContext.SaveChangesAsync();
                    }

                    var sendTypeId = not.NotificationSendTypeId;
                    var sendEmail = not.NotificationEmailAddress;
                    var sendSocial = not.NotificationMobileNumber;

                    //Build Message To Send
                    var msg = $"Dear {not.FirstName},\r\n" +
                        $"UMFA ClientPortal Alarm\r\n" +
                        $"Building: {not.BuildingName}\r\n" +
                        $"MeterNo: {not.MeterNo}\r\n" +
                        $"Description: {not.Description}\r\n" +
                        $"Alarm: {not.AlarmName}\r\n" +
                        $"Alarm Description: {not.AlarmDescription}\r\n\r\n" +
                        $"Please Follow this link to Acknowledge Alarm: {returnUrl}\r\n\r\n" +
                        $"Internal Diagnostics: {JsonSerializer.SerializeToString(not)}";

                    bool sendResult = false;

                    //Send Notification
                    switch (sendTypeId)
                    {
                        case 1: //EMAIL
                            var mData = new MailData();
                            mData.To = sendEmail;
                            mData.Message = msg;
                            sendResult = await _mailService.SendAsync(mData, default);
                            break;
                        case 2: //WhatsApp
                            var wData = new WhatsAppData();
                            wData.PhoneNumber = sendSocial;
                            wData.Message = msg;
                            sendResult = await _whatsAppService.SendAsync(wData, default);
                            break;
                        case 3: //Telegram
                            var tData = new TelegramData();
                            tData.PhoneNumber = sendSocial;
                            tData.Message = msg;
                            sendResult = await _telegramService.SendAsync(tData, default);
                            break;
                    }

                    //UPDATE RECORD
                    var triggeredAlarmNotification = await _dbContext.TriggeredAlarmNotifications
                        .Where(rec => rec.AMRMeterTriggeredAlarmId == not.AMRMeterTriggeredAlarmId)
                        .FirstOrDefaultAsync();

                    if (sendResult == true) 
                    {
                        triggeredAlarmNotification.SendStatusMessage = "Success";
                    }
                    else
                    {
                        triggeredAlarmNotification.SendStatusMessage = "Failure";
                    }
                    triggeredAlarmNotification.MessageBody = msg;
                    triggeredAlarmNotification.SendDateTime = DateTime.Now;
                    _dbContext.Entry(triggeredAlarmNotification).State = EntityState.Modified;
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public string GetSendType(int sendTypeId)
        {
            switch (sendTypeId)
            {
                case 1:
                    return "Email";
                case 2:
                    return "Whatsapp";
                case 3:
                    return "Telegram";
                    
            }
            return "Email";
        }
    }

    public class NotificationsToSendResult
    {
        public int AMRMeterTriggeredAlarmId { get; set; }
        public int AMRMeterAlarmId { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NotificationEmailAddress { get; set; }
        public string NotificationMobileNumber { get; set; }
        public int BuildingId { get; set; }
        public int UmfaId { get; set; }
        public string BuildingName { get; set; }
        public int AMRMeterId { get; set; }
        public string MeterNo { get; set; }
        public string MeterSerial { get; set; }
        public string Description { get; set; }
        public string AlarmName { get; set; }
        public string AlarmDescription { get; set; }
        public DateTime OccStartDTM { get; set; }
        public int NotificationSendTypeId { get; set; }
        public string NotificationSendTypeName { get; set; }
    }

    
}

