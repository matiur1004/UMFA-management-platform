
using System.ComponentModel.DataAnnotations.Schema;

namespace ClientPortal.Data.Entities
{
    [Serializable]
    public class ProfileData
    {
        public int Id { get; set; }
        public int AmrMeterId { get; set; }
        public AMRMeter AmrMeter { get; set; }
        public DateTime ReadingDTM { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int DayOfMonth { get; set; }
        public int TouDaysOfWeekId { get; set; }
        public TOUDaysOfWeek TouDaysOfWeek { get; set; }
        public int TouHalfHourId { get; set; }
        public TOUHalfHour TOUHalfHour { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal ActiveEnergyReading { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal ReActiveEnergyReading { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal DemandReading { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal ActiveEnergyUsage { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal ReActiveEnergyUsage { get; set; }
        public bool Calculated { get; set; }
        public bool Active { get; set; }
    }
}
