using System.Net.Mail;

namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipReportSpResponse
    {
        public List<TenantSlipReport> Slips { get; set; }
    }

    public class TenantSlipReport
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
    }
}
