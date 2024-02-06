using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Models.ResponseModels
{
    public class AMRMeterResponseList
    {
        public string Message = "";
        public List<AMRMeterResponse> AMRMeterResponses { get; set; }

        public AMRMeterResponseList() { }
    }
    public class AMRMeterResponse
    {
        public int Id { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
        public int BuildingId { get; set; }
        public string BuildingName { get; set; }
        public int UmfaId { get; set; }
        public int MakeModelId { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public int Phase { get; set; }
        public int CbSize { get; set; }
        public int CtSizePrim { get; set; }
        public int CtSizeSec { get; set; }
        public float ProgFact { get; set; }
        public int Digits { get; set; }
        public bool Active { get; set; }
        public string? CommsId { get; set; }
        public string MeterSerial { get; set; }
        public int UtilityId { get; set; }
        public string Utility { get; set; }

        public AmrMeterResponseScadaDetails? ScadaProfilesDetails { get; set; }
        public AmrMeterResponseScadaDetails? ScadaReadingsDetails { get; set; }


        public AMRMeterResponse() { }

        public AMRMeterResponse(AMRMeter meter)
        {
            Id = meter.Id;
            MeterNo = meter.MeterNo;
            Description = meter.Description;
            UserId = meter.UserId;
            BuildingId = meter.BuildingId;
            UmfaId = meter.BuildingId;
            MakeModelId = meter.MakeModelId;
            Make = meter.MakeModel.Make;
            Model = meter.MakeModel.Model;
            Phase = meter.Phase;
            CbSize = meter.CbSize;
            CtSizePrim = meter.CtSizePrim;
            CtSizeSec = meter.CtSizeSec;
            ProgFact = meter.ProgFact;
            Digits = meter.Digits;
            Active = meter.Active;
            CommsId = meter.CommsId;
            MeterSerial = meter.MeterSerial ?? meter.MeterNo;
        }

        public AMRMeterResponse(AMRMeter meter, ScadaRequestDetail? profileDetail, ScadaRequestDetail? readingDetail)
        {

            Id = meter.Id;
            MeterNo = meter.MeterNo;
            Description = meter.Description;
            UserId = meter.UserId;
            BuildingId = meter.BuildingId;
            UmfaId = meter.BuildingId;
            MakeModelId = meter.MakeModelId;
            Make = meter.MakeModel.Make;
            Model = meter.MakeModel.Model;
            Phase = meter.Phase;
            CbSize = meter.CbSize;
            CtSizePrim = meter.CtSizePrim;
            CtSizeSec = meter.CtSizeSec;
            ProgFact = meter.ProgFact;
            Digits = meter.Digits;
            Active = meter.Active;
            CommsId = meter.CommsId;
            MeterSerial = meter.MeterSerial ?? meter.MeterNo;

            ScadaProfilesDetails = new AmrMeterResponseScadaDetails(profileDetail);
            ScadaReadingsDetails = new AmrMeterResponseScadaDetails(readingDetail);
        }
    }

    public class AmrMeterResponseScadaDetails
    {
        public int HeaderId { get; set; }
        public string ScheduleName { get; set; }
        public DateTime? LastRunDate { get; set; }
        public DateTime? LastDataDate { get; set; }

        public AmrMeterResponseScadaDetails(ScadaRequestDetail? detail)
        {
            if(detail is not null)
            {
                HeaderId = detail.HeaderId;
                ScheduleName = detail.Header.Description;
                LastRunDate = detail.LastRunDTM;
                LastDataDate = detail.LastDataDate;
            }
        }
    }
}
