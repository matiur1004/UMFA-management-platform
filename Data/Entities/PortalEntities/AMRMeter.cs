using ClientPortal.Models.RequestModels;
using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]

    [Index(nameof(MeterNo), IsUnique = true)]
    public class AMRMeter
    {
        public int Id { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public int MakeModelId { get; set; }
        public MeterMakeModel MakeModel { get; set; }
        public int Phase { get; set; }
        public int CbSize { get; set; }
        public int CtSizePrim { get; set; }
        public int CtSizeSec { get; set; }
        public float ProgFact { get; set; }
        public int Digits { get; set; }
        public bool Active { get; set; }
        public string CommsId { get; set; }
        public string MeterSerial { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int BuildingId { get; set; }
        [JsonIgnore]
        public List<ScadaRequestDetail> ScadaRequestDetails { get; set; }
        [JsonIgnore]
        public List<ProfileData> ProfileData { get; set; }
        [JsonIgnore]
        public Building Building { get; set; }
        [JsonIgnore]
        public List<AMRMeterAlarm> AMRMeterAlarms { get; set; }

        public AMRMeter() { }
        public AMRMeter(AMRMeterRequest meterReq, User user, Building building)
        {
            MeterNo = meterReq.MeterNo;
            Description = meterReq.Description;
            MakeModelId = meterReq.MakeModelId;
            Phase = meterReq.Phase;
            CbSize = meterReq.CbSize;
            CtSizePrim = meterReq.CtSizePrim;
            CtSizeSec = meterReq.CtSizeSec;
            ProgFact = meterReq.ProgFact;
            Digits = meterReq.Digits;
            Active = meterReq.Active;
            CommsId = meterReq.CommsId;
            MeterSerial = meterReq.CommsId != null && meterReq.MeterSerial == null ? meterReq.MeterNo : meterReq.MeterSerial;
            UserId = user.Id;
            BuildingId = building.UmfaId;
        }
    }
}
