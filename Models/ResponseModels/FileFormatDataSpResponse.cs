using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class FileFormatDataSpResponse
    {
        // [JsonPropertyName("filesFormatData")]
        public List<FileFormatData> FilesFormatData { get; set; }
    }

    public class FileFormatData
    {
        // [JsonPropertyName("tenantName")]
        public string TenantName { get; set; }

        // [JsonPropertyName("tenantExportCode")]
        public string TenantExportCode { get; set; }

        // [JsonPropertyName("primaryExportCode")]
        public string PrimaryExportCode { get; set; }

        // [JsonPropertyName("secondaryExportCode")]
        public string SecondaryExportCode { get; set; }

        // [JsonPropertyName("accountNr")]
        public string AccountNr { get; set; }

        // [JsonPropertyName("periodName")]
        public string PeriodName { get; set; }

        // [JsonPropertyName("shopExportCode")]
        public string ShopExportCode { get; set; }

        // [JsonPropertyName("buildingCode")]
        public string BuildingCode { get; set; }

        // [JsonPropertyName("shopBuildingExportCode")]
        public string ShopBuildingExportCode { get; set; }

        // [JsonPropertyName("shopNr")]
        public string ShopNr { get; set; }

        // [JsonPropertyName("buildingName")]
        public string BuildingName { get; set; }
    }
}
