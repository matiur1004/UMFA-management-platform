namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class ScadaRequestHeader
    {
        public int Id { get; set; }
        public int Status { get; set; } //0: not busy, 1: scheduled to run, 2: running, 3: successfully retrieved, 4: Inserted in DB , 5: Processed profile data, 6: error
        public bool Active { get; set; }
        public DateTime CreatedDTM { get; set; }
        public DateTime StartRunDTM { get; set; }
        public DateTime? LastRunDTM { get; set; }
        public DateTime? CurrentRunDTM { get; set; }
        public List<ScadaRequestDetail> ScadaRequestDetails { get; set; }
        public int JobType { get; set; } //1 for profile, 2 for readings
    }
}
