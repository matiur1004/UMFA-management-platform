namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipDataResponse
    {
        public TenantSlipDataHeader? Header { get; set; }
        public List<TenantSlipDataDetails> Details { get; set; }
        public List<TenantSlipDataMeterReadings> MeterReadings { get; set; }
        public List<TenantSlipDataGraphData> GraphData { get; set; }

        public TenantSlipDataResponse(TenantSlipDataSpResponse response) 
        {
            Header = response.Headers.FirstOrDefault();
            Details = response.Details;
            MeterReadings = response.MeterReadings;
            GraphData = response.GraphData;
        }
    }
}
