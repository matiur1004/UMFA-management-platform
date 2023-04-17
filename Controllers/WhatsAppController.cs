using DevExpress.Charts.Model;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using Dapper;
using ClientPortal.Controllers;

//WHATSAPP BUSINESS CREDENTIALS
//marketing@umfa.co.za
//Shining-Slip-Reopen-Treason
//+27674148318
//Bearer Token
//EAALDEr686ZAoBAMeTIZCIvpxASMeR5ZBChQVFhyDw7u0GILHmv5ZBc63dIKI3NW3zGcug3BO4QZBAHmB6EUyzmJXc6e5adZCV1ZBxZA2A6GGRe1kkkLVgQ7gbQ97LFQCv1opN2ARSsc079tLnHHunYvMPSbpTs4ZA6aBW088nGrfGfGSdsvPYGZBpTcqlyXD0l3ZAOWbop0oKaxnwZDZD
//WABA ID: 4854103951344634
//API: https://graph.facebook.com/{{Version}}4854103951344634/{{Phone-Number-ID}}/messages
//https://developers.facebook.com/docs/whatsapp/on-premises

[Authorize]
[ApiController]
[Route("[controller]")]

public class WhatsAppController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private const string _whatsappApiUrl = "https://api.chat-api.com/instance/<INSTANCE_ID>/message?token='EAALDEr686ZAoBAMeTIZCIvpxASMeR5ZBChQVFhyDw7u0GILHmv5ZBc63dIKI3NW3zGcug3BO4QZBAHmB6EUyzmJXc6e5adZCV1ZBxZA2A6GGRe1kkkLVgQ7gbQ97LFQCv1opN2ARSsc079tLnHHunYvMPSbpTs4ZA6aBW088nGrfGfGSdsvPYGZBpTcqlyXD0l3ZAOWbop0oKaxnwZDZD'";

    public WhatsAppController()
    {
        _httpClient = new HttpClient();
    }

    [HttpPost("sendWhatsAppMessage")]
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

    //public async Task<ActionResult<AlarmConfigBurstPipeResultModel>> SendWhatsAppMessage([FromBody] WhatsAppRequestModel model)
    //{

    //}

    

}
public class WhatsAppRequestModel
{
    public string PhoneNumber { get; set; }
    public string Message { get; set; }

}