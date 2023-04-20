using ClientPortal.Interfaces;
using ClientPortal.Models.MessagingModels;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace ClientPortal.Services
{
    public class WhatsAppService : IWhatsAppService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private readonly string _botToken;
        private readonly WhatsAppSettings _settings;

        public WhatsAppService(string botToken, IOptions<WhatsAppSettings> settings)
        {
            _settings = settings.Value;
            _botToken = _settings.WhatsAppLiveToken;
            _baseUrl = $"https://api.telegram.org/bot{_botToken}/";
            _httpClient = new HttpClient();
        }

        public async Task<bool> SendAsync(WhatsAppData tData, CancellationToken ct)
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