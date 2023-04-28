using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class AMRMeterRequest
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string MeterNo { get; set; }
        public string Description { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int BuildingId { get; set; }
        public string BuildingName { get; set; }
        [Required]
        public int UmfaId { get; set; }
        [Required]
        public int MakeModelId { get; set; }
        [Required]
        public string Make { get; set; }
        [Required]
        public string Model { get; set; }
        [Required]
        public int Phase { get; set; }
        [Required]
        public int CbSize { get; set; }
        [Required]
        public int CtSizePrim { get; set; }
        [Required]
        public int CtSizeSec { get; set; }
        [Required]
        public float ProgFact { get; set; }
        [Required]
        public int Digits { get; set; }
        [Required]
        public bool Active{ get; set; }
        public string CommsId { get; set; }
        public string MeterSerial { get; set; }
        public int UtilityId { get; set; }
        public string Utility { get; set; }
    }

    public class AMRMeterUpdateRequest
    {
        public int UserId { get; set; }
        public AMRMeterRequest Meter { get; set; }
    }
}
