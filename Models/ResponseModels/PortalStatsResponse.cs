using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class PortalStatsResponse
    {
        public int Partners { get; set; }
        public int Clients { get; set; }
        public int Buildings { get; set; }
        public int Shops { get; set; }
        public int Tenants { get; set; }
        public int Users { get; set; }
        [JsonIgnore]
        public string Response { get; set; } = "";
    }
}
