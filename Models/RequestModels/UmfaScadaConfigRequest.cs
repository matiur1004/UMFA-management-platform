using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class UmfaScadaConfigRequest
    {
        [Required]
        public int? PartnerId { get; set; }

        [Required]
        public int? UmfaUserId { get; set; }
    }
}
