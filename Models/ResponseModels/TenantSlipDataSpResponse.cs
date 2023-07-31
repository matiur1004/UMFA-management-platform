using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipDataSpResponse
    {
        [JsonPropertyName("headers")]
        public List<TenantSlipDataHeader> Headers { get; set; }

        [JsonPropertyName("details")]
        public List<TenantSlipDataDetails> Details { get; set; }

        [JsonPropertyName("meterReadings")]
        public List<TenantSlipDataMeterReadings> MeterReadings { get; set; }

        [JsonPropertyName("graphData")]
        public List<TenantSlipDataGraphData> GraphData { get; set; }
    }

    public class TenantSlipDataHeader
    {
        [JsonPropertyName("splitDate")]
        public string SplitDate { get; set; }

        [JsonPropertyName("tenantID")]
        public int TenantID { get; set; }

        [JsonPropertyName("exportCode")]
        public string ExportCode { get; set; }

        [JsonPropertyName("tenantName")]
        public string TenantName { get; set; }

        [JsonPropertyName("addLine1")]
        public string AddLine1 { get; set; }

        [JsonPropertyName("addLine2")]
        public string AddLine2 { get; set; }

        [JsonPropertyName("addLine3")]
        public string AddLine3 { get; set; }

        [JsonPropertyName("addLine4")]
        public string AddLine4 { get; set; }

        [JsonPropertyName("code")]
        public string Code { get; set; }

        [JsonPropertyName("tenantVat")]
        public string TenantVat { get; set; }

        [JsonPropertyName("buildingName")]
        public string BuildingName { get; set; }

        [JsonPropertyName("units")]
        public string Units { get; set; }

        [JsonPropertyName("area")]
        public decimal Area { get; set; }

        [JsonPropertyName("supplierName")]
        public string SupplierName { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("businessName")]
        public string BusinessName { get; set; }

        [JsonPropertyName("vatNr")]
        public string VatNr { get; set; }

        [JsonPropertyName("compRegNr")]
        public string CompRegNr { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("webURL")]
        public string WebURL { get; set; }

        [JsonPropertyName("physicalAdd")]
        public string PhysicalAdd { get; set; }

        [JsonPropertyName("postalAdd")]
        public string PostalAdd { get; set; }

        [JsonPropertyName("telNo")]
        public string TelNo { get; set; }

        [JsonPropertyName("faxNo")]
        public string FaxNo { get; set; }

        [JsonPropertyName("periodName")]
        public string PeriodName { get; set; }

        [JsonPropertyName("days")]
        public int Days { get; set; }

        [JsonPropertyName("finAccNo")]
        public string FinAccNo { get; set; }

        [JsonPropertyName("comments")]
        public string Comments { get; set; }

        [JsonPropertyName("vacated")]
        public string Vacated { get; set; }

        [JsonPropertyName("logoCrystalImage")]
        public byte[] LogoCrystalImage { get; set; }

        [JsonPropertyName("periodStart")]
        public string PeriodStart { get; set; }

        [JsonPropertyName("periodEnd")]
        public string PeriodEnd { get; set; }

        [JsonPropertyName("splitDays")]
        public int SplitDays { get; set; }
    }

    public class TenantSlipDataDetails
    {
        [JsonPropertyName("date")]
        public string Date { get; set; }

        [JsonPropertyName("service")]
        public string Service { get; set; }

        [JsonPropertyName("levy")]
        public decimal Levy { get; set; }

        [JsonPropertyName("vat")]
        public decimal Vat { get; set; }

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("totalExc")]
        public decimal TotalExc { get; set; }

        [JsonPropertyName("totalVat")]
        public decimal TotalVat { get; set; }

        [JsonPropertyName("totalIncluding")]
        public decimal TotalIncluding { get; set; }

        [JsonPropertyName("taxPerc")]
        public decimal TaxPerc { get; set; }
    }

    public class TenantSlipDataMeterReadings
    {
        [JsonPropertyName("meterNo")]
        public string MeterNo { get; set; }

        [JsonPropertyName("prevReadingDate")]
        public string PrevReadingDate { get; set; }

        [JsonPropertyName("prevReading")]
        public string PrevReading { get; set; }

        [JsonPropertyName("currReading")]
        public string CurrReading { get; set; }

        [JsonPropertyName("currReadingDate")]
        public string CurrReadingDate { get; set; }

        [JsonPropertyName("factor")]
        public string Factor { get; set; }

        [JsonPropertyName("usage")]
        public string Usage { get; set; }

        [JsonPropertyName("perc")]
        public decimal Perc { get; set; }

        [JsonPropertyName("cons")]
        public decimal Cons { get; set; }
    }

    public class TenantSlipDataGraphData
    {
        [JsonPropertyName("date")]
        public string Date { get; set; }

        [JsonPropertyName("readingShort")]
        public string ReadingShort { get; set; }

        [JsonPropertyName("levy")]
        public decimal Levy { get; set; }

        [JsonPropertyName("vat")]
        public decimal Vat { get; set; }

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }
    }
}
