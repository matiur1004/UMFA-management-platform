using DevExpress.Pdf.Native;
using DevExpress.XtraRichEdit.Model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Xml;
using System.Xml.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ClientPortal.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ScadaMetersController : ControllerBase
    {
        // GET: ScadaMeters/GetAsync
        [HttpGet]
        public async Task<string> GetAsync(string scadaUserName, string scadaUserPassword)
        {
            var scadaUrl = "https://umfaholdings-gideon.pnpscada.com:443/reportVarious.jsp?";
            var scadaUserParam = "LOGIN";
            var scadaUserParamValue = scadaUserName;
            var scadaUserPasswordParam = "PWD";
            var scadaUserPasswordValue = scadaUserPassword;
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
            doc.LoadXml(result);

            var meters = GetMeters(result);

            string jsonText = JsonConvert.SerializeXmlNode(doc);

            return jsonText;
        }

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
}

