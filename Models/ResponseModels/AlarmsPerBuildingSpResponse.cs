namespace ClientPortal.Models.ResponseModels
{
    public class AlarmsPerBuildingSpResponse
    {
        public List<AlarmsPerBuildingEntry> Entries { get; set; }
    }

    public class AlarmsPerBuildingEntry
    {
        public int PartnerId {get; set;}
        public string Partner {get; set;}
        public int BuildingId {get; set;}
        public string BuildingName {get; set;}
        public int NoOfAlarms { get; set; }
    }
}
