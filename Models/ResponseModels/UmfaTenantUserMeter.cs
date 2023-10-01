namespace ClientPortal.Models.ResponseModels
{
    public class UmfaTenantUserMeter
    {
        public int BuildingID { get; set; }
        public int BuildingServiceID { get; set; }
        public string? MeterNo { get; set; }
        public string? Name { get; set; }
        public string? ScadaSerialNumber { get; set; }
    }
}
