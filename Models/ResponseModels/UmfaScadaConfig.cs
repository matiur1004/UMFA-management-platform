using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class UmfaScadaConfig
    {
        [JsonPropertyName("Domain")]
        public string Domain { get; set; }
        [JsonPropertyName("Player")]
        public string ScadaUserName { get; set; }
        [JsonPropertyName("Phrase")]
        public string ScadaUserPassword { get; set; }
    }

    public class UmfaScadaConfigResponse
    {
        public string Domain { get; set; }
        public string ScadaUserName { get; set; }
        public string ScadaUserPassword { get; set; }
    }
}
