using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaUserIdRequest
    {
        [Required]
        public int? UserId { get; set; } 
    }
}
