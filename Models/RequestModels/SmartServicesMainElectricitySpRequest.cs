using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class SmartServicesMainElectricitySpRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        // 1 = Daily 2 = Weekly 3 = Monthly 4 = Yearly
        [Required, Range(1, 4)]
        public int? PeriodType { get; set; }

        [Required]
        public DateTime? StartDate { get; set; }

        [Required]
        public DateTime? EndDate { get; set; }
    }
}
