
namespace ClientPortal.Models
{
    public class AMRDemandProfileRequest
    {
        public int MeterId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TOUHeaderId { get; set; }
    }
}
