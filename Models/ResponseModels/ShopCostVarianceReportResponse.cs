namespace ClientPortal.Models.ResponseModels
{
    public class ShopCostVarianceReportResponse
    {
        public List<TenantShopInvoiceCostGrouping> TenantShopInvoiceGroupings { get; set; } = new List<TenantShopInvoiceCostGrouping>();
        public List<PeriodTotalCostDetails> Totals { get; set; } = new List<PeriodTotalCostDetails>();

        public List<string> PeriodList { get; set; }
    }

    public class TenantShopInvoiceCostGrouping
    {
        public string Group { get; set; }
        public int GroupId { get; set; }
        public string ShopId { get; set; }
        public string Shop { get; set; }
        public string Tenants { get; set; }
        public DateTime OccDTM { get; set; }
        public decimal? Average { get; set; }
        public string? Variance { get; set; }
        public bool Recoverable { get; set; }
        public List<PeriodCostDetail> PeriodCostDetails { get; set; } = new List<PeriodCostDetail>();
    }

    public class PeriodTotalCostDetails
    {
        public string GroupName { get; set; }
        public int GroupId { get; set; }
        public List<PeriodCostDetail> PeriodCostDetails { get; set; } = new List<PeriodCostDetail>();
        public decimal? Average { get; set; }
        public string Variance { get; set; }
    }

    public class PeriodCostDetail
    {
        public int PeriodId { get; set; }
        public string PeriodName { get; set; }
        public decimal? Cost { get; set; }
    }
}
