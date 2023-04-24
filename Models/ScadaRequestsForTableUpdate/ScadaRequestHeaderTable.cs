namespace ClientPortal.Models.ScadaRequestsForTableUpdate
{
    public class ScadaRequestHeaderTable
    {
        public int Id { get; set; }
        public int Status { get; set; }
        public int Active { get; set; }
        public DateTime CreatedDTM { get; set; } = DateTime.Now;
        public DateTime StartRunDTM { get; set; }
        public DateTime LastRunDTM { get; set; }
        public DateTime CurrentRunDTM { get; set; }
        public int JobType { get; set; }
        public string Description { get; set; }
        public int Interval { get; set; }
    }
}
