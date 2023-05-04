using System.ComponentModel.DataAnnotations.Schema;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class AMRMeterTriggeredAlarm
    {
        public int AMRMeterTriggeredAlarmId { get; set; }
        public int AMRMeterAlarmId { get; set; }
        public AMRMeterAlarm AMRMeterAlarm { get; set; }
        public DateTime OccStartDTM { get; set; }
        public DateTime OccEndDTM { get; set; }
        [Column(TypeName = "decimal(18,6)")]
        public decimal Threshold { get; set; }
        public int Duration { get; set; }
        [Column(TypeName = "decimal(18,6)")]
        public decimal AverageObserved { get; set; }
        [Column(TypeName = "decimal(18,6)")]
        public decimal MaximumObserved { get; set; }
        public DateTime CreatedDTM { get; set; }
        public DateTime UpdatedDTM { get; set; }
        public bool Acknowledged { get; set; }
        public bool Active { get; set; }
    }
}
