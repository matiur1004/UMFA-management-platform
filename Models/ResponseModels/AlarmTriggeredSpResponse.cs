namespace ClientPortal.Models.ResponseModels
{
    public class AlarmTriggeredSpResponse
    {
        public List<AlarmTriggeredResultInfoModel> AlarmTriggeredResultInfoModels { get; set; }
        public List<AlarmTriggeredResultDataModel> AlarmTriggeredResultDataModels { get; set; }
    }
    public class AlarmTriggeredResultInfoModel
    {
        public int AMRMeterTriggeredAlarmId { get; set; }
        public bool Acknowledged { get; set; }
        public string AlarmName { get; set; }
        public string AlarmDescription { get; set; }
        public string MeterSerial { get; set; }
        public string UMFAMeterNo { get; set; }
        public string MeterDescription { get; set; }
        public string Partner { get; set; }
        public string Building { get; set; }
        public decimal Threshold { get; set; }
        public int Duration { get; set; }
        public decimal AverageObserved { get; set; }
        public decimal MaximumObserved { get; set; }

    }

    public class AlarmTriggeredResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }
}
