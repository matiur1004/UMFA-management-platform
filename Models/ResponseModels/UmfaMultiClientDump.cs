namespace ClientPortal.Models.ResponseModels
{
    public class UmfaMultiClientDump
    {
        public int DumpId { get; set; }
        public string Building { get; set; }
        public long GroupSort { get; set; }
        public string GroupName { get; set; }
        public int PeriodId { get; set; }
        public long SortId { get; set; }
        public int ItemSort { get; set; }
        public string Item { get; set; }
        public string Month { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string PeriodDays { get; set; }
        public double kWhUsage { get; set; }
        public double kVAUsage { get; set; }
        public double kLUsage { get; set; }
        public decimal TotalAmount { get; set; }
        public bool Recoverable { get; set; }
    }
}
