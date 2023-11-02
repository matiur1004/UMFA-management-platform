namespace ClientPortal.Models.ResponseModels
{
    public class UmfaTenantDashboardOccupation
    {
        public int ShopId { get; set; }
        public int TenantId { get; set; }
        public string TenantName { get; set; }
        public bool TenantActive { get; set; }
        public DateTime OccupationDTM { get; set; }
        public DateTime VacationDTM { get; set; }
    }
}
