using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class DashboardShopsSpResponse
    {
        // // [JsonPropertyName("infos")]
        public List<DashboardShopInfo> Infos { get; set; }

        // // [JsonPropertyName("billings")]
        public List<DashboardShopBilling> Billings { get; set; }

        // // [JsonPropertyName("occupations")]
        public List<DashboardShopOccupation> Occupations { get; set; }

        // // [JsonPropertyName("assignedMeters")]
        public List<DashboardShopAssignedMeter> AssignedMeters { get; set; }

        // // [JsonPropertyName("readings")]
        public List<DasboardShopReading> Readings { get; set; }
    }

    public class DashboardShopInfo
    {
        // // [JsonPropertyName("id")]
        public int Id { get; set; }

        // // [JsonPropertyName("shopID")]
        public int ShopID { get; set; }

        // // [JsonPropertyName("isVacant")]
        public bool IsVacant { get; set; }

        // // [JsonPropertyName("shopNr")]
        public string ShopNr { get; set; }

        // // [JsonPropertyName("shopName")]
        public string ShopName { get; set; }

        // // [JsonPropertyName("shopDescription")]
        public string ShopDescription { get; set; }

        // // [JsonPropertyName("shopArea")]
        public double ShopArea { get; set; }

        // // [JsonPropertyName("shopActive")]
        public bool ShopActive { get; set; }

        // // [JsonPropertyName("noOfOccupations")]
        public int NoOfOccupations { get; set; }
    }

    public class DashboardShopBilling
    {
        // // [JsonPropertyName("id")]
        public int Id { get; set; }

        // // [JsonPropertyName("shopID")]
        public int ShopID { get; set; }

        // // [JsonPropertyName("groupID")]
        public int GroupID { get; set; }

        // // [JsonPropertyName("periodID")]
        public int PeriodID { get; set; }

        // // [JsonPropertyName("periodName")]
        public string PeriodName { get; set; }

        // // [JsonPropertyName("groupName")]
        public string GroupName { get; set; }

        // // [JsonPropertyName("usage")]
        public double Usage { get; set; }

        // // [JsonPropertyName("amount")]
        public decimal Amount { get; set; }
    }

    public class DashboardShopOccupation
    {
        // // [JsonPropertyName("id")]
        public int Id { get; set; }

        // // [JsonPropertyName("shopID")]
        public int ShopID { get; set; }

        // // [JsonPropertyName("tenantId")]
        public int TenantId { get; set; }

        // // [JsonPropertyName("tenantName")]
        public string TenantName { get; set; }

        // // [JsonPropertyName("tenantActive")]
        public bool TenantActive { get; set; }

        // // [JsonPropertyName("occupationDTM")]
        public DateTime OccupationDTM { get; set; }

        // // [JsonPropertyName("vacationDTM")]
        public DateTime? VacationDTM { get; set; }
    }

    public class DashboardShopAssignedMeter
    {
        // // [JsonPropertyName("id")]
        public int Id { get; set; }

        // // [JsonPropertyName("shopID")]
        public int ShopID { get; set; }

        // // [JsonPropertyName("buildingServiceID")]
        public int BuildingServiceID { get; set; }

        // // [JsonPropertyName("meterNo")]
        public string MeterNo { get; set; }

        // // [JsonPropertyName("assType")]
        public string AssType { get; set; }
    }

    public class DasboardShopReading
    {
        // // [JsonPropertyName("id")]
        public int Id { get; set; }

        // // [JsonPropertyName("buildingServiceID")]
        public int BuildingServiceID { get; set; }

        // // [JsonPropertyName("periodId")]
        public int PeriodId { get; set; }

        // // [JsonPropertyName("periodName")]
        public string PeriodName { get; set; }

        // // [JsonPropertyName("periodStart")]
        public DateTime PeriodStart { get; set; }

        // // [JsonPropertyName("periodEnd")]
        public DateTime PeriodEnd { get; set; }

        // // [JsonPropertyName("readingDate")]
        public DateTime ReadingDate { get; set; }

        // // [JsonPropertyName("actualReading")]
        public double ActualReading { get; set; }

        // // [JsonPropertyName("readingUsage")]
        public double ReadingUsage { get; set; }

        // // [JsonPropertyName("readingMethod")]
        public string ReadingMethod { get; set; }

        // // [JsonPropertyName("photo")]
        public string Photo { get; set; }
    }
}
