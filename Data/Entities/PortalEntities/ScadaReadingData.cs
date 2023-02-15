namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class ScadaReadingData
    {
        public int Id { get; set; }
        public int ProcessedStatus { get; set; } //0: New entry, 1: processed
        public string SerialNumber { get; set; }
        public string Description { get; set; }
        public string ReadingResult { get; set; }
        public DateTime ReadingDate { get; set; }
        public float P1 { get; set; }
        public float P2 { get; set; }
        public float Q1 { get; set; }
        public float Q2 { get; set; }
        public float Q3 { get; set; }
        public float Q4 { get; set; }
        public int ReadingStatus { get; set; }
        public string KvaResult { get; set; }
        public DateTime kvaDate { get; set; }
        public float kVA { get; set; }
        public bool IsActive { get; set; }
    }
}
