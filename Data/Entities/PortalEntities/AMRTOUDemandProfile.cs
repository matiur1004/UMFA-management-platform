using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    [Keyless]
    public class DemandProfileHeader
    {
        public int MeterId { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal MaxDemand { get; set; }
        public DateTime MaxDemandDate { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal PeriodUsage { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal DataPercentage { get; set; }
        public double PeakUsage { get; set; }
        public double StandardUsage { get; set; }
        public double OffPeakUsage { get; set; }
        public double PeakDemand { get; set; }
        public double StandardDemand { get; set; }
        public double OffPeakDemand { get; set; }
        public List<DemandProfile> Profile { get; set; }
    }

    [Serializable]
    [Keyless]
    public class DemandProfile
    {
        public DateTime ReadingDate { get; set; }
        public string ShortName { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal Demand { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal ActEnergy { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal ReActEnergy { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }
}
