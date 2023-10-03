namespace ClientPortal.Models.ResponseModels
{
    public class UmfaTenantDashboardTenant
    {
        public int TenantId { get; set; }
        public string TenantName { get; set; }
        public string Description { get; set; }
        public bool Recoverable { get; set; }
        public string ExportCode { get; set; }
        public int ShopsLinked { get; set; }
        public string ShopNumbers { get; set; }
    }
}
