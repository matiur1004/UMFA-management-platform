using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Interfaces;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;
using System.Dynamic;

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

        public async Task<bool> SendAsync(NotificationData tData, CancellationToken ct = default)
        {
            var returnUrl = _settings.ReturnBaseUrl;
            var resultList = new List<string>();

            using (var command = _dbContext.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "spGetNotificationsToSend";
                command.CommandType = System.Data.CommandType.StoredProcedure;
                _dbContext.Database.OpenConnection();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        dynamic result = new ExpandoObject();
                        var dictionary = result as IDictionary<string, object>;

                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            dictionary.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader[i]);
                        }
                        resultList.Add(result);
                    }
                }
            }

            var notificationsToSend = _dbContext.Database.ExecuteSqlRawAsync(returnUrl, ct).Result;
            try
            {
                //foreach (var notification in notificationsToSend)
                //{

                //}
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }
    }

    public class NotificationData
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Type { get; set; }

    }
}

