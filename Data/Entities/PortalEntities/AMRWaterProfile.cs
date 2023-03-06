
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClientPortal.Data.Entities.PortalEntities
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
        [Column(TypeName = "decimal(18, 4)")]
        public decimal MaxFlow { get; set; }
        public DateTime MaxFlowDate { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal NightFlow { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal PeriodUsage { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal DataPercentage { get; set; }
        public List<WaterProfile> Profile { get; set; }
    }

    [Serializable]
    [Keyless]
    public class WaterProfile
    {
        public DateTime ReadingDate { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }
}
