namespace ClientPortal.Models.ResponseModels
{
    public class UmfaUserClientPartnerBuildingEntry
    {
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string PartnerName { get; set; }
        public int BuildingId { get; set; }
        public string BuildingName { get; set; }
        public bool BuildingActive { get; set; }
    }
}
