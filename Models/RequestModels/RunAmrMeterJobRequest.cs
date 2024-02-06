using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class RunAmrMeterJobRequest
    {
        [Required]
        public int? MeterId { get; set; }

        [Required]
        public int? JobType { get; set; }
    }
}
