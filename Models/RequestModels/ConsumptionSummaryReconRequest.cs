using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class ConsumptionSummaryReconRequest
    {
        [Required]
        public int? PeriodId { get; set; }
    }
}
