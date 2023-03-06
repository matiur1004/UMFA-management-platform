namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class TOUSeasonMonth
    {
        public int Id { get; set; }
        public int TOUSeasonId { get; set; }
        public TOUSeason TOUSeason { get; set; }
        public int MonthNo { get; set; }
        public bool Active { get; set; }
    }
}
