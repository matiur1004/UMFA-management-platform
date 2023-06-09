using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Data.Entities.PortalEntities
{
    public class MappedMeter
    {
        [Key]
        public int MappedMeterId { get; set; }
        public int BuildingId { get; set; }
        public string BuildingName { get; set; }
        public int PartnerId { get; set; }
        public string PartnerName { get; set; }
        public int BuildingServiceId { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public string UmfaDescription { get; set; }
        public string ScadaSerial { get; set; }
        public string ScadaDescription { get; set; }
        public string RegisterType { get; set; }
        public string TOUHeader { get; set; }
        public string SupplyType { get; set; }
        public string SupplyTo { get; set; }
        public string LocationType { get; set;}
        public int UserId { get; set; }

        public void Map(MappedMeter source)
        {
            BuildingId = source.BuildingId;
            BuildingName = source.BuildingName;
            PartnerId = source.PartnerId;
            PartnerName = source.PartnerName;
            BuildingServiceId = source.BuildingServiceId;
            MeterNo = source.MeterNo;
            Description = source.Description;
            UmfaDescription = source.UmfaDescription;
            ScadaSerial = source.ScadaSerial;
            ScadaDescription = source.ScadaDescription;
            RegisterType = source.RegisterType;
            TOUHeader = source.TOUHeader;
            SupplyType = source.SupplyType;
            SupplyTo = source.SupplyTo;
            LocationType = source.LocationType;
            UserId = source.UserId;
        }
    }
}