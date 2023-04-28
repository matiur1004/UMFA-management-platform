
namespace ClientPortal.DtOs
{
    public class AmrJobToRun
    {
        public string SqdUrl { get; set; }
        public string ProfileName { get; set; }
        public string ScadaUserName { get; set; }
        public string ScadaPassword { get; set; }
        public int JobType { get; set; }
        public string CommsId { get; set; }
        public string Key1 { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int HeaderId { get; set; }
        public int DetailId { get; set; }
    }
}
