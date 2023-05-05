using ClientPortal.Interfaces;
using ClientPortal.Models.MessagingModels;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace ClientPortal.Services
{
    public class WhatsAppService : IWhatsAppService
    {
        private readonly WhatsAppSettings _settings;
        public WhatsAppService(IOptions<WhatsAppSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task<bool> SendAsync(WhatsAppData tData, CancellationToken ct = default)
        {
            using var client = new HttpClient();

            //LIVE
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                _settings.WhatsAppLiveToken);
            //TEST
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            //  "Bearer",
            //  _settings.WhatsAppTestToken);

            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var request = new
            {
                messaging_product = "whatsapp",
                recipient_type = "individual",
                to = tData.PhoneNumber,
                type = "text",
                text = new { preview_url = false, body = tData.Message }
            };

            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            //LIVE
            var whatsAppApiUrl = _settings.WhatsAppCloudApiBaseUrl +
                _settings.WhatsAppApiVersion +
                _settings.WhatsAppLivePhoneId +
                _settings.WhatsAppApiEndpoint;

            //TEST
            //var whatsAppApiUrl = _settings.WhatsAppCloudApiBaseUrl +
            //_settings.WhatsAppApiVersion +
            //_settings.WhatsAppTestPhoneId +
            //_settings.WhatsAppApiEndpoint;

            var responseString = "";

            try
            {
                var response = await client.PostAsync(whatsAppApiUrl, content);
                //response.EnsureSuccessStatusCode();
                responseString = await response.Content.ReadAsStringAsync();
                return response.IsSuccessStatusCode;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}