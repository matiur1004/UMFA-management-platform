namespace ClientPortal.Models.RequestModels
{
    public class AMRMeterAlarmRequest
    {
        public int AMRMeterAlarmId { get; set; }
        public string AlarmTypeName { get; set; }
        public int AMRMeterId { get; set; }
        public int AlarmTriggerMethodId { get; set; }
        public float Threshold { get; set; }
        public int Duration { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public bool Active { get; set; }
        public DateTime? LastRunDTM { get; set; }
        public DateTime? LastDataDTM { get; set; }

    }
}
