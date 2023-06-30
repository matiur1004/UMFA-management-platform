namespace ClientPortal.Models.RequestModels
{
    public class TenantSlipDataSpRequest
    {
        public int? TenantId { get; set; }
        public int? PeriodId { get; set; }
        public string ShopIDs { get; set; }
        public int? SplitIndicator { get; set; }

        public TenantSlipDataSpRequest(TenantSlipDataRequest request) 
        {
            TenantId = request.TenantId;
            PeriodId = request.PeriodId;
            SplitIndicator = request.SplitIndicator;

            if(request.ShopIDs is null || !request.ShopIDs.Any())
            {
                ShopIDs = "0";
            }
            else
            {
                ShopIDs = string.Join(",", request.ShopIDs);
            }
        }
    }
}
