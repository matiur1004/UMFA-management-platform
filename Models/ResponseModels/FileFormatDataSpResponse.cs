namespace ClientPortal.Models.ResponseModels
{
    public class FileFormatDataSpResponse
    {
        public List<FileFormatData> FilesFormatData { get; set; }
    }

    public class FileFormatData
    {
        public string TenantName { get; set; }
        public string TenantExportCode { get; set; }
        public string PrimaryExportCode { get; set; }
        public string SecondaryExportCode { get; set; }
        public string AccountNr { get; set; }
        public string PeriodName { get; set; }
        public string ShopExportCode { get; set; }
        public string BuildingCode { get; set; }
        public string ShopBuildingExportCode { get; set; }
        public string ShopNr { get; set; }
        public string BuildingName { get; set; }
    }
}
