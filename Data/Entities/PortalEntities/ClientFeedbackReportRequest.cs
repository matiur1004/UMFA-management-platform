using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Data.Entities.PortalEntities
{
    public class ClientFeedbackReportRequest
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string? BuildingIds { get; set; }

        [Required, MaxLength(50)]
        public string? SPeriod { get; set; }

        [Required, MaxLength(50)]
        public string? EPeriod { get; set; }

        [Required]
        public int ClientId { get; set; }

        [Url]
        public string? Url { get; set; }

        /// <summary>
        /// 1 = Requested 3 = Complete 4 = failed
        /// </summary>
        [Required]
        public int Status { get; set; }

        public string? StatusMessage { get; set; }

        [Required]
        public DateTime CreatedDTM { get; set; }

        [Required]
        public DateTime LastUpdateDTM { get; set; }

        [Required]
        public bool Active { get; set; }
    }
}
