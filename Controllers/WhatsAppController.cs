using DevExpress.Charts.Model;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

public class WhatsAppController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private const string _whatsappApiUrl = "https://api.chat-api.com/instance/<INSTANCE_ID>/message?token=<TOKEN>";

    public WhatsAppController()
    {
        _httpClient = new HttpClient();
    }

    public async Task<HttpResponseMessage> SendMessage(string phoneNumber, string message)
    {
        var requestBody = new
        {
            phone = phoneNumber,
            body = message
        };

        var requestBodyJson = JsonConvert.SerializeObject(requestBody);
        var requestBodyContent = new StringContent(requestBodyJson, Encoding.UTF8, "application/json");

        var request = new HttpRequestMessage(HttpMethod.Post, _whatsappApiUrl)
        {
            Content = requestBodyContent
        };

        var response = await _httpClient.SendAsync(request);
        return response;
    }
}
