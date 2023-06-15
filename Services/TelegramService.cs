using ClientPortal.Interfaces;
using ClientPortal.Models.MessagingModels;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace ClientPortal.Services
{
    public class TelegramService : ITelegramService
    {
        private readonly TelegramSettings _settings;

        public TelegramService(IOptions<TelegramSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task<bool> SendAsync(TelegramData tData, CancellationToken ct = default)
        {
            var botToken = _settings.TelegramBotToken;
            var baseUrl = _settings.TelegramCloudApiBaseUrl + _settings.TelegramApiEndPoint + $"{botToken}/";
            var endpoint = $"{baseUrl}sendMessage";
            var httpClient = new HttpClient();

            var data = new
            {
                chat_id = tData.PhoneNumber,
                text = tData.Message
            };

            var jsonData = JsonConvert.SerializeObject(data);
            var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync(endpoint, content);
            return response.IsSuccessStatusCode;
        }
    }
}