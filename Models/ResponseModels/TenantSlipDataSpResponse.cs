namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipDataSpResponse
    {
        public List<TenantSlipDataHeader> Headers { get; set; }
        public List<TenantSlipDataDetails> Details { get; set; }
        public List<TenantSlipDataMeterReadings> MeterReadings { get; set; }
        public List<TenantSlipDataGraphData> GraphData { get; set; }
    }

    public class TenantSlipDataHeader
    {
        public string SplitDate { get; set; }
        public int TenantID { get; set; }
        public string ExportCode { get; set; }
        public string TenantName { get; set; }
        public string AddLine1 { get; set; }
        public string AddLine2 { get; set; }
        public string AddLine3 { get; set; }
        public string AddLine4 { get; set; }
        public string Code { get; set; }
        public string TenantVat { get; set; }
        public string BuildingName { get; set; }
        public string Units { get; set; }
        public decimal Area { get; set; }
        public string SupplierName { get; set; }
        public string Name { get; set; }
        public string BusinessName { get; set; }
        public string VatNr { get; set; }
        public string CompRegNr { get; set; }
        public string Email { get; set; }
        public string WebURL { get; set; }
        public string PhysicalAdd { get; set; }
        public string PostalAdd { get; set; }
        public string TelNo { get; set; }
        public string FaxNo { get; set; }
        public string PeriodName { get; set; }
        public int Days { get; set; }
        public string FinAccNo { get; set; }
        public string Comments { get; set; }
        public string Vacated { get; set; }
        public byte[] LogoCrystalImage { get; set; }
        public string PeriodStart { get; set; }
        public string PeriodEnd { get; set; }
        public int SplitDays { get; set; }

    }

    public class TenantSlipDataDetails
    {
        public string Date { get; set; }
        public string Service { get; set; }
        public decimal Levy { get; set; }
        public decimal Vat { get; set; }
        public decimal Amount { get; set; }
        public decimal TotalExc { get; set; }
        public decimal TotalVat { get; set; }
        public decimal TotalIncluding { get; set; }
        public decimal TaxPerc { get; set; }
    }

    public class TenantSlipDataMeterReadings
    {
        public string MeterNo { get; set; }
        public string PrevReadingDate { get; set; }
        public string PrevReading { get; set; }
        public string CurrReading { get; set; }
        public string CurrReadingDate { get; set; }
        public string Factor { get; set; }
        public string Usage { get; set; }
        public decimal Perc { get; set; }
        public decimal Cons { get; set; }
    }

    public class TenantSlipDataGraphData
    {
        public string Date { get; set; }
        public string ReadingShort { get; set; }
        public decimal Levy { get; set; }
        public decimal Vat { get; set; }
        public decimal Amount { get; set; }
    }
}
