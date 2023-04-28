using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class AuthRequest
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
