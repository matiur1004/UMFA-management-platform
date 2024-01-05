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
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PeriodDays { get; set; }
        public double Usage { get; set; }
        public double Demand { get; set; }
        public decimal TotalAmount { get; set; }
        public bool Recoverable { get; set; }
        public string PeriodName { get; set; }
        public double GLA { get; set; }
    }
}
