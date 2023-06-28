namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipCardInfoSpResponse
    {
        public List<TenantSlipCardInfo> TenantSlipCardInfos { get; set; }
    }

    public class TenantSlipCardInfo
    {
        public int Tenants { get; set; }
        public int Shops { get; set; }
        public decimal Amount { get; set; }
    }
}
