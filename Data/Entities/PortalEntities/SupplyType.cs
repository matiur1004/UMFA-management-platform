namespace ClientPortal.Data.Entities.PortalEntities
{
    public class SupplyType
    {
        public int SupplyTypeId { get; set; }
        public string SupplyTypeName { get; set; }
        public bool Active { get; set; } = true;
        public ICollection<SupplyTo> SupplyTos { get; set; }
    }
}
