namespace ClientPortal.Models.ResponseModels
{
    public class TenantMainDashboardResponse : UmfaMainDashboardTenantResponse
    {
        public SmartServicesTenantStats SmartServices { get; set; }

        public TenantMainDashboardResponse(UmfaMainDashboardTenantResponse dashboardResponse, SmartServiceTenantSpResponse smartServicesSpResponse) 
        {
            Shops = dashboardResponse.Shops;
            Tenants = dashboardResponse.Tenants;
            Stats = dashboardResponse.Stats;
            SmartServices = smartServicesSpResponse.SmartServices[0];
        }
    }
}
