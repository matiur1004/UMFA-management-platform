namespace ClientPortal.Models.ResponseModels
{
    public class ShopUsageVarianceReportResponse
    {
        public List<TenantShopInvoiceUsageGrouping> TenantShopInvoiceGroupings { get; set; } = new List<TenantShopInvoiceUsageGrouping>();
        public List<PeriodTotalUsageDetails> Totals { get; set; } = new List<PeriodTotalUsageDetails>();

        public List<string> PeriodList { get; set; }
    }

    public class TenantShopInvoiceUsageGrouping
    {
        public string InvGroup { get; set; }
        public string ShopId { get; set; }
        public string Shop { get; set; }
        public string Tenants { get; set; }
        public DateTime OccDTM { get; set; }
        public decimal? Average { get; set; }
        public string? Variance { get; set; }
        public List<PeriodUsageDetail> PeriodUsageDetails { get; set; } = new List<PeriodUsageDetail>();
    }

    public class PeriodTotalUsageDetails
    {
        public string? InvGroup { get; set; }
        public List<PeriodUsageDetail> PeriodUsageDetails { get; set; } = new List<PeriodUsageDetail>();
        public decimal? Average { get; set; }
        public string Variance { get; set; }
    }

    public class PeriodUsageDetail
    {
        public int PeriodId { get; set; }
        public string PeriodName { get; set; }
        public decimal? Usage { get; set; }
    }
}
