using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipDataResponse
    {
        // [JsonPropertyName("header")]
        public TenantSlipDataHeader? Header { get; set; }

        // [JsonPropertyName("details")]
        public List<TenantSlipDataDetails> Details { get; set; }

        // [JsonPropertyName("meterReadings")]
        public List<TenantSlipDataMeterReadings> MeterReadings { get; set; }

        // [JsonPropertyName("graphData")]
        public List<TenantSlipDataGraphData> GraphData { get; set; }

        // [JsonPropertyName("fileName")]
        public string? FileName { get; set; }

        public TenantSlipDataResponse() { }
        public TenantSlipDataResponse(TenantSlipDataSpResponse response) 
        {
            Header = response.Headers.FirstOrDefault();
            Details = response.Details;
            MeterReadings = response.MeterReadings;
            GraphData = response.GraphData;
        }
    }
}
