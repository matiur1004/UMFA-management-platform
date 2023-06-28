namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipDataResponse
    {
        public int? TenantId { get; set; }
        public int? AccountId { get; set; }
        public int? PeriodId { get; set; }
        public int? ShopId { get; set; }
        public int? SplitIndicator { get; set; }
        public string? TenantName { get; set; }
        public string? Units { get; set; }
        public decimal? Excl { get; set; }
        public decimal? Vat { get; set; }
        public decimal? Incl { get; set; }

        public TenantSlipDataResponse(TenantSlipData data) 
        {
            TenantId = data.TenantID;
            AccountId = data.AccountId;
            PeriodId = data.PeriodID;
            ShopId = data.ShopID;
            SplitIndicator = data.SplitIndicator;
            TenantName = data.TenantName;
            Units = data.Units;
            Excl = data.Excl;
            Vat = data.Vat;
            Incl = data.Incl;
        }
    }
}
