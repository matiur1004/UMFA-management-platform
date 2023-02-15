
using Microsoft.EntityFrameworkCore;

namespace ClientPortal.Data.Entities
{
    [Serializable]
    [Keyless]
    public class AMRWaterProfileHeader
    {
        public int MeterId { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal MaxFlow { get; set; }
        public DateTime MaxFlowDate { get; set; }
        public decimal NightFlow { get; set; }
        public decimal PeriodUsage { get; set; }
        public decimal DataPercentage { get; set; }
        public List<WaterProfile> Profile { get; set; }
    }

    [Serializable]
    [Keyless]
    public class WaterProfile
    {
        public DateTime ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }
}
