namespace ClientPortal.Models.ScadaRequestsForTableUpdate
{
    public class ScadaRequestDetailTable
    {
        public int Id { get; set; }
        public int HeaderId { get; set; }
        public int AmrMeterId { get; set; }
        public int AmrScadaUserId { get; set; }
        public int Status { get; set; }
        public int Active { get; set; }
        public DateTime LastRunDTM { get; set; }
        public DateTime CurrentRunDTM { get; set; }
        public int UpdateFrequency { get; set; }
        public DateTime LastDataDate { get; set; }
    }
}
