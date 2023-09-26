using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.MessagingModels
{
    public class FeedbackReportRequestData
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? PeriodId { get; set; }
    }
}
