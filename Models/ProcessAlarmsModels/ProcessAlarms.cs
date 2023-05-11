namespace ClientPortal.Models.ProcessAlarmsModels
{
    [Serializable]
    public class ProcessAlarmsProfile
    {
        public DateTime ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    [Serializable]
    public class ProcessAlarmsTriggered
    {
        public int NoOfAlarms { get; set; }
    }
}
