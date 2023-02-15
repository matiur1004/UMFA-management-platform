
namespace ClientPortal.Models
{
    public class AMRWaterProfileRequest
    {
        public int MeterId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TimeOnly NightFlowStart { get; set; }
        public TimeOnly NightFlowEnd { get; set; }
    }
}
