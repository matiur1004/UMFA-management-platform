namespace ClientPortal.Models.ResponseModels
{
    public class GetSmartServicesSpResponse
    {
        public List<SmartServiceSet> SmartServices { get; set; }
    }

    public class SmartServiceSet
    {
        public int BuildingId { get; set; }
        public int TotalSmart { get; set; }
        public int Electricity { get; set; }
        public int Water { get; set; }
        public int Solar { get; set; }
        public int Council_Check { get; set; }
        public int Bulk { get; set; }
        public int Generator { get; set; }
    }
}
