using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Models.RequestModels
{
    public class MappedMeterSpRequest
    {
        public int MappedId { get; set; } = 0;
        public int BuildingId { get; set; }
        public int BuildingServiceId { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public string Key1 { get; set; }
        public string Key2 { get; set; }
        public int RegisterTypeId { get; set; }
        public int TOUHeaderId { get; set; }

        public MappedMeterSpRequest() { }
        public MappedMeterSpRequest(MappedMeter meter)
        {
            BuildingId = meter.BuildingId;
            BuildingServiceId = meter.BuildingServiceId;
            MeterNo = meter.MeterNo;
            Description = meter.Description;
            Key1 = meter.ScadaSerial;
            Key2 = meter.ScadaDescription;
            RegisterTypeId = (int)meter.RegisterTypeId!;
            TOUHeaderId = (int)meter.TOUId!;
        }
    }
}
