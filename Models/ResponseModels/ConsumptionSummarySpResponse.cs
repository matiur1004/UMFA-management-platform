using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class ConsumptionSummarySpResponse
    {
        public List<ConsumptionSummaryHeader> Headers { get; set; }
        public List<ConsumptionSummaryDetail> Details { get; set; }
    }
    public class ConsumptionSummaryHeader
    {
        // // [JsonPropertyName("periodID")]
        public int PeriodID { get; set; }

        // // [JsonPropertyName("buildingID")]
        public int BuildingID { get; set; }

        // // [JsonPropertyName("name")]
        public string Name { get; set; }

        // // [JsonPropertyName("readingName")]
        public string ReadingName { get; set; }

        // // [JsonPropertyName("readingShort")]
        public string ReadingShort { get; set; }

        // // [JsonPropertyName("periodStart")]
        public string PeriodStart { get; set; }

        // // [JsonPropertyName("periodEnd")]
        public string PeriodEnd { get; set; }

        // // [JsonPropertyName("days")]
        public int Days { get; set; }

        // // [JsonPropertyName("customLogo")]
        public string CustomLogo { get; set; }

        // // [JsonPropertyName("splitMessage")]
        public string SplitMessage { get; set; }
    }

    public class ConsumptionSummaryDetail
    {
        // // [JsonPropertyName("serviceSpecID")]
        public int ServiceSpecID { get; set; }

        // // [JsonPropertyName("buildingID")]
        public int BuildingID { get; set; }

        // // [JsonPropertyName("periodID")]
        public int PeriodID { get; set; }

        // // [JsonPropertyName("tenant")]
        public string Tenant { get; set; }

        // // [JsonPropertyName("shop")]
        public string Shop { get; set; }

        // // [JsonPropertyName("shopNr")]
        public string ShopNr { get; set; }

        // // [JsonPropertyName("finAccNo")]
        public string FinAccNo { get; set; }

        // // [JsonPropertyName("meterNo")]
        public string MeterNo { get; set; }

        // // [JsonPropertyName("factor")]
        public int Factor { get; set; }

        // // [JsonPropertyName("totalArea")]
        public double TotalArea { get; set; }

        // // [JsonPropertyName("assArea")]
        public double AssArea { get; set; }

        // // [JsonPropertyName("invGroup")]
        public string InvGroup { get; set; }

        // // [JsonPropertyName("previousReadingDate")]
        public string PreviousReadingDate { get; set; }

        // // [JsonPropertyName("readingDate")]
        public string ReadingDate { get; set; }

        // // [JsonPropertyName("previousReading")]
        public string PreviousReading { get; set; }

        // // [JsonPropertyName("currentReading")]
        public string CurrentReading { get; set; }

        // // [JsonPropertyName("usage")]
        public double? Usage { get; set; }

        // // [JsonPropertyName("shopCons")]
        public double ShopCons { get; set; }

        // // [JsonPropertyName("shopBC")]
        public double ShopBC { get; set; }

        // // [JsonPropertyName("totBC")]
        public double TotBC { get; set; }

        // // [JsonPropertyName("totCons")]
        public double TotCons { get; set; }

        // // [JsonPropertyName("excl")]
        public double Excl { get; set; }

        // // [JsonPropertyName("vat")]
        public double Vat { get; set; }

        // // [JsonPropertyName("incl")]
        public double Incl { get; set; }

        // // [JsonPropertyName("recoverable")]
        public bool Recoverable { get; set; }
    }
}
