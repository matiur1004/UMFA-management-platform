namespace ClientPortal.Data.Entities
{
    [Serializable]
    public class TOUDayOfWeekDayType
    {
        public int Id { get; set; }
        public int TOUHeaderId { get; set; }
        public TOUHeader TOUHeader { get; set; }
        public int TOUDaysOfWeekId { get; set; }
        public TOUDaysOfWeek TOUDaysOfWeek { get; set; }
        public int TOUDayTypeId { get; set; }
        public TOUDayType TOUDayType { get; set; }
        public bool Active { get; set; }
    }
}
