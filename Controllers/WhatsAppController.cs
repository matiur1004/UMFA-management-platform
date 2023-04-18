using ClientPortal.Controllers.Authorization;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net.Http.Headers;

[Authorize]
[ApiController]
[Route("[controller]")]

public class WhatsAppController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly WhatsAppSettings _whatsAppSettings;

    public WhatsAppController(IOptions<WhatsAppSettings> whatsAppSettings, HttpClient httpClient)
    {
        _httpClient = httpClient;
        _whatsAppSettings = whatsAppSettings.Value;
    }

//{
//  "PhoneNumber": "+27794000821",
//  "Message": "Umfa Client-Portal Alarm \r\nLeak Flow Detection Alarm Triggered on Meter: 123234232 in Building 'The Lumierre' \r\nPlease Check Meter Urgently! \r\n\r\n(Please Do Not Respond to this message. This Number is not monitored.)\r\nThank You \r\nUmfa Client Portal"
//}

[HttpPost("sendWhatsAppMessage")]
    public async Task<IActionResult> SendMessage([FromBody] WhatsAppRequestModel model)
    {
        using (var client = new HttpClient())
        {
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _whatsAppSettings.WhatsAppLiveToken);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _whatsAppSettings.WhatsAppTestToken);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var request = new
            {
                messaging_product = "whatsapp",
                recipient_type = "individual",
                to = model.PhoneNumber,
                type = "text",
                text = new
                {
                    preview_url = false,
                    body = model.Message
                }
            };

            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            //var whatsAppApiUrl = _whatsAppSettings.WhatsAppCloudApiBaseUrl + _whatsAppSettings.WhatsAppApiVersion + _whatsAppSettings.WhatsAppLivePhoneId + _whatsAppSettings.WhatsAppApiEndpoint;
            //var response = await client.PostAsync(whatsAppApiUrl, content);

            var whatsAppApiUrl = _whatsAppSettings.WhatsAppCloudApiBaseUrl + _whatsAppSettings.WhatsAppApiVersion + _whatsAppSettings.WhatsAppTestPhoneId + _whatsAppSettings.WhatsAppApiEndpoint;
            var response = await client.PostAsync(whatsAppApiUrl, content);


            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();

            if(responseString != null)
            {
                return Ok(responseString);
            }
            return BadRequest(responseString);
        }
    }
}
public class WhatsAppRequestModel
{
    public string PhoneNumber { get; set; }
    public string Message { get; set; }

}