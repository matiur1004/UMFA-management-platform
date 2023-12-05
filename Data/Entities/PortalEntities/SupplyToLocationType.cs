namespace ClientPortal.Data.Entities.PortalEntities
{
    public class SupplyToLocationType
    {
        public int SupplyToLocationTypeId { get; set; }
        public int SupplyToId { get; set; }
        public string SupplyToLocationName { get; set; }
        public bool Active { get; set; }
        //Navigation properties for referential integrity
        public SupplyTo SupplyTo { get; set; }
    }
}
