namespace ClientPortal.Data.Entities.PortalEntities
{
    public class AMRMetersWithAlarms
    {
        public int AMRMeterId { get; set; }
        public string MeterNo { get;set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string ScadaMeterNo { get; set; }
        public bool Night_Flow { get; set;}
        public bool Burst_Pipe { get; set;}  
        public bool Leak { get; set;}
        public bool Daily_Usage { get; set;}
        public bool Peak { get; set;}
        public bool Average { get; set;}

    }
}
