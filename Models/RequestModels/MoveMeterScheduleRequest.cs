using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class MoveMeterScheduleRequest
    {
        [Required]
        public int? MeterId { get; set; }

        [Required]
        public int? NewScheduleId { get; set; }

        [Required]
        public int? JobType { get; set; }
    }
}
