using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class AmrDemandProfileAlarmsSpRequest
    {
        [Required]
        public int? MeterId { get; set; }

        [Required]
        public DateTime? SDate { get; set; }

        [Required]
        public DateTime? EDate { get; set; }

        [Required]
        public string? NightFlowStart { get; set; }

        [Required]
        public string? NightFlowEnd { get; set; }

        [Required]
        public bool? ApplyNightFlow { get; set; }
    }
}
