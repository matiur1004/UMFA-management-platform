namespace ClientPortal.Models.ResponseModels
{
    public class ConsumptionSummarySpResponse
    {
        public List<ConsumptionSummaryHeader> Headers { get; set; }
        public List<ConsumptionSummaryDetail> Details { get; set; }
    }
    public class ConsumptionSummaryHeader
    {
        public int PeriodID {get; set;}
        public int BuildingID {get; set;}
        public string Name {get; set;}
        public string ReadingName {get; set;}
        public string ReadingShort {get; set;}
        public string PeriodStart {get; set;}
        public string PeriodEnd {get; set;}
        public int Days {get; set;}
        public string CustomLogo {get; set;}
        public string SplitMessge { get; set; }

    }
    public class ConsumptionSummaryDetail
    {
        public int ServiceSpecID { get; set; }
        public int BuildingID { get; set; }
        public int PeriodID { get; set; }
        public string Tenant { get; set; }
        public string Shop { get; set; }
        public string ShopNr { get; set; }
        public string FinAccNo { get; set; }
        public string MeterNo { get; set; }
        public int Factor { get; set; }
        public double TotalArea { get; set; }
        public double AssArea { get; set; }
        public string InvGroup { get; set; }
        public string PreviousReadingDate { get; set; }
        public string ReadingDate { get; set; }
        public string PreviousReading { get; set; }
        public string CurrentReading { get; set; }
        public double? Usage { get; set; }
        public double ShopCons { get; set; }
        public double ShopBC { get; set; }
        public double TotBC { get; set; }
        public double TotCons { get; set; }
        public double Excl { get; set; }
        public double Vat { get; set; }
        public double Incl { get; set; }
        public bool Recoverable { get; set; }
    }
}
