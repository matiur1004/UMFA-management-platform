using ClientPortal.Interfaces;
using ClientPortal.Models.MessagingModels;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace ClientPortal.Services
{
    public class TelegramService : ITelegramService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private readonly string _botToken;
        private readonly TelegramSettings _settings;

        public TelegramService(string botToken, IOptions<TelegramSettings> settings)
        {
            _settings = settings.Value;
            _botToken = _settings.TelegramBotToken;
            _baseUrl = $"https://api.telegram.org/bot{_botToken}/";
            _httpClient = new HttpClient();
        }

        public async Task<bool> SendAsync(TelegramData tData, CancellationToken ct)
        {
            var endpoint = $"{_baseUrl}sendMessage";
            var data = new
            {
                chat_id = tData.PhoneNumber,
                text = tData.Message
            };

            var jsonData = JsonConvert.SerializeObject(data);
            var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(endpoint, content);
            return response.IsSuccessStatusCode;
        }
    }
}