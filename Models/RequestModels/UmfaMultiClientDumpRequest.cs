using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaMultiClientDumpRequest
    {
        [Required]
        public string? BuildingIds { get; set; }

        [Required, MaxLength(50)]
        public string? SPeriod { get; set; }

        [Required, MaxLength(50)]
        public string? EPeriod { get; set; }

        [Required]
        public int ClientId { get; set; }
    }
}
