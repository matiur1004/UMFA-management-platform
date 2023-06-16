using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Interfaces;
using ClientPortal.Models.MessagingModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace ClientPortal.Services
{
    public class NotificationService : INotificationService
    {
        private readonly NotificationSettings _settings;
        private readonly PortalDBContext _dbContext;
        private readonly IMailService _mailService;
        private readonly IWhatsAppService _whatsAppService;
        private readonly ITelegramService _telegramService;
        private readonly INotificationRepository _notificationRepository;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(IOptions<NotificationSettings> settings, PortalDBContext dBContext, IMailService mailService, IWhatsAppService whatsAppService, ITelegramService telegramService, INotificationRepository notificationRepository, ILogger<NotificationService> logger)
        {
            _settings = settings.Value;
            _dbContext = dBContext;
            _mailService = mailService;
            _whatsAppService = whatsAppService;
            _telegramService = telegramService;
            _notificationRepository = notificationRepository;
            _logger = logger;
        }

        private string BuildNotificationMessage(NotificationToSend notification)
        {
            var returnUrl = $"{_settings.ReturnBaseUrl}ClientPortal/alarm_triggered/{notification.AMRMeterTriggeredAlarmId}";

            var msg = $"Dear {notification.FirstName},\r\n" +
                $"UMFA ClientPortal Alarm\r\n" +
                $"Building: {notification.BuildingName}\r\n" +
                $"MeterNo: {notification.MeterNo}\r\n" +
                $"Description: {notification.Description}\r\n" +
                $"Alarm: {notification.AlarmName}\r\n" +
                $"Alarm Description: {notification.AlarmDescription}\r\n\r\n" +
                $"Please Follow this link to Acknowledge Alarm: {returnUrl}\r\n\r\n";

            return msg;
        }
        
        public async Task SendPendingNotifications()
        {
            try
            {
                var notifications = await _notificationRepository.GetAllAsync(n => n.Status.Equals(1) || n.Status.Equals(3));

                if(notifications is null)
                {
                    return;
                }

                foreach (var notification in notifications.Where(n => !string.IsNullOrWhiteSpace(n.MessageAddress) && !string.IsNullOrWhiteSpace(n.MessageBody)))
                {
                    try
                    {
                        bool sendResult = false;

                        try
                        {
                            //Send Notification
                            switch (notification.NotificationSendTypeId)
                            {
                                case 1: //EMAIL
                                    var mData = new MailData();
                                    mData.To = notification.MessageAddress!;
                                    mData.Message = notification.MessageBody!;
                                    sendResult = await _mailService.SendAsync(mData, default);
                                    break;
                                case 2: //WhatsApp
                                    var wData = new WhatsAppData(JsonSerializer.Deserialize<NotificationToSend>(notification.MessageBody));
                                    sendResult = await _whatsAppService.SendPortalAlarmAsync(wData, default);
                                    break;
                                case 3: //Telegram
                                    var tData = new TelegramData();
                                    tData.PhoneNumber = notification.MessageAddress!;
                                    tData.Message = notification.MessageBody!;
                                    sendResult = await _telegramService.SendAsync(tData, default);
                                    break;
                            }

                            notification.RetryCount += notification.Status == 3 ? 1 : 0;

                            if (sendResult)
                            {
                                notification.Status = 2;
                                notification.SendStatusMessage = "Success";
                                notification.SendDateTime = DateTime.UtcNow;
                            }
                            else
                            {
                                notification.Status = 3;
                                notification.SendStatusMessage = "Failure";
                            }
                        }
                        catch(Exception e)
                        {
                            _logger.LogError(e, "Could not send notification message");
                            notification.SendStatusMessage = e.Message;
                            notification.RetryCount += notification.Status == 3 ? 1 : 0;
                            notification.Status = 3;
                            
                        }
                        
                        notification.LastUdateDateTime = DateTime.UtcNow;

                        await _notificationRepository.UpdateAsync(notification);
                    }
                    catch (Exception e)
                    {
                        _logger.LogError(e, $"Error while Updating database for notification {notification.TriggeredAlarmNotificationId}");
                    }
                }
            }
            catch (Exception)
            {
                _logger.LogError("Could not retrieve Notifications to send");
            }

            return;
        }

        public async Task<NotificationsToSendSpResponse> GetNotificationsToSendAsync()
        {
            var notifications = await _notificationRepository.GetNotificationsToSendAsync();

            foreach(var notification in notifications.NotificationsToSend)
            {
                try
                {
                    var newNotification = new TriggeredAlarmNotification
                    {
                        UserId = (int)notification.UserId!,
                        AMRMeterTriggeredAlarmId = (int)notification.AMRMeterTriggeredAlarmId!,
                        NotificationSendTypeId = notification.NotificationSendTypeId,
                        Status = 1,
                        CreatedDateTime = DateTime.UtcNow,
                        LastUdateDateTime = DateTime.UtcNow,
                        Active = true,
                        SendStatusMessage = "Pending",
                        MessageBody = JsonSerializer.Serialize(notification),
                        MessageAddress = notification.NotificationSendTypeId == 1 ? notification.NotificationEmailAddress : notification.NotificationMobileNumber,
                        RetryCount = 0,
                    };

                    await _notificationRepository.AddAsync(newNotification);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "Error while saving new notification to DB");
                }
            }

            return notifications;
        }
    }
}

