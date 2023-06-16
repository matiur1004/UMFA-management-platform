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

        public async Task<bool> SendPortalAlarmAsync(WhatsAppData tData, CancellationToken ct = default)
        {
            using var client = new HttpClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                _settings.AuthToken);

            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var request = new
            {
                messaging_product = "whatsapp",
                recipient_type = "individual",
                to = tData.PhoneNumber,
                type = "template",
                template = new 
                {
                    name = _settings.TemplateName,
                    language = new { code = "en_US" },
                    components = new List<object>
                    {
                        new
                        {
                            type = "body",
                            parameters = new List<object>
                            {
                                new
                                {
                                    type = "text",
                                    text = tData.MeterNumber
                                },
                                new
                                {
                                    type = "text",
                                    text = tData.MeterName
                                },
                                new
                                {
                                    type = "text",
                                    text = tData.BuildingName
                                },
                                new
                                {
                                    type = "text",
                                    text = tData.AlarmName
                                },
                                new
                                {
                                    type = "text",
                                    text = tData.AlarmDescription
                                },
                            }
                        }
                    }
                }
            };

            var json = JsonConvert.SerializeObject(request);
            
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var whatsAppApiUrl = _settings.WhatsAppCloudApiBaseUrl +
                _settings.WhatsAppApiVersion +
                _settings.PhoneId +
                _settings.WhatsAppApiEndpoint;

            var responseString = "";


            var response = await client.PostAsync(whatsAppApiUrl, content);

            responseString = await response.Content.ReadAsStringAsync();

            return response.IsSuccessStatusCode;
        }
    }
}