namespace ClientPortal.Models.ResponseModels
{
    public class SmartServiceTenantSpResponse
    {
        public List<SmartServicesTenantStats> SmartServices { get; set; }
    }

    public class SmartServicesTenantStats
    {
        public int TotalSmart { get; set; }
        public int Electricity { get; set; }
        public int Water { get; }
    }
}
