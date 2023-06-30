using System.Net.Mail;

namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipDataSpResponse
    {
        public List<TenantSlipData> Slips { get; set; }
    }

    public class TenantSlipData
    {
        public int? TenantID { get; set; }
        public int? AccountId { get; set; }
        public int? PeriodID { get; set; }
        public int? ShopID { get; set; }
        public int? SplitIndicator { get; set; }
        public string? TenantName { get; set; }
        public string? Units { get; set; }
        public decimal? Excl { get; set; }
        public decimal? Vat { get; set; }
        public decimal? Incl { get; set; }

        //public int? TenantID { get; set; }
        //public int? ShopID { get; set; }
        //public string? TenantName { get; set; }
        //public int? AccountId { get; set; }
        //public int? FinAccNo { get; set; }
        //public decimal? Excl { get; set; }
        //public decimal? Vat { get; set; }
        //public decimal? Incl { get; set; }
        //public string? ExportCode { get; set; }
        //public string? Units { get; set; }
        //public string? TenantExportCode1 { get; set; }
        //public string? TenantExportCode2 { get; set; }
        //public string? ShopExportCode { get; set; }
        //public string? ShopBuildingExportCode { get; set; }
        //public string? FileName { get; set; }
        //public int? EmailStatement { get; set; }
        //public string? EmailAddress { get; set; }
        //public int? BuildingCode { get; set; }
        //public string? BuildingName { get; set; }
        //public string? PeriodName { get; set; }
        //public string? ReadingDate { get; set; }
        //public int? BuildingID { get; set; }
        //public int? PeriodID { get; set; }
        //public int? PartnerID { get; set; }
        //public int? SplitIndicator { get; set; }
    }
}
