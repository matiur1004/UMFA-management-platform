using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;


namespace ClientPortal.Data.Entities.PortalEntities
{
    public class FeedbackReportRequest
    {
        [Key]
        [Required]
        public int FeedbackReportRequestId { get; set; }

        [Required]
        public int BuildingId { get; set; }

        [Required]
        public int PeriodId { get; set; }

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
