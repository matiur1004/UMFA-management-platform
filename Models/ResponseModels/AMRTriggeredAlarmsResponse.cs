namespace ClientPortal.Models.ResponseModels
{
    public class AMRTriggeredAlarmsResponse
    {
        public List<AMRMeterTriggeredAlarmInfo> Alarms { get; set; }
    }

    public class AMRMeterTriggeredAlarmInfo
    {
        public int AMRMeterTriggeredAlarmId { get; set; }
        public string Partner { get; set; }
        public string Building { get; set; }
        public int BuildingUmfaId { get; set; }
        public string MeterNo { get; set; }
        public int AMRMeterId { get; set; }
        public string MeterSerial { get; set; }
        public string Description { get; set; }
        public string AlarmName { get; set; }
        public string AlarmDescription { get; set; }
        public DateTime OccStartDTM { get; set; }
        public decimal Threshold { get; set; }
        public int Duration { get; set; }
        public decimal AverageObserved { get; set; }
        public decimal MaximumObserved { get; set; }
    }
}
