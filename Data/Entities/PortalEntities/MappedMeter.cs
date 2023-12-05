using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        
        [NotMapped, Required]
        public int? RegisterTypeId { get; set; }
        public string RegisterType { get; set; }

        [NotMapped, Required]
        public int? TOUId { get; set; }
        public string TOUHeader { get; set; }
        public int SupplyTypeId { get; set; }
        public int SupplyToId { get; set; }
        public int LocationTypeId { get; set;}
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
            RegisterTypeId = source.RegisterTypeId;
            TOUHeader = source.TOUHeader;
            TOUId = source.TOUId;
            SupplyTypeId = source.SupplyTypeId;
            SupplyToId = source.SupplyToId;
            LocationTypeId = source.LocationTypeId;
            UserId = source.UserId;
        }
    }
}