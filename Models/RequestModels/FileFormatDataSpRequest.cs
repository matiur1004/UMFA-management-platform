namespace ClientPortal.Models.RequestModels
{
    public class FileFormatDataSpRequest
    {
        public int BuildingId { get; set; }
        public int PeriodId { get; set; }
        public int ReportTypeId { get; set; }
        public int TenantId { get; set; }
        public int ShopId { get; set; }
    }
}
