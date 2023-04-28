
namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class MeterMakeModel
    {
        public int Id { get; set; }
        public int UtilityId { get; set; }
        public Utility Utility { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }
        public List<AMRMeter> AMRMeters { get; set; }
    }
}
