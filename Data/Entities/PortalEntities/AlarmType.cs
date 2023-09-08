namespace ClientPortal.Data.Entities.PortalEntities
{
    public class AlarmType
    {
        public int AlarmTypeId { get; set;}
        public int SupplyTypeId { get; set;}
        public string AlarmName { get; set;}
        public string AlarmDescription { get; set;}
        public bool Active { get; set;}

        public ICollection<AMRMeterAlarm> AMRMeterAlarms { get; set;}
    }
}

