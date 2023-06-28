namespace ClientPortal.Models.ResponseModels
{
    public class UMFATenantsSpResponse
    {
        public List<UMFATenant> Tenants { get; set; }
    }

    public class UMFATenant
    {
        public int TenantId { get; set; }
        public string TenantName { get; set; }
        public string Description { get; set; }
    }
}
