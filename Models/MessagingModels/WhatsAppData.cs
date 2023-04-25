
using Newtonsoft.Json;

namespace ClientPortal.Models.MessagingModels
{
    public class WhatsAppData
    {
        public string PhoneNumber { get; set; }
        public string Message { get; set; }

    }

    public class WhatsAppTemplateModel
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("language")]
        public string Language { get; set; }

        [JsonProperty("params")]
        public WhatsAppTemplateParametersModel Parameters { get; set; }
    }

    public class WhatsAppTemplateParametersModel
    {
        [JsonProperty("param1")]
        public string Parameter1 { get; set; }

        [JsonProperty("param2")]
        public string Parameter2 { get; set; }

        [JsonProperty("param3")]
        public string Parameter3 { get; set; }

        [JsonProperty("param4")]
        public string Parameter4 { get; set; }

        [JsonProperty("param5")]
        public string Parameter5 { get; set; }
    }

}
