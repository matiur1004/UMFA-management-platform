namespace ClientPortal.Models.ResponseModels
{
    public class ShopUsageVarianceReportResponse
    {
        public List<TenantShopInvoiceGrouping> TenantShopInvoiceGroupings { get; set; } = new List<TenantShopInvoiceGrouping>();
        public List<PeriodTotalDetails> Totals { get; set; } = new List<PeriodTotalDetails>();
    }

    public class TenantShopInvoiceGrouping
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

    public class PeriodTotalDetails
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
