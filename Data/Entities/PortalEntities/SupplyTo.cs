namespace ClientPortal.Data.Entities.PortalEntities
{
    public class SupplyTo
    {
        public int SupplyToId { get; set; }
        public int SupplyTypeId { get; set; }
        public string SupplyToName { get; set; }
        public bool Active { get; set; }
        public ICollection<SupplyToLocationType> SupplyToLocationTypes { get; set; }

        //navigation properties for referential integrity
        public SupplyType SupplyType { get; set; }
    }
}
