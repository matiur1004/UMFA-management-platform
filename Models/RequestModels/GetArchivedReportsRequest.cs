using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class GetArchivedReportsRequest
    {
        [Required]
        public int? UserId { get; set; }
    }
}
