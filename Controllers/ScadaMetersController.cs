using ClientPortal.Controllers.Authorization;
using Newtonsoft.Json;
using System.Xml;
using System.Xml.Linq;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ScadaMetersController : ControllerBase
    {

        // GET: ScadaMeters/GetAsync
        [HttpPost("GetAsync")]
        public async Task<string> GetAsync([FromBody] GetUserAndPassword UserObj)
        {
            var scadaUrl = $"https://{UserObj.Domain}-gideon.pnpscada.com:443/reportVarious.jsp?";
            var scadaUserParam = "LOGIN";
            var scadaUserParamValue = $"{UserObj.Domain}.{UserObj.ScadaUserName}";
            var scadaUserPasswordParam = "PWD";
            var scadaUserPasswordValue = UserObj.ScadaUserPassword;
            var scadaReportParam = "report";
            var scadaReportValue = "Meters+Properties";
            var scadaAllResultsParam = "all";
            var scadaAllResultsValue = "1";
            var scadaDocumentTypeParam = "type";
            var scadaDocumentTypeValue = "xml";

            using var client = new HttpClient();

            var builder = new UriBuilder(scadaUrl);
            builder.Query = string.Format(
                "{0}={1}&{2}={3}&{4}={5}&{6}={7}&{8}={9}",
                scadaUserParam,
                scadaUserParamValue,
                scadaUserPasswordParam,
                scadaUserPasswordValue,
                scadaReportParam,
                scadaReportValue,
                scadaAllResultsParam,
                scadaAllResultsValue,
                scadaDocumentTypeParam,
                scadaDocumentTypeValue);
            var scadaCallUrl = builder.ToString();

            var res = await client.GetAsync(scadaCallUrl);

            var result = await res.Content.ReadAsStringAsync();
            XmlDocument doc = new XmlDocument();
            result = result.Replace(':', '-');
            doc.LoadXml(result);

            string jsonText = JsonConvert.SerializeXmlNode(doc);

            return jsonText;
        }

        // GET: ScadaMeters/GetAsync
        [HttpGet("GeMeters")]
        public List<MeterItem> GetMeters(string result)
        {
            var _meterItems = new List<MeterItem>();

            XElement element = XElement.Parse(result);
            foreach (var meterLine in element.Elements())
            {
                _meterItems.Add(new MeterItem(meterLine.Element("SerialNo").Value, meterLine.Element("Name").Value));
            }

            return _meterItems;
        }
    }

    public class MeterItem
    {

        public MeterItem(string serialNo, string name)
        {
            SerialNo = serialNo;
            Name = name;
        }
        public string SerialNo { get; set; }
        public string Name { get; set; }

    }

    public class GetUserAndPassword
    {
        public string Domain { get; set; }
        public string ScadaUserName { get; set; }
        public string ScadaUserPassword { get; set; }
    }
}
