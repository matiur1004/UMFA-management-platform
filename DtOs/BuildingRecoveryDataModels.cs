namespace ClientPortal.DtOs
{
    public class Header
    {
        public string Title { get; set; }
        public decimal BuildingArea { get; set; }
    }

    public class Tenantdata
    {
        public int PeriodID { get; set; }
        public long SortId { get; set; }
        public int ItemSort { get; set; }
        public string Item { get; set; }
        public string Month { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string PeriodDays { get; set; }
        public float KWHUsage { get; set; }
        public float KVAUsage { get; set; }
        public float TotalAmount { get; set; }
        public bool HighLight { get; set; }
        public bool Recoverable { get; set; }
    }

    public class Bulkdata
    {
        public int PeriodID { get; set; }
        public long SortId { get; set; }
        public int ItemSort { get; set; }
        public string Item { get; set; }
        public string Month { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string PeriodDays { get; set; }
        public float KWHUsage { get; set; }
        public float KVAUsage { get; set; }
        public float TotalAmount { get; set; }
        public bool HighLight { get; set; }
        public bool Recoverable { get; set; }
    }

    public class CouncilData
    {
        public int PeriodID { get; set; }
        public long SortId { get; set; }
        public int ItemSort { get; set; }
        public string Item { get; set; }
        public string Month { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string PeriodDays { get; set; }
        public float KWHUsage { get; set; }
        public float KVAUsage { get; set; }
        public float TotalAmount { get; set; }
        public bool HighLight { get; set; }
        public bool Recoverable { get; set; }
    }
}


