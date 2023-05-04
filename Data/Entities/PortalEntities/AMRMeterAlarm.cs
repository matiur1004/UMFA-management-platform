using System.ComponentModel.DataAnnotations.Schema;

namespace ClientPortal.Data.Entities.PortalEntities
{
    public class AMRMeterAlarm
    {
        public int AMRMeterAlarmId { get; set; }
        public int AlarmTypeId { get; set; }
        public int AMRMeterId { get; set; }
        public int AlarmTriggerMethodId { get; set; }
        public float Threshold { get; set; }
        public int Duration { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public bool Active { get; set; }
        [Column(TypeName = "smalldatetime")]
        public DateTime? LastRunDTM { get; set; }
        [Column(TypeName = "smalldatetime")]
        public DateTime? LastDataDTM { get; set; }
        public IEnumerable<AMRMeterTriggeredAlarm> AMRMeterTriggeredAlarms { get; set; }
    }
}
